// Shared server plumbing for the API functions: Firebase sign-in checks, daily usage counters and the Claude client.
// Secrets live in Azure app settings: ANTHROPIC_API_KEY and FIREBASE_SERVICE_ACCOUNT.
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

module.exports = { verifyToken, consumeUsage, client };
