// Pure logic for the admin accounts list, kept separate so it can be tested without Azure or Firebase.
const DEFAULT_ADMINS = 'rolandngoy@yahoo.com';

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
    provider: (u.providerData || []).map((p) => p.providerId === 'google.com' ? 'Google' : p.providerId === 'password' ? 'Email' : p.providerId).join(', '),
    created: ms(u.metadata && u.metadata.creationTime),
    lastSignIn: ms(u.metadata && u.metadata.lastSignInTime),
    interviews: counts && counts[u.uid] != null ? counts[u.uid] : null
  })).sort((a, b) => (b.lastSignIn || 0) - (a.lastSignIn || 0));
}

function makeAdminHandler(deps) {
  return async function handle(token, admins) {
    if (!token) return { status: 401, body: { error: 'unauthorized' } };
    let claims;
    try { claims = await deps.verifyTokenClaims(token); } catch (e) { return { status: 401, body: { error: 'unauthorized' } }; }
    if (!isAdmin(claims, admins)) return { status: 403, body: { error: 'forbidden' } };
    try {
      const out = await deps.listAllUsers();
      return { status: 200, body: { users: shapeUsers(out.users, out.counts) } };
    } catch (e) {
      return { status: 503, body: { error: 'unavailable' } };
    }
  };
}

module.exports = { adminEmails, isAdmin, shapeUsers, makeAdminHandler };
