const assert = require('assert');
const { adminEmails, isAdmin, shapeUsers, makeAdminHandler } = require('../src/admin');

const admins = adminEmails(undefined);
assert.deepStrictEqual(admins, ['rolandngoy@yahoo.com']);
assert.deepStrictEqual(adminEmails(' A@x.com, b@y.com '), ['a@x.com', 'b@y.com']);
assert.ok(isAdmin({ email: 'RolandNgoy@Yahoo.com', email_verified: true }, admins));
assert.ok(!isAdmin({ email: 'rolandngoy@yahoo.com', email_verified: false }, admins));
assert.ok(!isAdmin({ email: 'other@yahoo.com', email_verified: true }, admins));
assert.ok(!isAdmin(null, admins));

const list = [
  { uid: 'a', displayName: 'Ann', email: 'ann@x.com', providerData: [{ providerId: 'password' }], metadata: { creationTime: 'Mon, 01 Jan 2024 00:00:00 GMT', lastSignInTime: 'Tue, 02 Jan 2024 00:00:00 GMT' } },
  { uid: 'b', email: 'bo@x.com', providerData: [{ providerId: 'google.com' }], metadata: { creationTime: 'Mon, 01 Jan 2024 00:00:00 GMT', lastSignInTime: 'Wed, 03 Jan 2024 00:00:00 GMT' } }
];
const shaped = shapeUsers(list, { a: 3 });
assert.deepStrictEqual(shaped.map((u) => u.uid), ['b', 'a']);
assert.strictEqual(shaped[1].interviews, 3);
assert.strictEqual(shaped[0].interviews, null);
assert.strictEqual(shaped[0].provider, 'Google');

(async () => {
  const deps = (claims) => ({ verifyTokenClaims: async () => claims, listAllUsers: async () => ({ users: list, counts: {} }) });
  assert.strictEqual((await makeAdminHandler(deps({}))('', admins)).status, 401);
  assert.strictEqual((await makeAdminHandler({ verifyTokenClaims: async () => { throw new Error('x'); } })('t', admins)).status, 401);
  assert.strictEqual((await makeAdminHandler(deps({ email: 'x@y.com', email_verified: true }))('t', admins)).status, 403);
  const ok = await makeAdminHandler(deps({ email: 'rolandngoy@yahoo.com', email_verified: true }))('t', admins);
  assert.strictEqual(ok.status, 200);
  assert.strictEqual(ok.body.users.length, 2);
  const bad = (code, why) => ({ verifyTokenClaims: async () => { throw Object.assign(new Error('x'), { code: code, why: why }); } });
  let r = await makeAdminHandler(bad('not_configured', 'FIREBASE_SERVICE_ACCOUNT is not set'))('t', admins);
  assert.deepStrictEqual([r.status, r.body.error, r.body.detail], [503, 'not_configured', 'FIREBASE_SERVICE_ACCOUNT is not set']);
  r = await makeAdminHandler(bad('auth/id-token-expired'))('t', admins); assert.strictEqual(r.status, 401);
  r = await makeAdminHandler(bad('auth/argument-error'))('t', admins); assert.strictEqual(r.status, 401);
  r = await makeAdminHandler(bad('app/invalid-credential'))('t', admins);
  assert.deepStrictEqual([r.status, r.body.error, r.body.detail], [503, 'server_error', 'app/invalid-credential']);
  r = await makeAdminHandler(deps({ email: 'x@y.com', email_verified: false }))('t', admins);
  assert.deepStrictEqual([r.status, r.body.email, r.body.verified], [403, 'x@y.com', false]);
  console.log('admin tests passed');
})();
