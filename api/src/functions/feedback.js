// POST /api/feedback — AI grades (A to F), feedback and better-answer examples for a finished interview.
// The browser sends a few answers per request (the server has about 45 seconds per call), then one request for the overall summary.
// Settings (Azure app settings):
//   AI_FEEDBACK_MODEL          default: AI_MODEL, then claude-opus-5-5
//   DAILY_AI_FEEDBACK_CALLS    per-user daily limit on these requests, default 60 (about 6 interviews)
const { app } = require('@azure/functions');
const { makeFeedbackHandler } = require('../feedback');
const infra = require('../infra');

const deps = {
  verifyToken: infra.verifyToken,
  consumeUsage: (uid, day, limit) => infra.consumeUsage(uid, day, limit, 'feedback'),
  callModel: async (system, user, schema) => {
    const res = await infra.client().messages.create({
      model: process.env.AI_FEEDBACK_MODEL || process.env.AI_MODEL || 'claude-opus-5-5',
      max_tokens: 6000,
      output_config: { effort: 'low', format: { type: 'json_schema', schema: schema } },
      system: system,
      messages: [{ role: 'user', content: user }]
    }, { timeout: 38000, maxRetries: 0 }); // must finish inside the platform's request limit
    if (res.stop_reason === 'refusal') return { refused: true };
    return { text: res.content.filter((b) => b.type === 'text').map((b) => b.text).join('') };
  }
};

const handle = makeFeedbackHandler(deps);

app.http('feedback', {
  methods: ['POST'],
  authLevel: 'anonymous', // access is enforced by verifying the Firebase ID token
  route: 'feedback',
  handler: async (request, context) => {
    let body = null;
    try { body = await request.json(); } catch (e) {}
    const limit = parseInt(process.env.DAILY_AI_FEEDBACK_CALLS, 10) || 60;
    const out = await handle(request.headers.get('x-firebase-token'), body, limit);
    if (out.status >= 500) context.log('feedback unavailable');
    return { status: out.status, jsonBody: out.body, headers: { 'Cache-Control': 'no-store' } };
  }
});
