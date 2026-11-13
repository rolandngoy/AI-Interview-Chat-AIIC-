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
  // Internship interviews: the candidate may have little or no work experience, so every question is about
  // interest, knowledge or what they would do, never about past jobs or personal experience.
  const isIntern = /\bintern(ship)?\b/i.test(role);
  const INTERN_GENERAL = [
    'If you were given a task you had never done before and your manager was busy, how would you get started?',
    'How would you handle getting critical feedback on your first big assignment?',
    'Imagine you realize you made a mistake that nobody has noticed yet. What would you do?',
    'If two teammates gave you urgent tasks at the same time, how would you decide what to do first?',
    'What would you do in your first week to get up to speed quickly?',
    'If you disagreed with a teammate\'s approach on a group project, how would you handle it?',
    'How would you ask for help without slowing the team down?',
    'What does professionalism mean to you in an office or a remote team?',
    'How would you manage your time if your internship overlapped with classes or other commitments?',
    'What would you do if you were asked to take on a task that felt outside your skills?',
    'How would you go about learning a new tool or skill your team uses?',
    'What kind of mentor or team would help you do your best work and learn the most?',
    'If you finished all your tasks early, what would you do?',
    'What would you want your manager to say about you at the end of the internship?'
  ];
  function buildInternQuestions() {
    const coding = window.AIIC_CODE && AIIC_CODE.isCodingRole(role);
    const MID = TOTAL - 3 - (coding ? 1 : 0);
    let specific = pick((window.AIIC_ROLE_QUESTIONS || {})[role] || [], 5);
    if (!specific.length) {
      specific = [
        'What skills do you think matter most for an intern in this role, and how would you build them?',
        'What do you think would be the hardest part of this internship?',
        'How would you plan your first week to learn as much as possible?'
      ];
    }
    let mid = specific.concat(pick(INTERN_GENERAL, MID - specific.length));
    mid = pick(mid, MID);
    if (coding) mid.splice(Math.floor(MID / 2), 0, AIIC_CODE.pick(role));
    return [
      'Why are you interested in the ' + role + ' position, and what do you hope to learn from it?',
      'What do you think makes someone a great intern in this field?'
    ].concat(mid, [CLOSING]);
  }

  function buildQuestions() {
    if (isIntern) return buildInternQuestions();
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
  const views = ['ivQuestionView', 'ivSummaryView'];
  function show(id) { views.forEach((v) => $(v).classList.toggle('hidden', v !== id)); }

  let questions, index, results, sessionId;
  let turn = 0;                 // bumped whenever the conversation moves on, so stale async steps stop
  let answering = false, silenceTimer = null, micDenied = false, restarts = 0;
  let mediaRec = null, mediaStream = null, chunks = [], audioUrl = null;
  let overallInfo = null, feedbackToken = 0, feedbackOff = false;   // the AI's closing summary, and the results-screen state

  /* ---------- AI interviewer persona ---------- */
  const PEOPLE = window.AIIC_INTERVIEWERS || {};
  const PERSON_IDS = Object.keys(PEOPLE);
  let personaId = 'roland';
  let followUps = new Set(), followUpCount = 0, pendingFollowUp = null, replyToken = 0, aiOff = false;
  const MAX_FOLLOW_UPS = 5;
  const persona = () => PEOPLE[personaId];

  // Roland asks the 1st, 3rd, 5th... question and Makenzie the 2nd, 4th... A follow-up is asked by
  // whoever asked the question it follows. `askers` stays parallel to `questions`.
  let askers = [], introActive = false;
  function setAsker(id) {
    personaId = id;
    const p = persona();
    if (!p) return;
    $('ivAsker').textContent = p.name + ' asks:';
  }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  function pickVoice(p) {
    const voices = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang));
    for (let i = 0; i < p.voiceHints.length; i++) {
      const v = voices.find((x) => x.name.indexOf(p.voiceHints[i]) !== -1);
      if (v) return v;
    }
    // Otherwise give each interviewer a different installed English voice, skipping any this one should avoid.
    const avoid = p.avoidVoices || [];
    const pool = voices.filter((v) => !avoid.some((a) => v.name.indexOf(a) !== -1));
    const list = pool.length ? pool : voices;
    return list.length ? list[PERSON_IDS.indexOf(p.id) % list.length] : null;
  }
  // Browsers often load their voice list late, so the first line can come out in the default (often deep) voice.
  function voicesReady() {
    if (!('speechSynthesis' in window) || speechSynthesis.getVoices().length) return Promise.resolve();
    return new Promise(function (resolve) {
      const done = function () { speechSynthesis.removeEventListener('voiceschanged', done); resolve(); };
      speechSynthesis.addEventListener('voiceschanged', done);
      setTimeout(done, 1500);
    });
  }

  function persist(complete) {
    if (!results.length || !window.AIIC_STORE) return;
    AIIC_STORE.saveSession(user, {
      id: sessionId, role: role, date: sessionId, total: questions.length, complete: complete, results: results,
      grade: AIIC_GRADES.overall(results), overall: overallInfo || null
    });
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
  const spokenText = (q) => (typeof q === 'object' ? 'Here is a coding problem. ' + q.prompt : q);
  const voiceAllowed = (q) => typeof q !== 'object' && PRACTICAL.indexOf(q) === -1;

  function setListenUi(on) {
    $('ivListenLabel').textContent = on ? 'Stop listening' : 'Listen to question';
    $('ivListen').setAttribute('aria-pressed', on);
  }
  const soundOn = () => canSpeak && $('ivAutoRead').checked;
  let line = null; // the line currently being spoken: { cancel }

  // One interviewer says one line. The mouth and body animate for the whole line, with real
  // speech when sound is on and a timed silent version (captions only) when it is off or unsupported.
  async function speakLine(id, text) {
    stopSpeaking();
    const p = PEOPLE[id];
    if (soundOn()) await voicesReady();
    return new Promise(function (resolve) {
      let done = false, watchdog = null, ticker = null;
      const words = text.split(/\s+/).filter(Boolean).length;
      function finish() {
        if (done) return;
        done = true;
        clearTimeout(watchdog); clearInterval(ticker);
        line = null;
        AIIC_STAGE.setSpeaking(id, false);
        setListenUi(false);
        setTimeout(function () { if (!line) AIIC_STAGE.setCaption('', ''); }, 2500);
        resolve();
      }
      AIIC_STAGE.setSpeaking(id, true);
      AIIC_STAGE.setCaption(p.name, text);
      setListenUi(true);
      if (soundOn()) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US'; u.rate = p.rate; u.pitch = p.pitch;
        const v = pickVoice(p);
        if (v) u.voice = v;
        const tag = document.querySelector('[data-tag="' + id + '"]');
        if (tag) tag.title = 'Voice: ' + (v ? v.name : 'browser default');
        u.onboundary = function () { AIIC_STAGE.pulse(id); };
        u.onend = u.onerror = finish;
        watchdog = setTimeout(finish, Math.max(5000, words * 700 + 3000)); // some browsers never fire onend
        line = { cancel: function () { speechSynthesis.cancel(); finish(); } };
        speechSynthesis.speak(u);
      } else {
        ticker = setInterval(function () { AIIC_STAGE.pulse(id); }, 330);
        watchdog = setTimeout(finish, Math.max(1500, words * 330));
        line = { cancel: finish };
      }
    });
  }
  function stopSpeaking() {
    if (line) line.cancel();
    else if (canSpeak) speechSynthesis.cancel();
  }
  const speak = (text) => { speakLine(personaId, text); };

  const firstName = () => String(user.name || '').trim().split(/\s+/)[0] || String(user.email || '').split('@')[0] || 'there';
  const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const wordCount = (t) => t.trim().split(/\s+/).filter(Boolean).length;

  const canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  const PLAY_LABEL = '▶ Listen to your answer';

  // The microphone is a three-step control: tap to answer, tap when finished, then review the recording.
  function setVoiceState(st) {
    $('ivMic').classList.toggle('recording', st === 'recording');
    $('ivMic').classList.toggle('hidden', st === 'review');
    $('ivMic').setAttribute('aria-pressed', st === 'recording');
    $('ivMicLabel').textContent = st === 'recording' ? 'Tap when you are done' : 'Tap to answer';
    $('ivReview').classList.toggle('hidden', st !== 'review');
  }
  function stopPlayback() {
    const a = $('ivAudio');
    try { a.pause(); } catch (e) {}
    $('ivPlay').textContent = PLAY_LABEL;
  }
  function releaseMedia() {
    if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
    mediaStream = null; mediaRec = null;
  }
  // Abandons any recording in progress (used when the conversation moves on).
  function stopVoice() {
    answering = false;
    clearTimeout(silenceTimer);
    if (recognizer) { const r = recognizer; recognizer = null; try { r.abort ? r.abort() : r.stop(); } catch (e) {} }
    if (mediaRec && mediaRec.state !== 'inactive') { mediaRec.onstop = null; try { mediaRec.stop(); } catch (e) {} }
    releaseMedia();
    stopPlayback();
    setVoiceState('idle');
  }

  // Falls back to typing when the microphone can't be used, or for hands-on questions.
  function showTyped(message) {
    $('ivVoice').classList.add('hidden');
    $('ivTyped').classList.remove('hidden');
    $('ivTypedNote').textContent = message || '';
    $('ivWords').textContent = wordCount($('ivAnswer').value) + ' words';
    $('ivAnswer').focus();
  }
  function useTypingInstead(message) {
    micDenied = true;
    stopVoice();
    $('ivAnswer').value = '';
    showTyped(message);
  }

  // Speech-to-text runs while recording, so the interviewer knows what was said. The words are not shown.
  function startRecognition() {
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
    };
    rec.onerror = function (e) {
      if (e.error === 'no-speech' || e.error === 'aborted') return; // onend restarts it
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') useTypingInstead('The microphone is blocked, so please type your answer. Allow microphone access for this site to answer by voice.');
      else if (e.error === 'audio-capture') useTypingInstead('No microphone was found, so please type your answer.');
      else if (e.error === 'network') useTypingInstead('Voice input needs an internet connection, so please type your answer.');
    };
    rec.onend = function () {
      if (recognizer !== rec) return;
      recognizer = null;
      if (answering && restarts < 25) { restarts++; startRecognition(); }   // browsers end long sessions on their own
    };
    recognizer = rec;
    try { rec.start(); } catch (e) { recognizer = null; }
  }

  async function startRecording() {
    stopPlayback();
    const ta = $('ivAnswer');
    ta.value = ''; usedVoice = false; restarts = 0; chunks = []; audioUrl = null;
    $('ivAudio').removeAttribute('src');
    $('ivSubmitAns').classList.remove('hidden');
    $('ivMicStatus').textContent = 'Allow the microphone if your browser asks…';
    answering = true;
    if (canRecord) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRec = new MediaRecorder(mediaStream);
        mediaRec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        mediaRec.start();
      } catch (e) {
        if (e && e.name === 'NotFoundError') { useTypingInstead('No microphone was found, so please type your answer.'); return; }
        if (e && (e.name === 'NotAllowedError' || e.name === 'SecurityError')) { useTypingInstead('The microphone is blocked, so please type your answer. Allow microphone access for this site to answer by voice.'); return; }
        mediaRec = null;                                    // recording failed, but speech-to-text can still work
      }
    }
    if (!answering) return;                                  // the conversation moved on while waiting
    startRecognition();
    setVoiceState('recording');
    $('ivMicStatus').textContent = 'Listening… tap the microphone again when you have finished.';
  }

  async function finishRecording() {
    answering = false;
    const waits = [];
    if (recognizer) {
      const r = recognizer; recognizer = null;
      waits.push(new Promise(function (res) { r.onend = res; try { r.stop(); } catch (e) { res(); } setTimeout(res, 1200); }));
    }
    if (mediaRec && mediaRec.state !== 'inactive') {
      const m = mediaRec;
      waits.push(new Promise(function (res) { m.onstop = res; try { m.stop(); } catch (e) { res(); } setTimeout(res, 1200); }));
    }
    await Promise.all(waits);
    if (chunks.length) {
      audioUrl = URL.createObjectURL(new Blob(chunks, { type: (mediaRec && mediaRec.mimeType) || 'audio/webm' }));
      $('ivAudio').src = audioUrl;
    }
    releaseMedia();
    const heard = wordCount($('ivAnswer').value) >= 3;
    setVoiceState('review');
    $('ivPlay').classList.toggle('hidden', !audioUrl);
    $('ivSubmitAns').classList.toggle('hidden', !heard);
    $('ivMicStatus').textContent = heard
      ? 'Happy with that? Listen to it, record it again, or press OK to continue.'
      : 'I did not catch anything. Please record your answer again.';
  }

  // The interviewer has finished asking: it is now the candidate's turn.
  function beginAnswering(q) {
    if (typeof q === 'object') { $('ivCode').focus(); return; }
    const voice = voiceAllowed(q) && !!SpeechRec && !micDenied;
    $('ivAnswer').value = '';
    usedVoice = false; restarts = 0;
    $('ivForm').classList.remove('hidden');
    if (voice) {
      $('ivTyped').classList.add('hidden');
      $('ivVoice').classList.remove('hidden');
      setVoiceState('idle');
      $('ivMicStatus').textContent = 'Tap the microphone when you are ready to speak.';
      $('ivMic').focus();
    } else {
      showTyped(!voiceAllowed(q)
        ? 'This is a hands-on question, so please type your answer.'
        : (!SpeechRec ? 'Voice answers are not supported in this browser, so please type your answer. Chrome, Edge and Safari support voice.' : ''));
    }
  }

  // Shows a question and has its interviewer ask it out loud. `prefix` is a spoken lead-in like "Sure!".
  async function showQuestion(prefix) {
    const myTurn = ++turn;
    const q = questions[index];
    AIIC_STAGE.startOverlay(false);
    setAsker(askers[index] || 'roland');
    const isCode = typeof q === 'object';
    stopVoice();
    $('ivQuestion').textContent = isCode ? 'Coding problem: ' + q.prompt : q;
    $('ivForm').classList.add('hidden');                 // no answering while the question is being asked
    $('ivCodeForm').classList.toggle('hidden', !isCode);
    $('ivListen').classList.toggle('hidden', !canSpeak);
    $('ivCount').textContent = (followUps.has(q) ? 'Follow-up · ' : '') + 'Question ' + (index + 1) + ' of ' + questions.length;
    $('ivBar').style.width = (index / questions.length * 100) + '%';
    show('ivQuestionView');
    if (isCode) {
      $('ivCode').value = q.starter;
      $('ivCodeOut').classList.add('hidden');
      $('ivCodeOut').replaceChildren();
      $('ivPyStatus').textContent = '';
      getRunner();
    }
    await speakLine(personaId, (prefix || '') + spokenText(q));
    if (myTurn !== turn) return;
    beginAnswering(q);
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

  /* ---------- results: grades, feedback and better answers (saved for the end of the interview) ---------- */
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const cleanQ = (r) => r.q.replace(/^(Follow-up|Coding problem): /, '');

  function renderResults() {
    const G = AIIC_GRADES, og = G.overall(results);
    $('ivOverallGrade').textContent = og;
    $('ivOverallGrade').className = 'iv-grade grade-' + og;
    $('ivOutcome').textContent = 'Grade ' + og + ' · ' + G.LABEL[og] + ' · ' + G.outcome(og);
    $('ivOverallSummary').textContent = overallInfo ? overallInfo.summary : 'Here is how your answers scored.';
    const has = overallInfo && (overallInfo.strengths.length || overallInfo.focus.length);
    $('ivTwoCol').classList.toggle('hidden', !has);
    const fill = (id, list) => $(id).replaceChildren.apply($(id), (list || []).map((t) => el('li', null, t)));
    fill('ivStrengths', overallInfo && overallInfo.strengths); fill('ivFocus', overallInfo && overallInfo.focus);

    $('ivHistory').replaceChildren.apply($('ivHistory'), results.map(function (r) {
      const g = G.ofResult(r);
      const li = el('li', 'iv-card');
      const head = el('div', 'iv-card-head');
      head.append(el('span', 'iv-card-q', (r.q.indexOf('Follow-up: ') === 0 ? 'Follow-up: ' : '') + cleanQ(r)), el('strong', 'iv-chip grade-' + g, g));
      li.appendChild(head);
      if (r.feedback) {
        li.appendChild(el('p', 'iv-fb', r.feedback));
        if (r.improve) { const p = el('p', 'iv-fb'); p.append(el('strong', null, 'To improve: '), document.createTextNode(r.improve)); li.appendChild(p); }
        if (r.better) {
          const box = el('div', 'iv-better');
          box.appendChild(el('p', 'mono small iv-h', 'A stronger answer'));
          box.appendChild(el(r.kind === 'code' ? 'pre' : 'p', r.kind === 'code' ? 'iv-better-code' : null, r.better));
          li.appendChild(box);
        }
      } else if (r.tips && r.tips.length) {
        const ul = el('ul', 'iv-bullets');
        r.tips.forEach((t) => ul.appendChild(el('li', null, t)));
        li.appendChild(ul);
      }
      const d = el('details', 'iv-said');
      d.appendChild(el('summary', null, 'What you said'));
      d.appendChild(el(r.kind === 'code' ? 'pre' : 'p', r.kind === 'code' ? 'iv-better-code' : null, r.a));
      li.appendChild(d);
      return li;
    }));
  }

  async function postFeedback(payload) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 50000);
    try {
      const token = await AIIC_AUTH.auth.currentUser.getIdToken();
      const res = await fetch('/api/feedback', {
        method: 'POST', signal: ctl.signal,
        headers: { 'Content-Type': 'application/json', 'X-Firebase-Token': token },
        body: JSON.stringify(payload)
      });
      if (res.status === 429) { const e = new Error('limit'); e.limit = true; throw e; }
      if (!res.ok) throw new Error('http ' + res.status);
      return await res.json();
    } finally { clearTimeout(timer); }
  }

  // Asks the AI to grade the answers (a few per request, in parallel), then to write the closing summary.
  async function loadAiFeedback() {
    const my = ++feedbackToken;
    $('ivRetryFeedback').classList.add('hidden');
    if (feedbackOff || !window.AIIC_AUTH || !AIIC_AUTH.configured || !AIIC_AUTH.auth || !AIIC_AUTH.auth.currentUser) {
      $('ivFeedbackStatus').textContent = 'These are automatic scores. Detailed AI feedback is not available right now.';
      return;
    }
    const todo = results.map((r, i) => ({ r: r, i: i })).filter((x) => !x.r.feedback);
    if (!todo.length && overallInfo) { $('ivFeedbackStatus').textContent = ''; return; }
    $('ivFeedbackStatus').textContent = 'Roland and Makenzie are reviewing your answers…';

    const chunks = [];
    for (let k = 0; k < todo.length; k += 3) chunks.push(todo.slice(k, k + 3));
    let done = 0, failed = 0, limitHit = false;
    await Promise.all(chunks.map(async function (chunk) {
      try {
        const out = await postFeedback({
          mode: 'answers', role: role, intern: isIntern,
          items: chunk.map((x) => ({
            id: x.i, kind: x.r.kind === 'code' ? 'code' : 'text', followUp: x.r.q.indexOf('Follow-up: ') === 0,
            question: x.r.kind === 'code' ? (x.r.prompt || cleanQ(x.r)) : cleanQ(x.r), answer: x.r.a,
            tests: x.r.kind === 'code' ? x.r.s.tests : undefined
          }))
        });
        if (my !== feedbackToken) return;
        (out.answers || []).forEach(function (a) {
          const r = results[a.id];
          if (r) { r.grade = a.grade; r.feedback = a.feedback; r.improve = a.improve; r.better = a.better; }
        });
        done += chunk.length;
        $('ivFeedbackStatus').textContent = 'Reviewing your answers… ' + Math.min(done, todo.length) + ' of ' + todo.length;
        renderResults();
      } catch (e) { failed += chunk.length; if (e && e.limit) limitHit = true; }
    }));
    if (my !== feedbackToken) return;

    if (results.some((r) => r.feedback) && !overallInfo) {
      try {
        const out = await postFeedback({
          mode: 'overall', role: role, intern: isIntern,
          items: results.map((r) => ({ question: cleanQ(r), grade: AIIC_GRADES.ofResult(r), feedback: r.feedback || (r.tips && r.tips[0]) || '' }))
        });
        if (my === feedbackToken && out.overall) overallInfo = out.overall;
      } catch (e) { if (e && e.limit) limitHit = true; }
    }
    if (my !== feedbackToken) return;
    renderResults();
    persist(true);
    if (limitHit) feedbackOff = true;
    const missing = results.some((r) => !r.feedback);
    $('ivFeedbackStatus').textContent = !missing ? '' : (limitHit
      ? 'You have reached today\'s limit for AI feedback, so some answers show automatic scores. It resets tomorrow.'
      : 'Some answers could not be reviewed by the AI right now, so they show automatic scores.');
    $('ivRetryFeedback').classList.toggle('hidden', !missing || limitHit);
  }
  $('ivRetryFeedback').addEventListener('click', loadAiFeedback);

  function showSummary() {
    stopVoice(); stopSpeaking();
    $('ivBar').style.width = '100%';
    $('ivCount').textContent = 'Done';
    show('ivSummaryView');
    renderResults();
    persist(true);
    loadAiFeedback();
  }

  function start() {
    questions = buildQuestions();
    index = 0;
    results = [];
    followUps = new Set(); followUpCount = 0; pendingFollowUp = null; replyToken++; aiOff = false;
    ++turn; micDenied = false; stopVoice();
    overallInfo = null; feedbackToken++; feedbackOff = false;
    sessionId = Date.now();
    askers = questions.map((_, i) => (i % 2 === 0 ? 'roland' : 'makenzie'));
    introActive = false;
    stopSpeaking();
    AIIC_STAGE.setCaption('', '');
    $('ivBegin').classList.remove('hidden');
    $('stageStart').classList.remove('is-intro');
    AIIC_STAGE.startOverlay(true);
    show('none');
    $('ivCount').textContent = 'Ready when you are';
    $('ivBar').style.width = '0%';
  }

  // Roland and Makenzie introduce themselves, then Roland asks the first question.
  async function runIntro() {
    if (introActive) return;
    introActive = true;
    $('ivBegin').classList.add('hidden');
    $('stageStart').classList.add('is-intro');
    const first = String(user.name || '').trim().split(/\s+/)[0] || String(user.email || '').split('@')[0] || 'there';
    const script = [
      ['roland', 'Hello ' + first + ', my name is Roland.'],
      ['makenzie', 'Hi, I\'m Makenzie.'],
      ['roland', 'We\'re excited to interview you for the ' + role + ' position.']
    ];
    for (let i = 0; i < script.length; i++) {
      if (!introActive) return; // skipped
      setAsker(script[i][0]);
      await speakLine(script[i][0], script[i][1]);
      if (!introActive) return;
      await sleep(300);
    }
    if (!introActive) return;
    introActive = false;
    showQuestion();
  }
  function skipIntro() {
    if (!introActive && !$('ivQuestionView').classList.contains('hidden')) return;
    introActive = false;
    stopSpeaking();
    showQuestion();
  }

  if ('speechSynthesis' in window) { try { speechSynthesis.getVoices(); } catch (e) {} }
  $('ivRole').textContent = role;
  setAsker('roland');
  $('ivBegin').addEventListener('click', runIntro);
  $('ivSkipIntro').addEventListener('click', function () { if (!introActive) { introActive = true; } skipIntro(); });
  $('ivAnswer').addEventListener('input', function () {
    const n = this.value.trim().split(/\s+/).filter(Boolean).length;
    $('ivWords').textContent = n + (n === 1 ? ' word' : ' words');
  });
  /* ---------- the conversation: reactions, follow-up questions and hand-offs ---------- */
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
  function insertFollowUp(text) {
    const r = removableIndex();
    if (r === -1) return false;
    questions.splice(r, 1); askers.splice(r, 1);
    questions.splice(index + 1, 0, text); askers.splice(index + 1, 0, askers[index]);
    followUps.add(text); followUpCount++;
    return true;
  }

  // The AI interviewer (when the server is set up). Returns null when unavailable.
  async function askInterviewer(q, answer, canFollowUp) {
    if (aiOff || !window.AIIC_AUTH || !AIIC_AUTH.configured || !AIIC_AUTH.auth || !AIIC_AUTH.auth.currentUser) return null;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 25000);
    try {
      const token = await AIIC_AUTH.auth.currentUser.getIdToken();
      const res = await fetch('/api/interviewer', {
        method: 'POST', signal: ctl.signal,
        headers: { 'Content-Type': 'application/json', 'X-Firebase-Token': token },
        body: JSON.stringify({
          interviewer: personaId, role: role, intern: isIntern, question: q, answer: answer, canFollowUp: canFollowUp,
          // the last few spoken answers (not the one just given), so follow-ups can connect to the whole conversation
          recent: results.slice(-4, -1).filter((r) => r.kind !== 'code').map((r) => ({ q: r.q.replace(/^Follow-up: /, ''), a: r.a }))
        })
      });
      if (res.status === 429 || res.status === 401) { aiOff = true; return null; }
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { return null; } finally { clearTimeout(timer); }
  }

  // Used when the AI is unavailable, so interviews are still a back-and-forth conversation.
  const INTERN_FOLLOW_UPS = [
    'Can you walk me through how you would approach that, step by step?',
    'What would you do first, and why?',
    'What could go wrong there, and how would you handle it?',
    'How would you check that your approach actually worked?',
    'What would you want to learn more about before doing that?'
  ];
  const FOLLOW_UPS = [
    'Can you give me a specific example of that?',
    'What was the result, and how did you know it worked?',
    'What would you do differently next time?',
    'How did the people you worked with react to that?',
    'What was the hardest part of that for you?',
    'Walk me through what you personally did, step by step.'
  ];
  // Between questions the interviewers only acknowledge. All feedback is saved for the end.
  const NEUTRAL = ['Okay, thank you.', 'Got it, thanks.', 'Alright, thank you for that.', 'Mm-hm. Thank you.', 'Understood, thank you.'];
  function localReply(q, text, canFollowUp) {
    const wc = wordCount(text), hasNumber = /\d/.test(text);
    if (q === CLOSING) return { reaction: 'Thanks for asking. We will wrap up there.', followUp: null };
    const reaction = pickOne(NEUTRAL);
    const thin = wc < 60 || !hasNumber;
    const followUp = canFollowUp && (Math.random() < (thin ? 0.75 : 0.3)) ? pickOne(isIntern ? INTERN_FOLLOW_UPS : FOLLOW_UPS) : null;
    return { reaction: reaction, followUp: followUp };
  }
  async function getReply(q, text) {
    const canFollowUp = canFollowUpNow(q);
    const out = await askInterviewer(q, text, canFollowUp);
    if (out && out.reaction) return { reaction: out.reaction, followUp: canFollowUp ? out.followUp || null : null };
    return localReply(q, text, canFollowUp);
  }

  const HANDOFF = {
    roland: ['Thanks. Makenzie, would you like to take the next one?', 'Good stuff. Makenzie, over to you.', 'Thank you. Makenzie?'],
    makenzie: ['Thanks! Roland, go ahead.', 'Great. Roland, over to you.', 'Thank you. Roland?']
  };
  const TAKE_OVER = {
    makenzie: ['Sure! ', 'Happy to. ', 'Absolutely. '],
    roland: ['Thanks, Makenzie. ', 'Sure. ', 'Alright. ']
  };

  // Moves to the next question, with a hand-off between the two interviewers; or wraps up.
  async function advance(prevWho) {
    const myTurn = turn;
    index++;
    if (index >= questions.length) {
      $('ivForm').classList.add('hidden'); $('ivCodeForm').classList.add('hidden');
      // Roland thanks the candidate, then Makenzie says goodbye.
      const goodbye = [
        ['roland', 'Thank you for coming today.'],
        ['makenzie', 'We\'ll reach back to you with an answer as soon as possible, have a good rest of your day!']
      ];
      for (let i = 0; i < goodbye.length; i++) {
        setAsker(goodbye[i][0]);
        $('ivAsker').textContent = PEOPLE[goodbye[i][0]].name + ' says:';
        $('ivQuestion').textContent = goodbye[i][1];
        await speakLine(goodbye[i][0], goodbye[i][1]);
        if (myTurn !== turn) return;
        await sleep(300);
        if (myTurn !== turn) return;
      }
      showSummary();
      return;
    }
    let prefix = '';
    if (askers[index] !== prevWho) {
      const handoff = pickOne(HANDOFF[prevWho]);
      $('ivQuestion').textContent = handoff;
      await speakLine(prevWho, handoff);
      if (myTurn !== turn) return;
      prefix = pickOne(TAKE_OVER[askers[index]]);
    } else {
      prefix = pickOne(['Okay. ', 'Alright. ', 'Next question. ']);
    }
    await showQuestion(prefix);
  }

  // The candidate has answered a spoken or typed question.
  async function submitAnswer() {
    if ($('ivForm').classList.contains('hidden')) return;     // already submitted (e.g. a double tap)
    const text = $('ivAnswer').value.trim();
    if (!text) return;
    const myTurn = ++turn;
    stopVoice();
    const who = personaId;
    const asked = questions[index];
    const s = score(text, usedVoice);
    results.push({ q: (followUps.has(asked) ? 'Follow-up: ' : '') + asked, a: text, s: s, tips: s.tips });
    persist(false);
    $('ivForm').classList.add('hidden');
    $('ivAsker').textContent = PEOPLE[who].name + ' is thinking…';

    const reply = await getReply(asked, text);
    if (myTurn !== turn) return;
    $('ivAsker').textContent = PEOPLE[who].name + ' says:';
    $('ivQuestion').textContent = reply.reaction;
    await speakLine(who, reply.reaction);
    if (myTurn !== turn) return;
    if (reply.followUp && insertFollowUp(reply.followUp)) {
      index++;
      await showQuestion('');
    } else {
      await advance(who);
    }
  }
  $('ivForm').addEventListener('submit', function (e) { e.preventDefault(); submitAnswer(); });

  $('ivListen').addEventListener('click', function () {
    if (line) stopSpeaking(); else speak(spokenText(questions[index]));
  });
  function syncSoundBtn() {
    const on = $('ivAutoRead').checked;
    $('stageSound').setAttribute('aria-pressed', on);
    $('stageSoundLabel').textContent = on ? 'Sound on' : 'Sound off';
    $('stageSound').classList.toggle('is-off', !on);
  }
  $('stageSound').addEventListener('click', function () {
    $('ivAutoRead').checked = !$('ivAutoRead').checked;
    $('ivAutoRead').dispatchEvent(new Event('change'));
  });
  $('ivAutoRead').checked = true;
  try { if (localStorage.getItem('aiic_sound') === '0') $('ivAutoRead').checked = false; } catch (e) {}
  syncSoundBtn();
  if (!canSpeak) $('stageSound').classList.add('hidden');
  $('ivAutoRead').addEventListener('change', function () {
    try { localStorage.setItem('aiic_sound', this.checked ? '1' : '0'); } catch (e) {}
    syncSoundBtn();
    if (!this.checked) stopSpeaking();
  });
  $('ivMic').addEventListener('click', function () { if (answering) finishRecording(); else startRecording(); });
  $('ivRedo').addEventListener('click', startRecording);
  $('ivPlay').addEventListener('click', function () {
    const a = $('ivAudio');
    if (!a.paused) { stopPlayback(); return; }
    a.currentTime = 0;
    a.play().then(function () { $('ivPlay').textContent = '⏸ Pause'; }, function () {});
  });
  $('ivAudio').addEventListener('ended', function () { $('ivPlay').textContent = PLAY_LABEL; });
  window.addEventListener('pagehide', function () { stopVoice(); stopSpeaking(); });

  $('ivRunCode').addEventListener('click', runFromUi);
  $('ivSkipCode').addEventListener('click', function () { ++turn; advance(personaId); });
  $('ivCodeForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const q = questions[index];
    // Submitting runs the tests quietly: the results are kept for the end of the interview, not shown now.
    $('ivRunCode').disabled = $('ivSubmitCode').disabled = true;
    setPyStatus(workerReady ? 'Submitting…' : 'Loading Python… your solution will be submitted when it is ready.');
    const out = await runCode(q, $('ivCode').value);
    $('ivRunCode').disabled = $('ivSubmitCode').disabled = false;
    if (out.loadFail || workerError) { setPyStatus('Could not load the Python runner. Check your connection, or skip this problem.'); return; }
    setPyStatus('');
    stopSpeaking();
    const rs = out.results || [];
    const passed = rs.filter((r) => r.ok).length, total = q.tests.length;
    const overall = Math.round(passed / total * 100);
    const tips = [];
    if (out.error) tips.push(out.error);
    rs.filter((r) => !r.ok).slice(0, 3).forEach((r) => tips.push(r.call + ' should return ' + r.expected + ' but returned ' + r.got + '.'));
    if (!tips.length) tips.push('All tests passed. In a real interview, also explain your approach and its time complexity out loud.');
    else tips.push('In a real interview, talk through your approach and test edge cases such as empty input.');
    results.push({ q: 'Coding problem: ' + q.title, prompt: q.prompt, a: $('ivCode').value, kind: 'code', s: { overall: overall, tests: { passed: passed, total: total } }, tips: tips });
    persist(false);
    const myTurn = ++turn, who = personaId;
    $('ivCodeForm').classList.add('hidden');
    const ack = pickOne(NEUTRAL);
    $('ivAsker').textContent = PEOPLE[who].name + ' says:';
    $('ivQuestion').textContent = ack;
    await speakLine(who, ack);
    if (myTurn !== turn) return;
    await advance(who);
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

  $('ivRetry').addEventListener('click', start);

  $('ivReturn').addEventListener('click', function () {
    const q = questions[index];
    const inCode = typeof q === 'object' && !$('ivCodeForm').classList.contains('hidden');
    const draft = inCode ? ($('ivCode').value.trim() !== q.starter.trim()) : (!$('ivTyped').classList.contains('hidden') && $('ivAnswer').value.trim());
    if (!$('ivQuestionView').classList.contains('hidden') && draft && !confirm('Leave the interview? Your current unsent answer will be lost. Answers you already submitted are saved in your history.')) return;
    window.location.href = 'roles.html';
  });

  start();
})();
