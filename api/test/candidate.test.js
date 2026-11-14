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
    getAssessment: async (code) => code === 'ABCD-1234' ? { candidates: ['ann@x.com', 'Bob@X.com'] } : null,
    createToken: async (uid, claims) => { tokens.push([uid, claims]); return 'tok'; }
  }, over || {}));

  let r = await mk()({ email: 'Ann@x.com', code: 'abcd-1234' }, 'k');
  assert.deepStrictEqual([r.status, r.body.token], [200, 'tok']);
  assert.deepStrictEqual(tokens[0][1], { candEmail: 'ann@x.com', candCode: 'ABCD-1234', candName: 'Ann' });
  r = await mk()({ email: 'bob@x.com', code: 'ABCD-1234' }, 'k'); assert.strictEqual(r.status, 200); // stored emails are matched case-insensitively
  const wrongEmail = await mk()({ email: 'eve@x.com', code: 'ABCD-1234' }, 'k');
  const wrongCode = await mk()({ email: 'ann@x.com', code: 'ZZZZ-0000' }, 'k');
  assert.deepStrictEqual([wrongEmail.status, wrongCode.status], [404, 404]);
  assert.deepStrictEqual(wrongEmail.body, wrongCode.body);
  assert.strictEqual((await mk()({ email: 'bad', code: 'ABCD-1234' }, 'k')).status, 400);
  assert.strictEqual((await mk({ throttle: async () => false })({ email: 'ann@x.com', code: 'ABCD-1234' }, 'k')).status, 429);
  const nc = () => { throw Object.assign(new Error('x'), { code: 'not_configured' }); };
  assert.strictEqual((await mk({ getAssessment: nc })({ email: 'ann@x.com', code: 'ABCD-1234' }, 'k')).body.error, 'not_configured');
  assert.strictEqual((await mk({ getAssessment: async () => { throw new Error('boom'); } })({ email: 'ann@x.com', code: 'ABCD-1234' }, 'k')).status, 503);
  console.log('candidate tests passed');
})();
