// POST /api/candidate-login — a pre-assessment candidate logs in with the invited email and the company's code.
const crypto = require('crypto');
const { app } = require('@azure/functions');
const { makeCandidateHandler } = require('../candidate');
const infra = require('../infra');

const DAILY_ATTEMPTS = 60; // per network address, so codes and emails cannot be guessed in bulk

const handle = makeCandidateHandler({
  throttle: (key) => infra.consumeUsage(key, new Date().toISOString().slice(0, 10), DAILY_ATTEMPTS, 'candlogin'),
  getAssessment: infra.getAssessment,
  createToken: infra.createCandidateToken
});

app.http('candidateLogin', {
  methods: ['POST'],
  authLevel: 'anonymous', // the email must be on the company's candidate list
  route: 'candidate-login',
  handler: async (request, context) => {
    let body = null;
    try { body = await request.json(); } catch (e) {}
    const ip = (request.headers.get('x-forwarded-for') || request.headers.get('x-azure-clientip') || 'unknown').split(',')[0].trim();
    const out = await handle(body, 'ip_' + crypto.createHash('sha256').update(ip).digest('hex').slice(0, 24));
    if (out.status >= 500) context.log('candidate-login unavailable: ' + out.body.error);
    return { status: out.status, jsonBody: out.body, headers: { 'Cache-Control': 'no-store' } };
  }
});
