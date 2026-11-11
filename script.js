/* =========================================================
   AI Interview Chat — landing page interactions
   - hero waveform + role marquee
   - live demo (typing question, sample answer, scorecard)
   - session trend bars
   - scroll reveal
   ========================================================= */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero waveform ---------- */
  const wave = document.getElementById('orbWave');
  for (let i = 0; i < 28; i++) {
    const bar = document.createElement('span');
    bar.style.height = (18 + Math.round(Math.abs(Math.sin(i * 0.85)) * 42)) + 'px';
    bar.style.animationDelay = (i * 0.07).toFixed(2) + 's';
    wave.appendChild(bar);
  }

  /* ---------- Role marquee (duplicated for a seamless loop) ---------- */
  const roles = ['Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer',
    'Marketing', 'Finance', 'Consulting', 'Customer Success'];
  const marquee = document.getElementById('marquee');
  roles.concat(roles).forEach((r, i) => {
    const s = document.createElement('span');
    s.textContent = r;
    if (i >= roles.length) s.setAttribute('aria-hidden', 'true');
    const star = document.createElement('i');
    star.textContent = '✦';
    star.setAttribute('aria-hidden', 'true');
    s.appendChild(star);
    marquee.appendChild(s);
  });

  /* ---------- Trend bars ---------- */
  const trend = document.getElementById('trend');
  ['38%', '46%', '42%', '58%', '61%', '72%', '70%', '86%'].forEach((h) => {
    const b = document.createElement('span');
    b.style.height = h;
    trend.appendChild(b);
  });

  /* ---------- Live demo ---------- */
  const DEMO = [
    {
      label: 'Software Engineer',
      q: 'Tell me about a time you had to fix a production issue under pressure.',
      a: 'During my internship, our checkout API started timing out right after a launch. I traced it to one slow database query, added an index, and wrote a postmortem so the team could catch it earlier next time.',
      s: [88, 74, 70, 91],
      tip: 'Clear story and strong ownership. Add the measurable result: how much faster did checkout get, and how many users did it affect? Numbers turn a good answer into a memorable one.'
    },
    {
      label: 'Product Manager',
      q: 'How would you prioritize features when engineering capacity is limited?',
      a: 'I start from the goal for the quarter, then score each feature on user impact and effort. I review the shortlist with engineering and design so the trade-offs are visible before we commit.',
      s: [82, 86, 66, 89],
      tip: 'Good framework. It sounds theoretical though: anchor it in one real decision you made and what you chose not to build.'
    },
    {
      label: 'Data Analyst',
      q: 'Walk me through how you would investigate a sudden drop in weekly active users.',
      a: 'First I would confirm the drop is real and not a tracking bug. Then I would segment by platform, region and signup cohort to find where it is concentrated, and line that up against recent releases.',
      s: [92, 84, 72, 90],
      tip: 'Excellent structure: validate, segment, correlate. Close the loop by saying how you would share findings and what action you would recommend.'
    },
    {
      label: 'Behavioral',
      q: 'Tell me about a time you disagreed with a teammate. How did you resolve it?',
      a: 'A teammate wanted to rewrite a module from scratch and I thought we should refactor it. We each wrote up the risks, asked our lead for a quick review, and agreed to refactor first with a fallback plan.',
      s: [80, 82, 64, 86],
      tip: 'Calm and collaborative, which interviewers like. Spend one more sentence on the outcome and what you learned about working with that teammate.'
    }
  ];
  const LABELS = ['Structure', 'Clarity', 'Impact', 'Relevance'];

  const el = (id) => document.getElementById(id);
  const tabsEl = el('roleTabs');
  const questionEl = el('question');
  const caretEl = el('caret');
  const answerBox = el('answerBox');
  const answerEl = el('answer');
  const analyzeBtn = el('analyzeBtn');
  const analyzingEl = el('analyzing');
  const tipBox = el('tipBox');
  const tipEl = el('tip');
  const replayBtn = el('replayBtn');
  const overallEl = el('overall');
  const scoreList = el('scoreList');
  const roleNameEl = el('roleName');

  let current = 0;
  let typeTimer = null;
  let analyzeTimer = null;

  // Build score rows once
  const scoreRows = LABELS.map((label) => {
    const row = document.createElement('div');
    row.innerHTML =
      '<div class="score-row-top"><span></span><span>--</span></div>' +
      '<div class="bar"><div class="bar-fill"></div></div>';
    row.querySelector('.score-row-top span').textContent = label;
    scoreList.appendChild(row);
    return { value: row.querySelector('.score-row-top span:last-child'), fill: row.querySelector('.bar-fill') };
  });

  // Build tabs
  const tabButtons = DEMO.map((r, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tab';
    b.setAttribute('role', 'tab');
    b.textContent = r.label;
    b.addEventListener('click', () => selectRole(i));
    tabsEl.appendChild(b);
    return b;
  });

  function show(node, on) { node.classList.toggle('hidden', !on); }

  function resetScores() {
    overallEl.textContent = '--';
    scoreRows.forEach((r) => { r.value.textContent = '--'; r.fill.style.width = '0%'; });
  }

  function typeQuestion(text) {
    clearInterval(typeTimer);
    questionEl.textContent = '';
    show(caretEl, true);
    if (reduceMotion) { questionEl.textContent = text; afterTyped(); return; }
    let i = 0;
    typeTimer = setInterval(() => {
      i = Math.min(text.length, i + 2);
      questionEl.textContent = text.slice(0, i);
      if (i >= text.length) { clearInterval(typeTimer); afterTyped(); }
    }, 32);
  }

  function afterTyped() {
    show(caretEl, false);
    answerEl.textContent = DEMO[current].a;
    show(answerBox, true);
    show(analyzeBtn, true);
  }

  function selectRole(i) {
    current = i;
    clearTimeout(analyzeTimer);
    tabButtons.forEach((b, j) => b.setAttribute('aria-selected', String(i === j)));
    roleNameEl.textContent = DEMO[i].label;
    [answerBox, analyzeBtn, analyzingEl, tipBox, replayBtn].forEach((n) => show(n, false));
    resetScores();
    typeQuestion(DEMO[i].q);
  }

  analyzeBtn.addEventListener('click', () => {
    show(analyzeBtn, false);
    show(analyzingEl, true);
    analyzeTimer = setTimeout(() => {
      const r = DEMO[current];
      show(analyzingEl, false);
      tipEl.textContent = r.tip;
      show(tipBox, true);
      show(replayBtn, true);
      overallEl.textContent = String(Math.round(r.s.reduce((a, b) => a + b, 0) / r.s.length));
      scoreRows.forEach((row, k) => {
        row.value.textContent = String(r.s[k]);
        requestAnimationFrame(() => { row.fill.style.width = r.s[k] + '%'; });
      });
    }, 1400);
  });

  replayBtn.addEventListener('click', () => selectRole(current));

  // Start typing when the demo scrolls into view (or right away if unsupported)
  let started = false;
  function startDemo() { if (!started) { started = true; selectRole(0); } }
  if ('IntersectionObserver' in window) {
    tabButtons.forEach((b, j) => b.setAttribute('aria-selected', String(j === 0)));
    roleNameEl.textContent = DEMO[0].label;
    const demoObs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { startDemo(); demoObs.disconnect(); }
    }, { threshold: 0.3 });
    demoObs.observe(el('demo'));
  } else {
    startDemo();
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((n) => {
      const idx = Array.prototype.indexOf.call(n.parentElement.children, n);
      n.style.transitionDelay = (n.parentElement.classList.contains('steps') ? idx * 0.12 : 0) + 's';
      obs.observe(n);
    });
  } else {
    revealEls.forEach((n) => n.classList.add('in'));
  }
})();
