const assert = require('assert');
const f = require('../src/feedback');
const ok = (id, extra) => Object.assign({ id: id, kind: 'text', question: 'Tell me about a challenge.', answer: 'I led a migration and cut errors by 30 percent.' }, extra || {});

// validation
assert.strictEqual(f.validateAnswers(null).ok, false);
assert.strictEqual(f.validateAnswers({ mode: 'answers', role: 'Nurse', items: [] }).ok, false);
assert.strictEqual(f.validateAnswers({ mode: 'answers', role: 'Nurse', items: [ok(0), ok(1), ok(2), ok(3), ok(4)] }).ok, false);   // too many per call
assert.strictEqual(f.validateAnswers({ mode: 'answers', role: 'Nurse', items: [ok(0, { answer: '' })] }).ok, false);
const v = f.validateAnswers({ mode: 'answers', role: 'Nurse', items: [ok(0), ok(1, { kind: 'code', tests: { passed: 3, total: 4 }, followUp: true })] });
assert.ok(v.ok && v.value.items[1].tests.passed === 3 && v.value.items[1].followUp === true);
assert.strictEqual(f.validateAnswers({ mode: 'answers', role: 'Nurse', items: [ok(0, { answer: 'x'.repeat(9000) })] }).value.items[0].answer.length, 4000);

// prompts
const sys = f.answersSystem('Nurse');
assert.ok(sys.includes('A to F') && sys.includes('untrusted') && sys.includes('Nurse') && sys.includes('better'));
assert.ok(f.answersUser(v.value.items).includes('<item id="1" type="coding problem" follow-up="yes">') && f.answersUser(v.value.items).includes('Tests passed: 3 of 4'));

// parsing
const good = JSON.stringify({ answers: [{ id: 0, grade: 'B', feedback: 'Good.', improve: 'Add a number.', better: 'Example.' }, { id: 1, grade: 'A', feedback: 'Great.', improve: '', better: '' }] });
assert.deepStrictEqual(f.parseAnswers(good, [0, 1]).map((a) => a.grade), ['B', 'A']);
assert.deepStrictEqual(f.parseAnswers(good, [1]).map((a) => a.id), [1]);                                   // ignores ids that were not asked about
assert.strictEqual(f.parseAnswers(JSON.stringify({ answers: [{ id: 0, grade: 'E', feedback: 'x' }] }), [0]), null); // invalid grade
assert.strictEqual(f.parseAnswers('not json', [0]), null);
assert.strictEqual(f.parseAnswers('```json\n' + good + '\n```', [0, 1]).length, 2);                      // tolerates a code fence

// overall
const ov = f.validateOverall({ mode: 'overall', role: 'Nurse', items: [{ question: 'q1', grade: 'B', feedback: 'fine' }, { question: 'q2', grade: 'Z', feedback: 'bad grade is dropped' }] });
assert.ok(ov.ok && ov.value.items.length === 1);
assert.deepStrictEqual(f.parseOverall('{"summary":"Nice work.","strengths":["a","b","c","d","e"],"focus":["x"]}'), { summary: 'Nice work.', strengths: ['a', 'b', 'c', 'd'], focus: ['x'] });
assert.strictEqual(f.parseOverall('{"summary":""}'), null);

(async () => {
  const deps = { verifyToken: async () => 'u1', consumeUsage: async () => true, callModel: async () => ({ text: good }) };
  const body = { mode: 'answers', role: 'Nurse', items: [ok(0), ok(1)] };
  let r = await f.makeFeedbackHandler(deps)('tok', body, 5);
  assert.deepStrictEqual([r.status, r.body.answers.length], [200, 2]);
  r = await f.makeFeedbackHandler(deps)('', body, 5); assert.strictEqual(r.status, 401);
  r = await f.makeFeedbackHandler({ ...deps, verifyToken: async () => { throw new Error('x'); } })('tok', body, 5); assert.strictEqual(r.status, 401);
  r = await f.makeFeedbackHandler(deps)('tok', { mode: 'nope' }, 5); assert.strictEqual(r.status, 400);
  r = await f.makeFeedbackHandler({ ...deps, consumeUsage: async () => false })('tok', body, 5); assert.strictEqual(r.status, 429);
  r = await f.makeFeedbackHandler({ ...deps, callModel: async () => { throw new Error('api'); } })('tok', body, 5); assert.strictEqual(r.status, 503);
  r = await f.makeFeedbackHandler({ ...deps, callModel: async () => ({ text: 'garbage' }) })('tok', body, 5); assert.strictEqual(r.status, 502);
  r = await f.makeFeedbackHandler({ ...deps, callModel: async () => ({ refused: true }) })('tok', body, 5); assert.strictEqual(r.status, 502);
  const oDeps = { ...deps, callModel: async () => ({ text: '{"summary":"Good job.","strengths":["clear"],"focus":["numbers"]}' }) };
  r = await f.makeFeedbackHandler(oDeps)('tok', { mode: 'overall', role: 'Nurse', items: [{ question: 'q', grade: 'A', feedback: 'f' }] }, 5);
  assert.deepStrictEqual([r.status, r.body.overall.summary], [200, 'Good job.']);
  console.log('all feedback tests passed');
})().catch((e) => { console.error(e); process.exit(1); });
