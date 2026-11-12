/* =========================================================
   AI Interview Chat — mock interview for the chosen role
   - picks 5 questions (2 general + 3 role-specific)
   - scores each answer with simple on-device heuristics
   ========================================================= */
(function () {
  'use strict';

  let user, role;
  try { user = JSON.parse(localStorage.getItem('aiic_user')); role = sessionStorage.getItem('aiic_role'); } catch (e) {}
  if (!user) { window.location.replace('login.html'); return; }
  if (!role) { window.location.replace('roles.html'); return; }

  const GENERAL = [
    'Tell me about yourself and why you are interested in this role.',
    'Describe a time you faced a major challenge. How did you handle it?',
    'Tell me about a time you disagreed with a teammate or manager. What happened?',
    'Describe a goal you set and how you achieved it.',
    'Tell me about a mistake you made and what you learned from it.',
    'Describe a time you had to learn something quickly to get a job done.',
    'Tell me about a time you worked under a tight deadline.'
  ];

  const BY_CATEGORY = {
    tech: [
      'Walk me through a technical project you are proud of. What was your specific contribution?',
      'How do you debug a problem you have never seen before?',
      'Tell me about a time you had to make a tradeoff between speed and quality.',
      'How do you keep your technical skills current?',
      'Describe how you would explain a complex technical issue to a non-technical stakeholder.'
    ],
    product: [
      'How do you decide what to prioritize when everything seems urgent?',
      'Tell me about a time you used data or user feedback to change direction.',
      'Describe how you handle conflicting requests from stakeholders.',
      'Walk me through how you take an idea from concept to launch.',
      'How do you measure whether your work was successful?'
    ],
    business: [
      'Tell me about a time you analyzed a problem and recommended a solution.',
      'How do you handle working with incomplete information?',
      'Describe a time you improved a process or saved money or time.',
      'How do you manage multiple deadlines and competing priorities?',
      'Tell me about a time you had to persuade senior people.'
    ],
    sales: [
      'Tell me about a time you hit or exceeded a target. How did you do it?',
      'How do you handle rejection or a customer who says no?',
      'Describe how you build a relationship with a new client or audience.',
      'Tell me about a time you turned around an unhappy customer.',
      'How do you measure the success of your campaigns or accounts?'
    ],
    people: [
      'Tell me about a time you handled a difficult person with professionalism.',
      'How do you keep organized when many people need things from you at once?',
      'Describe how you handle sensitive or confidential information.',
      'Tell me about a time you went above and beyond for someone.',
      'How do you prioritize when several requests arrive at the same time?'
    ],
    health: [
      'Describe a time you had to stay calm in a high-pressure situation with a patient.',
      'How do you handle a disagreement with a colleague about patient care?',
      'Tell me about a time you had to deliver difficult news with empathy.',
      'How do you prioritize when several patients need you at once?',
      'How do you protect patient privacy and follow safety protocols in a busy setting?'
    ],
    public: [
      'Tell me about a time you helped someone who was struggling.',
      'How do you adapt your approach for people with different needs or backgrounds?',
      'Describe a time you worked with limited resources to get results.',
      'How do you handle a conflict with a student, client, or community member?',
      'Tell me about a time you made a difference in your community or workplace.'
    ],
    eng: [
      'Walk me through a project where you solved a hard technical or analytical problem.',
      'How do you make sure your work is accurate and meets standards or regulations?',
      'Describe a time you worked with a cross-functional team on a deadline.',
      'Tell me about a time your first approach did not work. What did you do next?',
      'How do you explain complex findings to people outside your field?'
    ],
    creative: [
      'Walk me through your creative process from brief to final piece.',
      'How do you handle critical feedback on your work?',
      'Tell me about a project you are most proud of and why.',
      'How do you balance creativity with deadlines and constraints?',
      'Describe how you find inspiration or stay current in your field.'
    ],
    trades: [
      'Tell me about a time you handled a difficult customer or a stressful rush.',
      'How do you stay safe and keep quality high when you are busy?',
      'Describe a time you had to work as part of a team to finish a job.',
      'Tell me about a time you showed up and were relied on when it mattered.',
      'How would you handle a situation where you did not know how to do a task?'
    ],
    general: [
      'What are your greatest strengths and how have they helped you at work?',
      'Where do you want to be in five years?',
      'Why should we hire you over other candidates?',
      'What kind of work environment helps you do your best work?',
      'Do you have any questions for us?'
    ]
  };

  const CATEGORY_MATCH = [
    ['health', /nurse|physician|doctor|pharmac|therapist|\bmedical|dentist|counselor|healthcare/],
    ['eng', /mechanical|electrical|civil|chemical|biomedical|research scientist|lab technician|architect|lawyer|attorney|paralegal/],
    ['creative', /video|journalist|copywriter|photograph|game|animat/],
    ['trades', /retail|store|server|chef|cook|hotel|barista|electrician|plumber|warehouse|driver|construction/],
    ['public', /teacher|professor|lecturer|school|social worker|policy|nonprofit|librarian|police|firefighter|military/],
    ['people', /\bhr\b|recruit|assistant|customer service|receptionist|office/],
    ['sales', /sales|marketer|account exec|account manager|customer success|marketing|content|social media|public relations|brand/],
    ['product', /product|project|program|scrum|business analyst|\bux\b|\bui\b|design|researcher/],
    ['business', /consult|financ|bank|accountant|audit|operations|supply|business dev|entrepreneur|founder|executive/],
    ['tech', /engineer|developer|devops|sre|security|\bqa\b|test|\bit\b|systems|network|machine|data|database|software|cloud/]
  ];

  function categoryFor(r) {
    const s = r.toLowerCase();
    for (let i = 0; i < CATEGORY_MATCH.length; i++) if (CATEGORY_MATCH[i][1].test(s)) return CATEGORY_MATCH[i][0];
    return 'general';
  }

  function pick(arr, n) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a.slice(0, n);
  }

  function buildQuestions() {
    const first = 'Tell me about yourself and why you are interested in the ' + role + ' role.';
    const rest = pick(GENERAL.slice(1), 1).concat(pick(BY_CATEGORY[categoryFor(role)], 3));
    return [first].concat(rest);
  }

  /* ---------- scoring ---------- */
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
  const count = (re, s) => (s.match(re) || []).length;

  function score(text) {
    const lower = text.toLowerCase();
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wc = words.length;
    const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
    const avgLen = sentences.length ? wc / sentences.length : wc;

    const star = [/\b(when|while|at my|during|last|previously|situation|context)\b/, /\b(task|goal|responsib|needed to|had to|asked to|objective)\b/, /\b(i (built|led|created|wrote|designed|decided|organized|ran|implemented|worked|set|asked|started|talked|planned|made|developed)|action|steps?|approach)\b/, /\b(result|outcome|as a result|which led|ended up|achieved|so that|learned)\b/]
      .reduce((n, re) => n + (re.test(lower) ? 1 : 0), 0);
    const lengthFit = wc < 40 ? wc / 40 : wc <= 250 ? 1 : Math.max(.6, 1 - (wc - 250) / 400);
    const structure = clamp(35 * lengthFit + star * 16.25);

    const fillers = count(/\b(um+|uh+|like|basically|you know|kind of|sort of|actually|literally|stuff|things)\b/g, lower);
    const lenFit = avgLen >= 8 && avgLen <= 24 ? 1 : avgLen < 8 ? avgLen / 8 : Math.max(.4, 1 - (avgLen - 24) / 30);
    const clarity = clamp(100 * lenFit - fillers * (600 / Math.max(wc, 40)) * 0.9 * 0.35 - (wc < 30 ? 25 : 0));

    const numbers = count(/\b\d[\d,.]*%?|\b(percent|million|thousand|hundred)\b/g, lower);
    const outcomes = count(/\b(increased|reduced|improved|saved|launched|grew|delivered|won|cut|boosted|exceeded|shipped|raised|decreased|streamlined|resolved)\b/g, lower);
    const iCount = count(/\bi\b/g, lower), weCount = count(/\bwe\b/g, lower);
    const owner = iCount + weCount === 0 ? 0 : iCount / (iCount + weCount);
    const impact = clamp(Math.min(numbers, 3) * 14 + Math.min(outcomes, 3) * 14 + owner * 26 + (wc >= 60 ? 6 : 0));

    const tips = [];
    if (wc < 60) tips.push('Your answer is short. Aim for 80–200 words with a concrete example.');
    if (wc > 280) tips.push('Your answer is long. Tighten it to the key points and keep it under about two minutes spoken.');
    if (star < 3) tips.push('Use the STAR shape: Situation, Task, Action, then Result. Make sure you state what happened in the end.');
    if (fillers >= 4) tips.push('Cut filler words like "like", "basically", "stuff", and "things" and name the specific thing instead.');
    if (avgLen > 26) tips.push('Your sentences run long. Break them up so each one carries a single idea.');
    if (numbers === 0) tips.push('Add at least one number: a percentage, a time saved, a team size, or a dollar amount.');
    if (outcomes === 0) tips.push('Say what changed because of your work, using verbs like "reduced", "increased", or "delivered".');
    if (iCount + weCount > 0 && owner < .4) tips.push('You say "we" often. Make clear what you personally did.');
    if (!tips.length) tips.push('Strong answer. It has a clear structure, specific detail and a result.');

    return { structure, clarity, impact, overall: Math.round((structure + clarity + impact) / 3), tips: tips.slice(0, 4) };
  }

  /* ---------- UI ---------- */
  const $ = (id) => document.getElementById(id);
  const views = ['ivQuestionView', 'ivFeedbackView', 'ivSummaryView'];
  function show(id) { views.forEach((v) => $(v).classList.toggle('hidden', v !== id)); }

  let questions, index, results, sessionId;

  function persist(complete) {
    if (!results.length || !window.AIIC_STORE) return;
    AIIC_STORE.saveSession(user.email, { id: sessionId, role: role, date: sessionId, total: questions.length, complete: complete, results: results });
  }

  function scoreTile(label, value) {
    const d = document.createElement('div');
    d.className = 'iv-score';
    const n = document.createElement('span'); n.className = 'iv-score-n'; n.textContent = value;
    const l = document.createElement('span'); l.className = 'iv-score-l mono small'; l.textContent = label;
    d.append(n, l);
    return d;
  }
  function renderScores(el, s) {
    el.replaceChildren(scoreTile('Overall', s.overall), scoreTile('Structure', s.structure), scoreTile('Clarity', s.clarity), scoreTile('Impact', s.impact));
  }

  function showQuestion() {
    $('ivQuestion').textContent = questions[index];
    $('ivAnswer').value = '';
    $('ivWords').textContent = '0 words';
    $('ivCount').textContent = 'Question ' + (index + 1) + ' of ' + questions.length;
    $('ivBar').style.width = (index / questions.length * 100) + '%';
    show('ivQuestionView');
    $('ivAnswer').focus();
  }

  function showSummary() {
    $('ivBar').style.width = '100%';
    $('ivCount').textContent = 'Done';
    const avg = (k) => Math.round(results.reduce((n, r) => n + r.s[k], 0) / results.length);
    renderScores($('ivSummaryScores'), { overall: avg('overall'), structure: avg('structure'), clarity: avg('clarity'), impact: avg('impact') });
    $('ivHistory').replaceChildren.apply($('ivHistory'), results.map((r) => {
      const li = document.createElement('li');
      const q = document.createElement('span'); q.textContent = r.q;
      const sc = document.createElement('strong'); sc.className = 'mono'; sc.textContent = r.s.overall;
      li.append(q, sc);
      return li;
    }));
    persist(true);
    show('ivSummaryView');
  }

  function start() {
    questions = buildQuestions();
    index = 0;
    results = [];
    sessionId = Date.now();
    showQuestion();
  }

  $('ivRole').textContent = role;
  $('ivAnswer').addEventListener('input', function () {
    const n = this.value.trim().split(/\s+/).filter(Boolean).length;
    $('ivWords').textContent = n + (n === 1 ? ' word' : ' words');
  });
  $('ivForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const text = $('ivAnswer').value.trim();
    if (!text) return;
    const s = score(text);
    results.push({ q: questions[index], a: text, s: s });
    persist(false);
    renderScores($('ivScores'), s);
    $('ivTips').replaceChildren.apply($('ivTips'), s.tips.map((t) => { const li = document.createElement('li'); li.textContent = t; return li; }));
    $('ivNext').textContent = index === questions.length - 1 ? 'See results' : 'Next question';
    show('ivFeedbackView');
    $('ivNext').focus();
  });
  $('ivNext').addEventListener('click', function () {
    index++;
    if (index >= questions.length) showSummary(); else showQuestion();
  });
  $('ivRetry').addEventListener('click', start);

  $('ivReturn').addEventListener('click', function () {
    const draft = $('ivAnswer').value.trim();
    if (!$('ivQuestionView').classList.contains('hidden') && draft && !confirm('Leave the interview? Your current unsent answer will be lost. Answers you already submitted are saved in your history.')) return;
    window.location.href = 'roles.html';
  });

  start();
})();
