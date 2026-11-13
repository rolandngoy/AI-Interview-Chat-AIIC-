// POST /api/interviewer — the AI interviewer's reaction and optional follow-up question.
// Secrets live in Azure app settings, never in the site code:
//   ANTHROPIC_API_KEY          Anthropic API key
//   FIREBASE_SERVICE_ACCOUNT   service account JSON (verifies sign-in tokens, counts daily usage)
// Optional:
//   AI_MODEL                   default claude-opus-5-5 (use claude-haiku-5-5 for lower cost and latency)
//   DAILY_AI_REPLIES           per-user daily limit, default 60
const { app } = require('@azure/functions');
const { makeHandler } = require('../lib');

let anthropic, authAdmin, db;

function init() {
  if (anthropic) return;
  const { initializeApp, cert, getApps } = require('firebase-admin/app');
  const { getAuth } = require('firebase-admin/auth');
  const { getFirestore } = require('firebase-admin/firestore');
  const mod = require('@anthropic-ai/sdk');
  const Anthropic = mod.default || mod;

  if (!process.env.ANTHROPIC_API_KEY || !process.env.FIREBASE_SERVICE_ACCOUNT) throw new Error('not configured');
  if (!getApps().length) initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
  authAdmin = getAuth();
  db = getFirestore();
  anthropic = new Anthropic({ timeout: 25000, maxRetries: 1 });
}

const deps = {
  verifyToken: async (token) => { init(); return (await authAdmin.verifyIdToken(token)).uid; },

  // Atomically counts one AI reply for this user today; false once they are over the limit.
  consumeUsage: async (uid, day, limit) => {
    init();
    const { FieldValue } = require('firebase-admin/firestore');
    const ref = db.collection('aiUsage').doc(uid + '_' + day);
    return db.runTransaction(async (t) => {
      const snap = await t.get(ref);
      const n = snap.exists ? snap.data().count : 0;
      if (n >= limit) return false;
      t.set(ref, { uid: uid, day: day, count: n + 1, updatedAt: FieldValue.serverTimestamp() });
      return true;
    });
  },

  callModel: async (system, user) => {
    init();
    const res = await anthropic.messages.create({
      model: process.env.AI_MODEL || 'claude-opus-5-5',
      max_tokens: 2000, // thinking tokens count toward this on current models
      output_config: { effort: 'low' },
      system: system,
      messages: [{ role: 'user', content: user }]
    });
    if (res.stop_reason === 'refusal') return { refused: true };
    const text = res.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
    return { text: text };
  }
};

const handle = makeHandler(deps);

app.http('interviewer', {
  methods: ['POST'],
  authLevel: 'anonymous', // access is enforced by verifying the Firebase ID token below
  route: 'interviewer',
  handler: async (request, context) => {
    let body = null;
    try { body = await request.json(); } catch (e) {}
    const limit = parseInt(process.env.DAILY_AI_REPLIES, 10) || 60;
    const out = await handle(request.headers.get('x-firebase-token'), body, limit);
    if (out.status >= 500) context.log('interviewer unavailable');
    return { status: out.status, jsonBody: out.body, headers: { 'Cache-Control': 'no-store' } };
  }
});
