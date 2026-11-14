// Pure logic for the admin accounts list, kept separate so it can be tested without Azure or Firebase.
const DEFAULT_ADMINS = 'rolandngoy0703@gmail.com';

function adminEmails(env) {
  return String(env || DEFAULT_ADMINS).split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
}

// Only a verified email on the admin list counts, so nobody can claim it by signing up with it unverified.
function isAdmin(claims, admins) {
  return !!claims && claims.email_verified === true && typeof claims.email === 'string' && admins.includes(claims.email.toLowerCase());
}

function shapeUsers(list, counts) {
  const ms = (t) => { const n = t ? Date.parse(t) : NaN; return isNaN(n) ? null : n; };
  return list.map((u) => ({
    uid: u.uid,
    name: u.displayName || '',
    email: u.email || '',
    provider: (u.providerData || []).map((p) => p.providerId === 'google.com' ? 'Google' : p.providerId === 'password' ? 'Email' : p.providerId === 'microsoft.com' ? 'Microsoft (company)' : p.providerId).join(', '),
    created: ms(u.metadata && u.metadata.creationTime),
    lastSignIn: ms(u.metadata && u.metadata.lastSignInTime),
    interviews: counts && counts[u.uid] != null ? counts[u.uid] : null
  })).sort((a, b) => (b.lastSignIn || 0) - (a.lastSignIn || 0));
}

function makeAdminHandler(deps) {
  return async function handle(token, admins) {
    if (!token) return { status: 401, body: { error: 'unauthorized' } };
    let claims;
    try { claims = await deps.verifyTokenClaims(token); } catch (e) {
      // A bad or expired token is the caller's problem; anything else is a server setup problem worth naming.
      const code = String((e && e.code) || '');
      if (code === 'not_configured') return { status: 503, body: { error: 'not_configured', detail: e.why || '' } };
      if (/^auth\/(argument-error|id-token-|invalid-id-token)/.test(code) || !code) return { status: 401, body: { error: 'unauthorized' } };
      return { status: 503, body: { error: 'server_error', detail: code } };
    }
    if (!isAdmin(claims, admins)) return { status: 403, body: { error: 'forbidden', email: claims && claims.email || '', verified: !!(claims && claims.email_verified) } };
    try {
      const out = await deps.listAllUsers();
      return { status: 200, body: { users: shapeUsers(out.users, out.counts) } };
    } catch (e) {
      const code = String((e && e.code) || '');
      return { status: 503, body: { error: code === 'not_configured' ? 'not_configured' : 'server_error', detail: code === 'not_configured' ? (e.why || '') : code } };
    }
  };
}

module.exports = { adminEmails, isAdmin, shapeUsers, makeAdminHandler };
