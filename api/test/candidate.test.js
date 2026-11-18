const assert = require('assert');
const { candidateUid, guessFirstName, validateLogin, makeCandidateHandler } = require('../src/candidate');

assert.strictEqual(candidateUid('AB-12', 'a@x.com'), candidateUid('AB-12', 'a@x.com'));
assert.notStrictEqual(candidateUid('AB-12', 'a@x.com'), candidateUid('AB-12', 'b@x.com'));
assert.notStrictEqual(candidateUid('AB-12', 'a@x.com'), candidateUid('AB-13', 'a@x.com'));
assert.ok(/^cand_[0-9a-f]{28}$/.test(candidateUid('AB-12', 'a@x.com')));
assert.strictEqual(guessFirstName('john.smith7@x.com'), 'John');
assert.strictEqual(guessFirstName('j@x.com'), '');
assert.strictEqual(guessFirstName('123@x.com'), '');

assert.deepStrictEqual(validateLogin({ email: '  Ann@X.com ', code: ' ab cd-12 ' }), { email: 'ann@x.com', code: 'ABCD-12' });
assert.strictEqual(validateLogin({ email: 'nope', code: 'ABCD-12' }), null);
assert.strictEqual(validateLogin({ email: 'a@x.com', code: 'x' }), null);
assert.strictEqual(validateLogin(null), null);

(async () => {
  let tokens = [];
  const mk = (over) => makeCandidateHandler(Object.assign({
    throttle: async () => true,
    getInvite: async (code) => ({ 'ANN-0001': { assessmentId: 'asmt1', email: 'ann@x.com' }, 'BOB-0002': { assessmentId: 'asmt1', email: 'bob@x.com' }, 'GONE-003': { assessmentId: 'asmt1', email: 'gone@x.com' } })[code] || null,
    getAssessment: async (id) => id === 'asmt1' ? { candidates: ['ann@x.com', 'Bob@X.com'] } : null,
    createToken: async (uid, claims) => { tokens.push([uid, claims]); return 'tok'; }
  }, over || {}));

  let r = await mk()({ email: 'Ann@x.com', code: 'ann-0001' }, 'k');
  assert.deepStrictEqual([r.status, r.body.token], [200, 'tok']);
  assert.deepStrictEqual(tokens[0][1], { candEmail: 'ann@x.com', candCode: 'asmt1', candName: 'Ann' });
  r = await mk()({ email: 'bob@x.com', code: 'BOB-0002' }, 'k'); assert.strictEqual(r.status, 200); // stored emails are matched case-insensitively
  // Each candidate's code works only with their own email.
  const swapped = await mk()({ email: 'ann@x.com', code: 'BOB-0002' }, 'k');
  const notInvited = await mk()({ email: 'eve@x.com', code: 'ANN-0001' }, 'k');
  const wrongCode = await mk()({ email: 'ann@x.com', code: 'ZZZZ-0000' }, 'k');
  const removed = await mk()({ email: 'gone@x.com', code: 'GONE-003' }, 'k'); // code exists but the email is off the list now
  assert.deepStrictEqual([swapped.status, notInvited.status, wrongCode.status, removed.status], [404, 404, 404, 404]);
  assert.deepStrictEqual(swapped.body, wrongCode.body);
  assert.strictEqual((await mk()({ email: 'bad', code: 'ANN-0001' }, 'k')).status, 400);
  assert.strictEqual((await mk({ throttle: async () => false })({ email: 'ann@x.com', code: 'ANN-0001' }, 'k')).status, 429);
  const nc = () => { throw Object.assign(new Error('x'), { code: 'not_configured' }); };
  assert.strictEqual((await mk({ getInvite: nc })({ email: 'ann@x.com', code: 'ANN-0001' }, 'k')).body.error, 'not_configured');
  assert.strictEqual((await mk({ getInvite: async () => { throw new Error('boom'); } })({ email: 'ann@x.com', code: 'ANN-0001' }, 'k')).status, 503);
  console.log('candidate tests passed');
})();
