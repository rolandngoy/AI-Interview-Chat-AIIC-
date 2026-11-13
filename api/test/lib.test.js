const assert = require('assert');
const { validate, buildSystem, buildUser, parseReply, makeHandler } = require('../src/lib');

// validate
assert.strictEqual(validate(null).ok, false);
assert.strictEqual(validate({ interviewer: 'nobody', role: 'x', question: 'q', answer: 'a' }).ok, false);
assert.strictEqual(validate({ interviewer: 'roland', role: 'Nurse', question: 'q', answer: '' }).ok, false);
const v = validate({ interviewer: 'makenzie', role: 'Nurse', question: 'Tell me', answer: 'I did X', canFollowUp: true });
assert.ok(v.ok && v.value.canFollowUp === true && v.value.persona.name === 'Makenzie');
assert.strictEqual(validate({ interviewer: 'roland', role: 'R', question: 'q', answer: 'a'.repeat(9000) }).value.answer.length, 4000);
assert.strictEqual(validate({ interviewer: 'roland', role: 'R', question: 'q', answer: 'a', canFollowUp: 'yes' }).value.canFollowUp, false);

// prompts
const sys = buildSystem(v.value.persona, 'Nurse');
assert.ok(sys.includes('Makenzie') && sys.includes('Nurse') && sys.includes('untrusted'));
assert.ok(buildUser(v.value).includes('<answer>I did X</answer>') && buildUser(v.value).includes('allowed'));

// parseReply
assert.deepStrictEqual(parseReply('{"reaction":"Nice.","followUp":"Why?"}', true), { reaction: 'Nice.', followUp: 'Why?' });
assert.deepStrictEqual(parseReply('{"reaction":"Nice.","followUp":"Why?"}', false), { reaction: 'Nice.', followUp: null });
assert.deepStrictEqual(parseReply('Sure! ```json\n{"reaction":"Good.","followUp":null}\n```', true), { reaction: 'Good.', followUp: null });
assert.strictEqual(parseReply('no json here', true), null);
assert.strictEqual(parseReply('{"reaction":"","followUp":"x"}', true), null);

(async () => {
  const ok = { verifyToken: async () => 'u1', consumeUsage: async () => true, callModel: async () => ({ text: '{"reaction":"Thanks.","followUp":"Tell me more?"}' }) };
  const body = { interviewer: 'roland', role: 'Nurse', question: 'q', answer: 'a', canFollowUp: true };
  let r = await makeHandler(ok)('tok', body, 5);
  assert.deepStrictEqual([r.status, r.body.followUp], [200, 'Tell me more?']);
  r = await makeHandler(ok)('', body, 5); assert.strictEqual(r.status, 401);
  r = await makeHandler({ ...ok, verifyToken: async () => { throw new Error('bad'); } })('tok', body, 5); assert.strictEqual(r.status, 401);
  r = await makeHandler(ok)('tok', { role: 'x' }, 5); assert.strictEqual(r.status, 400);
  r = await makeHandler({ ...ok, consumeUsage: async () => false })('tok', body, 5); assert.strictEqual(r.status, 429);
  r = await makeHandler({ ...ok, consumeUsage: async () => { throw new Error('db'); } })('tok', body, 5); assert.strictEqual(r.status, 503);
  r = await makeHandler({ ...ok, callModel: async () => { throw new Error('api'); } })('tok', body, 5); assert.strictEqual(r.status, 503);
  r = await makeHandler({ ...ok, callModel: async () => ({ refused: true }) })('tok', body, 5); assert.deepStrictEqual([r.status, r.body.reaction], [200, '']);
  r = await makeHandler({ ...ok, callModel: async () => ({ text: 'garbage' }) })('tok', body, 5); assert.strictEqual(r.status, 502);
  console.log('all api tests passed');
})().catch((e) => { console.error(e); process.exit(1); });

// internship flag changes the instructions
(function () {
  const { validate, buildSystem } = require('../src/lib');
  const base = { interviewer: 'roland', role: 'Marketing Intern', question: 'q', answer: 'a' };
  const yes = validate({ ...base, intern: true }).value, no = validate(base).value;
  assert.strictEqual(yes.intern, true); assert.strictEqual(no.intern, false);
  assert.ok(buildSystem(yes.persona, yes.role, true).includes('INTERNSHIP') && !buildSystem(no.persona, no.role, false).includes('INTERNSHIP'));
  const f = require('../src/feedback');
  assert.ok(f.answersSystem('Marketing Intern', true).includes('INTERNSHIP') && !f.answersSystem('Nurse', false).includes('INTERNSHIP'));
  assert.ok(f.overallSystem('Marketing Intern', true).includes('internship'));
  assert.strictEqual(f.validateAnswers({ mode: 'answers', role: 'X Intern', intern: true, items: [{ id: 0, question: 'q', answer: 'a' }] }).value.intern, true);
  console.log('internship flag tests passed');
})();
