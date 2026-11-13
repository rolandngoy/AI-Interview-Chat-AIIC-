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
    'Tell me about a time you worked under a tight deadline.',
    'Tell me about a time you took initiative without being asked.',
    'Describe a time you received tough feedback. What did you do with it?',
    'Tell me about a time you had to juggle several priorities at once.',
    'Describe a time you helped a teammate who was struggling.',
    'Tell me about something you are proud of that you accomplished at work or school.'
  ];
  const CLOSING = 'Do you have any questions for us?';
  const TOTAL = 15;

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
      'What kind of work environment helps you do your best work?'
    ]
  };

  const CATEGORY_MATCH = [
    ['health', /nurse|nursing|physician|doctor|pharmac|therapist|pathologist|veterinar|paramedic|\bemt\b|\bmedical|dentist|dental|radiologic|(?<!school )counselor|healthcare/],
    ['eng', /mechanical|electrical|civil|chemical|biomedical|industrial|environmental|aerospace|manufacturing|biologist|chemist|quality control|surveyor|research scientist|lab technician|(?<!solutions )architect|lawyer|attorney|paralegal/],
    ['creative', /video|journalist|copywriter|photograph|game designer|animat|technical writer|illustrator|art director|interior design|fashion|podcast|translator|interpreter/],
    ['trades', /retail|store|server|chef|cook|hotel|barista|electrician|plumber|warehouse|driver|construction|bartender|flight attendant|cashier|hair|stylist|trainer|mechanic|hvac|welder|carpenter|security guard|truck|landscap/],
    ['public', /teacher|teaching|professor|lecturer|school|social worker|policy|nonprofit|librarian|police|firefighter|military|instructional|early childhood|tutor|case manager|fundrais/],
    ['people', /\bhr\b|recruit|assistant|customer service|receptionist|\boffice\b|payroll|project coordinator|training and development/],
    ['sales', /sales|marketer|account exec|account manager|customer success|marketing|market research|\bseo\b|event planner|content|social media|public relations|brand/],
    ['product', /product|project|program|scrum|business analyst|\bux\b|\bui\b|design|researcher/],
    ['business', /consult|financ|bank|accountant|audit|operations|supply|business dev|entrepreneur|founder|executive|risk|compliance|loan|insurance|real estate|procurement|bookkeep|logistics/],
    ['tech', /engineer|developer|devops|sre|security|\bqa\b|test|\bit\b|systems|solutions|business intelligence|network|machine|data|database|software|cloud|\bai\b/]
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

  // 15 questions: intro, motivation, 12 mixed (role-specific, field-related and
  // behavioral, shuffled; one is a Python problem for coding roles), then the closing question.
  function buildQuestions() {
    const coding = window.AIIC_CODE && AIIC_CODE.isCodingRole(role);
    const MID = TOTAL - 3 - (coding ? 1 : 0);
    const behavioralPool = GENERAL.slice(1);
    let specific = pick((window.AIIC_ROLE_QUESTIONS || {})[role] || [], 5);
    if (!specific.length) {
      // A role typed in by the user: use questions that name the role.
      specific = [
        'What skills matter most for success as a ' + role + ', and how have you developed them?',
        'What do you think is the hardest part of working as a ' + role + '?',
        'Walk me through how you would approach your first 90 days as a ' + role + '.'
      ];
    }
    const behavioral = pick(behavioralPool, 4);
    let mid = specific.concat(behavioral);
    const fieldPool = Array.from(new Set(BY_CATEGORY[categoryFor(role)].concat(BY_CATEGORY.general)));
    mid = mid.concat(pick(fieldPool, Math.max(0, Math.min(fieldPool.length, MID - mid.length))));
    if (mid.length < MID) {
      mid = mid.concat(pick(behavioralPool.filter((q) => mid.indexOf(q) === -1), MID - mid.length));
    }
    mid = pick(mid, MID);
    // Roles that involve coding get one simple Python problem, about midway through.
    if (coding) mid.splice(Math.floor(MID / 2), 0, AIIC_CODE.pick(role));
    return [
      'Tell me about yourself and why you are interested in the ' + role + ' role.',
      'What draws you to ' + role + ' work, and what do you want to get out of this position?'
    ].concat(mid, [CLOSING]);
  }

  /* ---------- scoring ---------- */
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
  const count = (re, s) => (s.match(re) || []).length;

  function score(text, voice) {
    const lower = text.toLowerCase();
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wc = words.length;
    const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
    // Dictated text has no punctuation, so don't penalize it for "long sentences".
    const rawAvg = sentences.length ? wc / sentences.length : wc;
    const avgLen = voice ? Math.min(rawAvg, 20) : rawAvg;

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

  /* ---------- AI interviewer persona ---------- */
  const PEOPLE = window.AIIC_INTERVIEWERS || {};
  const PERSON_IDS = Object.keys(PEOPLE);
  let personaId = PERSON_IDS[Math.floor(Math.random() * PERSON_IDS.length)];
  let followUps = new Set(), followUpCount = 0, pendingFollowUp = null, replyToken = 0, aiOff = false;
  const MAX_FOLLOW_UPS = 4;
  const persona = () => PEOPLE[personaId];

  function renderPersona() {
    const p = persona();
    if (!p) return;
    $('ivAvatarImg').src = p.img; $('ivReplyImg').src = p.img;
    $('ivIName').textContent = p.name; $('ivITitle').textContent = p.title;
    $('ivSwitch').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.id === personaId));
  }
  function buildSwitch() {
    const box = $('ivSwitch');
    if (PERSON_IDS.length < 2) { box.classList.add('hidden'); return; }
    PERSON_IDS.forEach(function (id) {
      const b = document.createElement('button');
      b.type = 'button'; b.dataset.id = id; b.className = 'iv-pick';
      b.setAttribute('aria-label', 'Interview with ' + PEOPLE[id].name);
      const img = document.createElement('img'); img.src = PEOPLE[id].img; img.alt = '';
      b.append(img, document.createTextNode(PEOPLE[id].name));
      b.addEventListener('click', function () { if (id !== personaId) { personaId = id; stopSpeaking(); renderPersona(); } });
      box.appendChild(b);
    });
  }
  function pickVoice(p) {
    const voices = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang));
    for (let i = 0; i < p.voiceHints.length; i++) {
      const v = voices.find((x) => x.name.indexOf(p.voiceHints[i]) !== -1);
      if (v) return v;
    }
    // Otherwise give each interviewer a different installed English voice.
    return voices.length ? voices[PERSON_IDS.indexOf(p.id) % voices.length] : null;
  }
  const setSpeakingUi = (on) => document.querySelectorAll('.iv-avatar').forEach((a) => a.classList.toggle('speaking', on));

  function persist(complete) {
    if (!results.length || !window.AIIC_STORE) return;
    AIIC_STORE.saveSession(user, { id: sessionId, role: role, date: sessionId, total: questions.length, complete: complete, results: results });
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

  /* ---------- voice: listen to questions, speak answers (Web Speech API) ---------- */
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const PRACTICAL = window.AIIC_PRACTICAL || [];
  let recognizer = null, listening = false, usedVoice = false, baseText = '';

  const questionText = (q) => (typeof q === 'object' ? q.prompt : q);
  const spokenText = (q) => (index === 0 && persona() ? persona().greeting(role) + ' ' : '') + questionText(q);
  const voiceAllowed = (q) => typeof q !== 'object' && PRACTICAL.indexOf(q) === -1;

  function setListenUi(on) {
    $('ivListenLabel').textContent = on ? 'Stop listening' : 'Listen to question';
    $('ivListen').setAttribute('aria-pressed', on);
  }
  function stopSpeaking() { if (canSpeak) { speechSynthesis.cancel(); setListenUi(false); setSpeakingUi(false); } }
  function speak(text) {
    if (!canSpeak) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const p = persona();
    u.lang = 'en-US'; u.rate = p ? p.rate : 0.95; u.pitch = p ? p.pitch : 1;
    const v = p && pickVoice(p);
    if (v) u.voice = v;
    u.onstart = function () { setSpeakingUi(true); };
    u.onend = u.onerror = function () { setListenUi(false); setSpeakingUi(false); };
    setListenUi(true);
    speechSynthesis.speak(u);
  }

  function setMicUi(on) {
    listening = on;
    $('ivMicLabel').textContent = on ? 'Stop recording' : 'Answer by voice';
    $('ivMic').setAttribute('aria-pressed', on);
    $('ivMic').classList.toggle('recording', on);
  }
  function stopVoice() {
    if (recognizer) { try { recognizer.stop(); } catch (e) {} recognizer = null; }
    setMicUi(false);
  }
  function startVoice() {
    stopSpeaking();
    const status = $('ivMicStatus');
    const ta = $('ivAnswer');
    baseText = ta.value.trim();
    const rec = new SpeechRec();
    rec.lang = 'en-US'; rec.continuous = true; rec.interimResults = true;
    let finalText = '';
    rec.onresult = function (e) {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t + ' '; else interim += t;
      }
      ta.value = (baseText ? baseText + ' ' : '') + (finalText + interim).trim();
      usedVoice = true;
      ta.dispatchEvent(new Event('input'));
    };
    rec.onerror = function (e) {
      status.textContent =
        e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'Microphone blocked. Allow microphone access for this site in your browser, then try again.' :
        e.error === 'no-speech' ? 'No speech heard. Try again.' :
        e.error === 'audio-capture' ? 'No microphone found.' :
        e.error === 'network' ? 'Voice input needs an internet connection.' : 'Voice input stopped.';
    };
    rec.onend = function () { if (recognizer === rec) { recognizer = null; setMicUi(false); if (!status.textContent) status.textContent = 'Stopped. You can edit the text before submitting.'; } };
    recognizer = rec;
    status.textContent = '';
    try { rec.start(); setMicUi(true); status.textContent = 'Listening… speak your answer.'; }
    catch (e) { recognizer = null; setMicUi(false); status.textContent = 'Could not start the microphone.'; }
  }

  function setupVoiceForQuestion(q) {
    stopVoice();
    usedVoice = false;
    $('ivMicStatus').textContent = '';
    $('ivListen').classList.toggle('hidden', !canSpeak);
    $('ivAutoRead').parentElement.classList.toggle('hidden', !canSpeak);
    const row = $('ivMicRow');
    const allowed = voiceAllowed(q);
    row.classList.toggle('hidden', typeof q === 'object');
    if (typeof q !== 'object') {
      $('ivMic').disabled = !allowed || !SpeechRec;
      if (!SpeechRec) $('ivMicStatus').textContent = 'Voice answers are not supported in this browser. Try Chrome, Edge or Safari.';
      else if (!allowed) $('ivMicStatus').textContent = 'This is a hands-on question, so please type your answer.';
    }
    if (canSpeak && $('ivAutoRead').checked) speak(spokenText(q)); else stopSpeaking();
  }

  function showQuestion() {
    const q = questions[index];
    const isCode = typeof q === 'object';
    $('ivQuestion').textContent = isCode ? 'Coding problem: ' + q.prompt : q;
    $('ivForm').classList.toggle('hidden', isCode);
    $('ivCodeForm').classList.toggle('hidden', !isCode);
    $('ivCount').textContent = (followUps.has(q) ? 'Follow-up · ' : '') + 'Question ' + (index + 1) + ' of ' + questions.length;
    $('ivBar').style.width = (index / questions.length * 100) + '%';
    const greet = $('ivGreeting');
    greet.classList.toggle('hidden', !(index === 0 && persona()));
    if (index === 0 && persona()) greet.textContent = persona().greeting(role);
    show('ivQuestionView');
    setupVoiceForQuestion(q);
    if (isCode) {
      $('ivCode').value = q.starter;
      $('ivCodeOut').classList.add('hidden');
      $('ivCodeOut').replaceChildren();
      $('ivPyStatus').textContent = '';
      getRunner();
      $('ivCode').focus();
    } else {
      $('ivAnswer').value = '';
      $('ivWords').textContent = '0 words';
      $('ivAnswer').focus();
    }
  }

  /* ---------- Python runner (Web Worker + Pyodide) ---------- */
  let worker = null, workerReady = false, workerError = '', nextRunId = 1;
  const pending = {};

  function getRunner() {
    if (worker) return worker;
    workerReady = false; workerError = '';
    worker = new Worker('pyworker.js');
    worker.onmessage = function (e) {
      const d = e.data;
      if (d.ready) { workerReady = true; setPyStatus(''); }
      else if (d.loadError) { workerError = d.loadError; setPyStatus('Could not load the Python runner. Check your connection, or skip this problem.'); }
      else if (pending[d.id]) { pending[d.id](d.out); delete pending[d.id]; }
    };
    worker.onerror = function () { workerError = 'worker'; setPyStatus('Could not load the Python runner. Check your connection, or skip this problem.'); };
    setPyStatus('Loading Python…');
    return worker;
  }
  function setPyStatus(t) { const el = $('ivPyStatus'); if (el) el.textContent = t; }

  // Runs the candidate's code against the tests. Times out after 5 seconds.
  function runCode(q, code) {
    if (worker && workerError) { worker.terminate(); worker = null; } // retry a failed load
    const w = getRunner();
    return new Promise(function (resolve) {
      const id = nextRunId++;
      const timer = setTimeout(function () {
        const loaded = workerReady;
        delete pending[id];
        w.terminate(); worker = null;
        getRunner(); // restart for the next attempt
        resolve(loaded
          ? { error: 'Your code ran for more than 5 seconds. Check for an infinite loop.' }
          : { error: 'Python took too long to load. Check your connection, or skip this problem.', loadFail: true });
      }, workerReady ? 5000 : 60000);
      pending[id] = function (out) { clearTimeout(timer); resolve(out); };
      w.postMessage({ id: id, code: code, fn: q.fn, tests: q.tests });
    });
  }

  function renderCodeOut(out) {
    const box = $('ivCodeOut');
    box.classList.remove('hidden');
    box.replaceChildren();
    if (out.error) { const p = document.createElement('p'); p.className = 'iv-code-err'; p.textContent = out.error; box.appendChild(p); return; }
    out.results.forEach(function (r) {
      const row = document.createElement('div'); row.className = 'iv-test ' + (r.ok ? 'pass' : 'fail');
      const head = document.createElement('strong'); head.textContent = (r.ok ? '✓ ' : '✗ ') + r.call;
      row.appendChild(head);
      if (!r.ok) { const d = document.createElement('span'); d.textContent = 'expected ' + r.expected + ', got ' + r.got; row.appendChild(d); }
      box.appendChild(row);
    });
  }

  async function runFromUi() {
    const q = questions[index];
    $('ivRunCode').disabled = $('ivSubmitCode').disabled = true;
    setPyStatus(workerReady ? 'Running tests…' : 'Loading Python… your tests will run when it is ready.');
    const out = await runCode(q, $('ivCode').value);
    $('ivRunCode').disabled = $('ivSubmitCode').disabled = false;
    setPyStatus(workerError ? 'Could not load the Python runner. Check your connection, or skip this problem.' : '');
    renderCodeOut(out);
    return out;
  }

  function showSummary() {
    stopVoice(); stopSpeaking();
    $('ivBar').style.width = '100%';
    $('ivCount').textContent = 'Done';
    const avg = (k) => {
      const rs = k === 'overall' ? results : results.filter((r) => r.kind !== 'code');
      return rs.length ? Math.round(rs.reduce((n, r) => n + r.s[k], 0) / rs.length) : 0;
    };
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
    followUps = new Set(); followUpCount = 0; pendingFollowUp = null; replyToken++; aiOff = false;
    sessionId = Date.now();
    showQuestion();
  }

  $('ivRole').textContent = role;
  buildSwitch();
  renderPersona();
  $('ivAnswer').addEventListener('input', function () {
    const n = this.value.trim().split(/\s+/).filter(Boolean).length;
    $('ivWords').textContent = n + (n === 1 ? ' word' : ' words');
  });
  /* ---------- the interviewer's spoken reaction and follow-up (calls /api/interviewer) ---------- */
  // A later question that can be dropped so a follow-up keeps the interview at 15 questions.
  function removableIndex() {
    for (let r = questions.length - 2; r >= index + 1; r--) {
      const q = questions[r];
      if (typeof q === 'string' && !followUps.has(q)) return r;
    }
    return -1;
  }
  function canFollowUpNow(q) {
    return typeof q === 'string' && q !== CLOSING && !followUps.has(q) && followUpCount < MAX_FOLLOW_UPS && removableIndex() !== -1;
  }

  async function askInterviewer(q, answer, canFollowUp) {
    if (aiOff || !window.AIIC_AUTH || !AIIC_AUTH.configured || !AIIC_AUTH.auth || !AIIC_AUTH.auth.currentUser) return null;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 25000);
    try {
      const token = await AIIC_AUTH.auth.currentUser.getIdToken();
      const res = await fetch('/api/interviewer', {
        method: 'POST', signal: ctl.signal,
        headers: { 'Content-Type': 'application/json', 'X-Firebase-Token': token },
        body: JSON.stringify({ interviewer: personaId, role: role, question: q, answer: answer, canFollowUp: canFollowUp })
      });
      if (res.status === 429) { aiOff = true; return { limit: true }; }
      if (res.status === 401) { aiOff = true; return null; }
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { return null; } finally { clearTimeout(timer); }
  }

  async function runInterviewerReply(q, answer) {
    const token = ++replyToken;
    pendingFollowUp = null;
    $('ivNext').disabled = false;
    const box = $('ivReply');
    box.classList.add('hidden');
    $('ivReplyText').textContent = ''; $('ivReplyFollow').classList.add('hidden');
    $('ivReplyListen').classList.add('hidden');
    if (aiOff || !AIIC_AUTH || !AIIC_AUTH.configured) return;
    const p = persona();
    box.classList.remove('hidden');
    $('ivTyping').textContent = p.name + ' is typing…'; $('ivTyping').classList.remove('hidden');
    $('ivNext').disabled = true;

    const out = await askInterviewer(q, answer, canFollowUpNow(q));
    if (token !== replyToken) return; // moved on already
    $('ivTyping').classList.add('hidden');
    $('ivNext').disabled = false;
    if (!out || (!out.reaction && !out.limit)) { box.classList.add('hidden'); return; }
    if (out.limit) {
      $('ivReplyText').textContent = 'You\'ve reached today\'s limit for live interviewer replies, so the rest of this interview uses the standard questions. It resets tomorrow.';
      return;
    }
    $('ivReplyText').textContent = out.reaction;
    let spoken = out.reaction;
    if (out.followUp) {
      pendingFollowUp = out.followUp;
      $('ivReplyFollow').textContent = out.followUp;
      $('ivReplyFollow').classList.remove('hidden');
      $('ivNext').textContent = 'Answer follow-up';
      spoken += ' ' + out.followUp;
    }
    if (canSpeak) {
      $('ivReplyListen').classList.remove('hidden');
      $('ivReplyListen').dataset.text = spoken;
      if ($('ivAutoRead').checked) speak(spoken);
    }
  }

  $('ivReplyListen').addEventListener('click', function () {
    if (canSpeak && speechSynthesis.speaking) stopSpeaking(); else speak(this.dataset.text || '');
  });

  $('ivForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const text = $('ivAnswer').value.trim();
    if (!text) return;
    const s = score(text, usedVoice);
    stopVoice();
    const asked = questions[index];
    results.push({ q: (followUps.has(asked) ? 'Follow-up: ' : '') + asked, a: text, s: s });
    persist(false);
    renderScores($('ivScores'), s);
    $('ivReply').classList.add('hidden');
    $('ivTips').replaceChildren.apply($('ivTips'), s.tips.map((t) => { const li = document.createElement('li'); li.textContent = t; return li; }));
    $('ivNext').textContent = index === questions.length - 1 ? 'See results' : 'Next question';
    show('ivFeedbackView');
    $('ivNext').focus();
    runInterviewerReply(asked, text);
  });
  $('ivListen').addEventListener('click', function () {
    if (canSpeak && speechSynthesis.speaking) stopSpeaking(); else speak(spokenText(questions[index]));
  });
  try { $('ivAutoRead').checked = localStorage.getItem('aiic_autoread') === '1'; } catch (e) {}
  $('ivAutoRead').addEventListener('change', function () {
    try { localStorage.setItem('aiic_autoread', this.checked ? '1' : '0'); } catch (e) {}
    if (this.checked) speak(spokenText(questions[index])); else stopSpeaking();
  });
  $('ivMic').addEventListener('click', function () { if (listening) stopVoice(); else startVoice(); });
  window.addEventListener('pagehide', function () { stopVoice(); stopSpeaking(); });

  $('ivRunCode').addEventListener('click', runFromUi);
  $('ivSkipCode').addEventListener('click', function () {
    index++;
    if (index >= questions.length) showSummary(); else showQuestion();
  });
  $('ivCodeForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const q = questions[index];
    const out = await runFromUi();
    if (out.loadFail || workerError) return;
    const rs = out.results || [];
    const passed = rs.filter((r) => r.ok).length, total = q.tests.length;
    const overall = Math.round(passed / total * 100);
    results.push({ q: 'Coding problem: ' + q.title, a: $('ivCode').value, kind: 'code', s: { overall: overall, tests: { passed: passed, total: total } } });
    persist(false);
    $('ivScores').replaceChildren(scoreTile('Overall', overall), scoreTile('Tests passed', passed + '/' + total));
    const tips = [];
    if (out.error) tips.push(out.error);
    rs.filter((r) => !r.ok).slice(0, 3).forEach((r) => tips.push(r.call + ' should return ' + r.expected + ' but returned ' + r.got + '.'));
    if (!tips.length) tips.push('All tests passed. In a real interview, also explain your approach and its time complexity out loud.');
    else tips.push('In a real interview, talk through your approach and test edge cases such as empty input.');
    $('ivTips').replaceChildren.apply($('ivTips'), tips.map((t) => { const li = document.createElement('li'); li.textContent = t; return li; }));
    $('ivNext').textContent = index === questions.length - 1 ? 'See results' : 'Next question';
    show('ivFeedbackView');
    $('ivNext').focus();
  });
  // Tab inserts spaces in the editor; press Escape first to move focus out instead.
  let tabEscapes = false;
  $('ivCode').addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { tabEscapes = true; return; }
    if (e.key === 'Tab' && !e.shiftKey && !tabEscapes) {
      e.preventDefault();
      const s = this.selectionStart;
      this.setRangeText('    ', s, this.selectionEnd, 'end');
    } else if (e.key !== 'Shift') { tabEscapes = false; }
  });

  $('ivNext').addEventListener('click', function () {
    replyToken++; stopSpeaking();
    if (pendingFollowUp) {
      const r = removableIndex();
      if (r !== -1) {
        questions.splice(r, 1);
        questions.splice(index + 1, 0, pendingFollowUp);
        followUps.add(pendingFollowUp);
        followUpCount++;
      }
      pendingFollowUp = null;
    }
    $('ivReply').classList.add('hidden');
    index++;
    if (index >= questions.length) showSummary(); else showQuestion();
  });
  $('ivRetry').addEventListener('click', start);

  $('ivReturn').addEventListener('click', function () {
    const q = questions[index];
    const inCode = typeof q === 'object' && !$('ivCodeForm').classList.contains('hidden');
    const draft = inCode ? ($('ivCode').value.trim() !== q.starter.trim()) : $('ivAnswer').value.trim();
    if (!$('ivQuestionView').classList.contains('hidden') && draft && !confirm('Leave the interview? Your current unsent answer will be lost. Answers you already submitted are saved in your history.')) return;
    window.location.href = 'roles.html';
  });

  start();
})();
