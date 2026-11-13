// POST /api/interviewer — the AI interviewer's brief acknowledgement and optional follow-up question.
// Settings (Azure app settings):
//   ANTHROPIC_API_KEY, FIREBASE_SERVICE_ACCOUNT   required (see README)
//   AI_MODEL                   default claude-opus-5-5 (claude-haiku-5-5 is cheaper and faster)
//   DAILY_AI_REPLIES           per-user daily limit, default 60
const { app } = require('@azure/functions');
const { makeHandler } = require('../lib');
const infra = require('../infra');

const deps = {
  verifyToken: infra.verifyToken,
  consumeUsage: (uid, day, limit) => infra.consumeUsage(uid, day, limit, 'replies'),
  callModel: async (system, user) => {
    const res = await infra.client().messages.create({
      model: process.env.AI_MODEL || 'claude-opus-5-5',
      max_tokens: 2000, // thinking tokens count toward this on current models
      output_config: { effort: 'low' },
      system: system,
      messages: [{ role: 'user', content: user }]
    });
    if (res.stop_reason === 'refusal') return { refused: true };
    return { text: res.content.filter((b) => b.type === 'text').map((b) => b.text).join('') };
  }
};

const handle = makeHandler(deps);

app.http('interviewer', {
  methods: ['POST'],
  authLevel: 'anonymous', // access is enforced by verifying the Firebase ID token
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
