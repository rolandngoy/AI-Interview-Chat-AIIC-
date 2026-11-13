// Shared server plumbing for the API functions: Firebase sign-in checks, daily usage counters and the AI clients.
// Secrets live only in Azure app settings (never in the website code):
//   OPENAI_API_KEY or ANTHROPIC_API_KEY, and FIREBASE_SERVICE_ACCOUNT.
// When OPENAI_API_KEY is set, OpenAI is used; otherwise Anthropic.
let ready, anthropic, authAdmin, db;

const useOpenAI = () => !!process.env.OPENAI_API_KEY;

function init() {
  if (ready) return;
  const { initializeApp, cert, getApps } = require('firebase-admin/app');
  const { getAuth } = require('firebase-admin/auth');
  const { getFirestore } = require('firebase-admin/firestore');

  if (!(useOpenAI() || process.env.ANTHROPIC_API_KEY) || !process.env.FIREBASE_SERVICE_ACCOUNT) throw new Error('not configured');
  if (!getApps().length) initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  authAdmin = getAuth();
  db = getFirestore();
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

module.exports = { verifyToken, consumeUsage, client, useOpenAI, openaiChat };
