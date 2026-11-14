// Pure logic for the pre-assessment candidate log in, kept separate so it can be tested without Azure or Firebase.
// A candidate gives an email and the company's code. If the company invited that email, the server signs them in
// with a Firebase custom token (no account to create). The token carries the email and code so firestore.rules can
// limit the candidate to exactly that one pre-assessment.
const crypto = require('crypto');

const CODE_RE = /^[A-Z0-9-]{4,20}$/;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}$/;

const normCode = (c) => String(c || '').trim().toUpperCase().replace(/\s+/g, '');
const normEmail = (e) => String(e || '').trim().toLowerCase();

// Same candidate + same code always gives the same uid, so they can resume and the company can reset them.
function candidateUid(code, email) {
  return 'cand_' + crypto.createHash('sha256').update(code + '|' + email).digest('hex').slice(0, 28);
}

// "john.smith7@x.com" -> "John", used only for the greeting.
function guessFirstName(email) {
  const first = email.split('@')[0].split(/[^a-z]+/i)[0] || '';
  return first.length >= 2 ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
}

function validateLogin(body) {
  if (!body || typeof body !== 'object') return null;
  const email = normEmail(body.email), code = normCode(body.code);
  if (!EMAIL_RE.test(email) || !CODE_RE.test(code)) return null;
  return { email: email, code: code };
}

/**
 * deps:
 *   throttle(key) -> Promise<boolean>          (false when this caller has tried too many times today)
 *   getAssessment(code) -> Promise<object|null>
 *   createToken(uid, claims) -> Promise<string>
 */
function makeCandidateHandler(deps) {
  return async function handle(body, callerKey) {
    const v = validateLogin(body);
    if (!v) return { status: 400, body: { error: 'bad_request' } };
    try {
      if (!(await deps.throttle(callerKey))) return { status: 429, body: { error: 'limit' } };
      const a = await deps.getAssessment(v.code);
      const invited = a && Array.isArray(a.candidates) && a.candidates.map(normEmail).includes(v.email);
      // A wrong code and an email that was not invited look exactly the same.
      if (!invited) return { status: 404, body: { error: 'not_found' } };
      const uid = candidateUid(v.code, v.email);
      const token = await deps.createToken(uid, { candEmail: v.email, candCode: v.code, candName: guessFirstName(v.email) });
      return { status: 200, body: { token: token } };
    } catch (e) {
      if (e && e.code === 'not_configured') return { status: 503, body: { error: 'not_configured' } };
      return { status: 503, body: { error: 'unavailable' } };
    }
  };
}

module.exports = { normCode, normEmail, candidateUid, guessFirstName, validateLogin, makeCandidateHandler, CODE_RE };
