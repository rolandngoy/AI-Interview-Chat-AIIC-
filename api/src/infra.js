// Shared server plumbing for the API functions: Firebase sign-in checks, daily usage counters and the AI clients.
// Secrets live only in Azure app settings (never in the website code):
//   OPENAI_API_KEY or ANTHROPIC_API_KEY, and FIREBASE_SERVICE_ACCOUNT.
// When OPENAI_API_KEY is set, OpenAI is used; otherwise Anthropic.
let ready, anthropic, authAdmin, db;

const useOpenAI = () => !!process.env.OPENAI_API_KEY;

function initFirebase() {
  if (authAdmin) return;
  const { initializeApp, cert, getApps } = require('firebase-admin/app');
  const { getAuth } = require('firebase-admin/auth');
  const { getFirestore } = require('firebase-admin/firestore');
  const notConfigured = (why) => Object.assign(new Error('not configured'), { code: 'not_configured', why: why });
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) throw notConfigured('FIREBASE_SERVICE_ACCOUNT is not set');
  try {
    if (!getApps().length) initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  } catch (e) { throw notConfigured('FIREBASE_SERVICE_ACCOUNT is not valid service-account JSON'); }
  authAdmin = getAuth();
  db = getFirestore();
}

function init() {
  if (ready) return;
  if (!(useOpenAI() || process.env.ANTHROPIC_API_KEY)) throw new Error('not configured');
  initFirebase();
  if (!useOpenAI()) {
    const mod = require('@anthropic-ai/sdk');
    const Anthropic = mod.default || mod;
    anthropic = new Anthropic({ timeout: 25000, maxRetries: 1 });
  }
  ready = true;
}

// Calls OpenAI's Chat Completions API from the server. Returns { text } or { refused: true }.
// opts: { model, maxTokens, timeoutMs, schema, schemaName }
async function openaiChat(system, user, opts) {
  if (!process.env.OPENAI_API_KEY) throw new Error('not configured');
  const body = {
    model: opts.model,
    max_completion_tokens: opts.maxTokens,
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }]
  };
  if (opts.schema) body.response_format = { type: 'json_schema', json_schema: { name: opts.schemaName || 'result', strict: true, schema: opts.schema } };
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.OPENAI_API_KEY },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(opts.timeoutMs || 25000)
  });
  if (!res.ok) throw new Error('openai ' + res.status); // the error body is not logged so nothing sensitive leaks
  const data = await res.json();
  const msg = data.choices && data.choices[0] && data.choices[0].message;
  if (!msg) throw new Error('openai empty');
  if (msg.refusal) return { refused: true };
  return { text: msg.content || '' };
}

async function verifyToken(token) {
  init();
  return (await authAdmin.verifyIdToken(token)).uid;
}

// Returns the decoded Firebase token (uid, email, email_verified, ...). Does not need the Claude key.
async function verifyTokenClaims(token) {
  initFirebase();
  return authAdmin.verifyIdToken(token);
}

// Every account with its number of saved interviews. Admin use only (the caller checks).
async function listAllUsers() {
  initFirebase();
  const users = [];
  let pageToken;
  do {
    const page = await authAdmin.listUsers(1000, pageToken);
    users.push.apply(users, page.users);
    pageToken = page.pageToken;
  } while (pageToken && users.length < 5000);
  const counts = {};
  for (let i = 0; i < users.length; i += 25) {
    await Promise.all(users.slice(i, i + 25).map(async (u) => {
      try { counts[u.uid] = (await db.collection('users').doc(u.uid).collection('sessions').count().get()).data().count; }
      catch (e) { counts[u.uid] = null; }
    }));
  }
  return { users: users, counts: counts };
}

// Atomically counts one use for this user today in the given bucket; false once they are over the limit.
async function consumeUsage(uid, day, limit, bucket) {
  init();
  const { FieldValue } = require('firebase-admin/firestore');
  const ref = db.collection('aiUsage').doc(uid + '_' + day + (bucket ? '_' + bucket : ''));
  return db.runTransaction(async (t) => {
    const snap = await t.get(ref);
    const n = snap.exists ? snap.data().count : 0;
    if (n >= limit) return false;
    t.set(ref, { uid: uid, day: day, bucket: bucket || 'replies', count: n + 1, updatedAt: FieldValue.serverTimestamp() });
    return true;
  });
}

function client() { init(); return anthropic; }

module.exports = { verifyToken, verifyTokenClaims, listAllUsers, consumeUsage, client, useOpenAI, openaiChat };
