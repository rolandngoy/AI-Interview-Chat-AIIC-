/* =========================================================
   AI Interview Chat — company dashboard (after a Microsoft or Google log in)
   - create pre-assessments: a code, the questions, and the candidate emails allowed to use it
   - review each candidate's interview: answers, grades and AI feedback
   ========================================================= */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const A = window.AIIC_ASSESS;
  const G = window.AIIC_GRADES;
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const fmtDate = (ms) => new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  // The same behavioral questions the practice interview uses, offered as "General".
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
  const BANK = Object.assign({ 'General (behavioral)': GENERAL }, window.AIIC_ROLE_QUESTIONS || {});
  const MAX_Q = 30;

  let user = null;
  let mine = [];        // this company's assessments
  let editing = null;   // the assessment being edited, or null for a new one
  let draftQs = [];     // questions in the editor
  let draftLimits = []; // seconds allowed for each question in draftQs (0 = no limit)

  const TIMES = [[0, 'No time limit'], [30, '30 seconds'], [60, '1 minute'], [90, '1.5 minutes'], [120, '2 minutes'], [180, '3 minutes'], [300, '5 minutes'], [600, '10 minutes']];
  const defaultLimit = () => { const n = parseInt($('eDefaultTime').value, 10); return isNaN(n) ? 120 : n; };   // 'mixed' -> 2 minutes for new questions
  function timeSelect(value, label) {
    const s = el('select', 'co-input co-q-time'); s.setAttribute('aria-label', label);
    TIMES.forEach(function (t) { const o = el('option', null, t[1]); o.value = String(t[0]); s.appendChild(o); });
    if (!TIMES.some((t) => t[0] === value)) { const o = el('option', null, value + ' seconds'); o.value = String(value); s.appendChild(o); }
    s.value = String(value);
    return s;
  }

  const VIEWS = ['cLoading', 'cNotCompany', 'cListView', 'cEditView', 'cReviewView', 'cApplicantView'];
  const WITH_SIDEBAR = ['cListView', 'cEditView', 'cReviewView', 'cApplicantView'];
  function show(id) {
    VIEWS.forEach((v) => $(v).classList.toggle('hidden', v !== id));
    $('cSide').classList.toggle('hidden', WITH_SIDEBAR.indexOf(id) === -1);
    window.scrollTo(0, 0);
  }

  /* ---------- applicants (the sidebar) ---------- */
  let sessionsByCode = {};   // code -> that assessment's candidate sessions
  let activeApplicant = null;

  async function loadSessions() {
    const out = {};
    await Promise.all(mine.map(async function (a) {
      try { out[a.code] = await A.sessionsFor(a.code); } catch (e) { out[a.code] = []; }
    }));
    sessionsByCode = out;
  }

  // Everyone the company has added to any assessment (or who somehow has a session), one entry per email.
  function applicants() {
    const m = {};
    mine.forEach(function (a) {
      const ss = sessionsByCode[a.code] || [];
      const by = {};
      ss.forEach((x) => { by[x.email] = x; });
      a.candidates.concat(ss.map((x) => x.email).filter((e) => a.candidates.indexOf(e) === -1)).forEach(function (email) {
        const p = m[email] || (m[email] = { email: email, name: '', items: [] });
        if (by[email] && by[email].name) p.name = by[email].name;
        p.items.push({ a: a, s: by[email] || null });
      });
    });
    return Object.keys(m).map((k) => m[k]).sort((x, y) => (x.name || x.email).localeCompare(y.name || y.email));
  }
  const applicantState = (p) => p.items.some((i) => i.s && i.s.complete) ? 'done' : p.items.some((i) => i.s) ? 'progress' : 'invited';
  const STATE_LABEL = { done: 'Completed', progress: 'In progress', invited: 'Invited' };

  function renderSide() {
    const all = applicants();
    const q = $('sSearch').value.trim().toLowerCase();
    const shown = all.filter((p) => !q || (p.name + ' ' + p.email).toLowerCase().indexOf(q) !== -1);
    $('sCount').textContent = all.length ? '(' + all.length + ')' : '';
    const list = $('sList');
    list.replaceChildren();
    if (!shown.length) {
      list.appendChild(el('p', 'co-side-empty small', all.length ? 'No applicants match.' : 'No applicants yet. Add candidate emails to an assessment and they appear here.'));
    }
    shown.forEach(function (p) {
      const st = applicantState(p);
      const b = el('button', 'co-side-item' + (activeApplicant === p.email ? ' is-active' : ''));
      b.type = 'button';
      b.title = STATE_LABEL[st];
      const dot = el('span', 'co-dot co-dot-' + st); dot.setAttribute('aria-hidden', 'true');
      const t = el('span', 'co-side-name');
      t.append(el('strong', null, p.name || p.email), p.name ? el('span', 'small', p.email) : document.createTextNode(''));
      b.append(dot, t, el('span', 'co-side-state small', STATE_LABEL[st]));
      b.addEventListener('click', () => openApplicant(p.email));
      list.appendChild(b);
    });
  }
  $('sSearch').addEventListener('input', renderSide);
  $('sAssess').addEventListener('click', function () { activeApplicant = null; renderSide(); renderList(); show('cListView'); });

  function openApplicant(email) {
    activeApplicant = email;
    renderSide();
    const p = applicants().filter((x) => x.email === email)[0];
    show('cApplicantView');
    const list = $('aList');
    list.replaceChildren();
    if (!p) { $('aHeading').textContent = email; $('aSub').textContent = 'This applicant is no longer on any of your assessments.'; return; }
    $('aHeading').textContent = p.name || p.email;
    $('aSub').textContent = (p.name ? p.email + ' · ' : '') + p.items.length + (p.items.length === 1 ? ' assessment' : ' assessments');
    p.items.forEach(function (i) {
      const w = el('div', 'co-app-item');
      const h = el('div', 'co-app-head');
      const t = el('div');
      t.append(el('strong', null, i.a.title), el('span', 'co-sub', ' ' + i.a.role + ' · code ' + i.a.code));
      const go = el('button', 'btn btn-teal btn-sm', 'Open assessment'); go.type = 'button';
      go.addEventListener('click', () => openReview(i.a));
      h.append(t, go);
      w.append(h, candidateRow(i.a, p.email, i.s, async function () { await loadSessions(); renderSide(); openApplicant(p.email); }));
      list.appendChild(w);
    });
  }

  /* ---------- list ---------- */
  async function loadList() {
    show('cLoading');
    try { mine = await A.listMine(user.uid); }
    catch (e) { mine = []; $('cLoading').textContent = 'Could not load your pre-assessments. Check your connection and refresh.'; return; }
    renderList();
    show('cListView');
    await loadSessions();   // the applicants in the sidebar
    renderSide();
  }

  function copyBtn(code) {
    const b = el('button', 'btn btn-ghost btn-sm', 'Copy code');
    b.type = 'button';
    b.addEventListener('click', function () {
      (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(
        () => { b.textContent = 'Copied'; setTimeout(() => { b.textContent = 'Copy code'; }, 1500); },
        () => { b.textContent = code; });
    });
    return b;
  }

  function renderList() {
    const list = $('cList');
    list.replaceChildren();
    $('cEmpty').classList.toggle('hidden', mine.length > 0);
    mine.forEach(function (a) {
      const card = el('article', 'co-card');
      const head = el('div', 'co-card-head');
      const t = el('div');
      t.append(el('h2', 'co-card-title', a.title), el('p', 'co-sub', a.role + (a.company ? ' · ' + a.company : '')));
      head.append(t, el('span', 'co-codebadge mono', a.code));
      const meta = el('p', 'mono small co-meta',
        a.questions.length + (a.questions.length === 1 ? ' question' : ' questions') + ' · ' +
        a.candidates.length + (a.candidates.length === 1 ? ' candidate' : ' candidates') +
        (a.createdAt ? ' · created ' + fmtDate(a.createdAt) : ''));
      const actions = el('div', 'co-actions co-actions-left');
      const review = el('button', 'btn btn-teal btn-sm', 'Review sessions'); review.type = 'button';
      review.addEventListener('click', () => openReview(a));
      const edit = el('button', 'btn btn-ghost btn-sm', 'Edit'); edit.type = 'button';
      edit.addEventListener('click', () => openEditor(a));
      const del = el('button', 'btn btn-ghost btn-sm co-danger', 'Delete'); del.type = 'button';
      del.addEventListener('click', async function () {
        if (!confirm('Delete "' + a.title + '" (code ' + a.code + ') and all of its candidates\' sessions? This cannot be undone.')) return;
        del.disabled = true;
        try { await A.remove(a.code); loadList(); }
        catch (e) { del.disabled = false; alert('Could not delete it. Please try again.'); }
      });
      actions.append(review, edit, copyBtn(a.code), del);
      card.append(head, meta, actions);
      list.appendChild(card);
    });
  }

  /* ---------- editor ---------- */
  const form = $('eForm');

  function renderQs() {
    const ol = $('eQs');
    ol.replaceChildren();
    draftQs.forEach(function (q, i) {
      const li = el('li', 'co-q');
      const ta = el('textarea', 'co-input co-q-text');
      ta.rows = 2; ta.maxLength = 500; ta.value = q;
      ta.setAttribute('aria-label', 'Question ' + (i + 1));
      ta.addEventListener('input', () => { draftQs[i] = ta.value; });
      const tools = el('div', 'co-q-tools');
      const mk = (label, title, fn, disabled) => { const b = el('button', 'co-icon', label); b.type = 'button'; b.title = title; b.setAttribute('aria-label', title + ' (question ' + (i + 1) + ')'); b.disabled = !!disabled; b.addEventListener('click', fn); return b; };
      tools.append(
        mk('↑', 'Move up', () => { [draftQs[i - 1], draftQs[i]] = [draftQs[i], draftQs[i - 1]]; [draftLimits[i - 1], draftLimits[i]] = [draftLimits[i], draftLimits[i - 1]]; renderQs(); }, i === 0),
        mk('↓', 'Move down', () => { [draftQs[i + 1], draftQs[i]] = [draftQs[i], draftQs[i + 1]]; [draftLimits[i + 1], draftLimits[i]] = [draftLimits[i], draftLimits[i + 1]]; renderQs(); }, i === draftQs.length - 1),
        mk('✕', 'Remove', () => { draftQs.splice(i, 1); draftLimits.splice(i, 1); renderQs(); })
      );
      const time = timeSelect(draftLimits[i] || 0, 'Time to answer question ' + (i + 1));
      time.addEventListener('change', () => { draftLimits[i] = parseInt(time.value, 10) || 0; });
      const body = el('div', 'co-q-body');
      body.append(ta, time);
      li.append(el('span', 'mono small co-q-n', String(i + 1)), body, tools);
      ol.appendChild(li);
    });
    $('eCount').textContent = draftQs.length + ' / ' + MAX_Q;
    if (!draftQs.length) ol.appendChild(el('li', 'co-empty', 'No questions yet.'));
  }

  function addQuestions(list) {
    let added = 0;
    list.forEach(function (q) {
      q = String(q || '').trim();
      if (q && draftQs.length < MAX_Q && draftQs.indexOf(q) === -1) { draftQs.push(q); draftLimits.push(defaultLimit()); added++; }
    });
    renderQs();
    if (draftQs.length >= MAX_Q) $('eMsg').textContent = 'A pre-assessment can have up to ' + MAX_Q + ' questions.';
    return added;
  }

  function renderBank() {
    const role = $('eBankRole').value;
    const box = $('eBankList');
    box.replaceChildren();
    (BANK[role] || []).forEach(function (q, i) {
      const id = 'bank' + i;
      const row = el('label', 'co-check');
      row.htmlFor = id;
      const cb = el('input'); cb.type = 'checkbox'; cb.id = id; cb.value = q;
      if (draftQs.indexOf(q) !== -1) { cb.checked = true; cb.disabled = true; }
      row.append(cb, el('span', null, q));
      box.appendChild(row);
    });
  }

  function pickBankRole(role) {
    const sel = $('eBankRole');
    sel.value = BANK[role] ? role : 'General (behavioral)';
    renderBank();
  }

  function updateCandCount() {
    const p = A.parseEmails(form.elements.candidates.value);
    $('eCandCount').textContent = p.good.length ? String(p.good.length) : '';
  }

  function openEditor(a) {
    editing = a || null;
    $('eMsg').textContent = '';
    $('eHeading').textContent = a ? 'Edit pre-assessment' : 'New pre-assessment';
    const last = mine[0];
    form.elements.company.value = a ? a.company : (last ? last.company : '');
    form.elements.title.value = a ? a.title : '';
    form.elements.role.value = a ? a.role : '';
    form.elements.code.value = a ? a.code : A.randomCode();
    form.elements.code.readOnly = !!a;
    $('eGen').classList.toggle('hidden', !!a);
    $('eCodeHint').textContent = a ? 'The code cannot be changed after it is created.' : '4–20 letters, numbers or dashes. Candidates type this on the Pre-assessment page.';
    form.elements.candidates.value = a ? a.candidates.join('\n') : '';
    draftQs = a ? a.questions.slice() : [];
    draftLimits = draftQs.map((_, i) => (a && a.timeLimits && a.timeLimits[i]) || 0);
    const same = draftLimits.length && draftLimits.every((x) => x === draftLimits[0]);
    $('eDefaultTime').value = a ? (same ? String(draftLimits[0]) : (draftLimits.length ? 'mixed' : '120')) : '120';
    if (!a) draftLimits = draftQs.map(() => 120);
    $('eOwn').value = '';
    $('eBank').open = !a;
    renderQs();
    pickBankRole(a ? a.role : '');
    updateCandCount();
    show('cEditView');
  }

  $('cNew').addEventListener('click', () => openEditor(null));
  $('eGen').addEventListener('click', () => { form.elements.code.value = A.randomCode(); });
  form.elements.code.addEventListener('input', function () {
    const c = this.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (c !== this.value) this.value = c;
  });
  form.elements.role.addEventListener('change', function () { if (BANK[this.value.trim()]) pickBankRole(this.value.trim()); });
  form.elements.candidates.addEventListener('input', updateCandCount);
  $('eBankRole').addEventListener('change', renderBank);
  $('eAddOwn').addEventListener('click', function () {
    $('eMsg').textContent = '';
    if (addQuestions([$('eOwn').value])) $('eOwn').value = '';
    $('eOwn').focus();
  });
  $('eBankAdd').addEventListener('click', function () {
    $('eMsg').textContent = '';
    const picked = Array.from($('eBankList').querySelectorAll('input:checked:not(:disabled)')).map((c) => c.value);
    if (!picked.length) { $('eMsg').textContent = 'Tick the questions you want to add first.'; return; }
    addQuestions(picked);
    renderBank();
  });
  document.querySelectorAll('.co-back').forEach((b) => b.addEventListener('click', () => { renderList(); show('cListView'); }));

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const msg = $('eMsg');
    msg.textContent = '';
    const f = form.elements;
    const company = f.company.value.trim(), title = f.title.value.trim(), role = f.role.value.trim();
    const code = A.normCode(f.code.value);
    const kept = draftQs.map((q, i) => ({ q: q.trim(), t: draftLimits[i] || 0 })).filter((x) => x.q);
    const questions = kept.map((x) => x.q);
    const emails = A.parseEmails(f.candidates.value);
    if (!company) { msg.textContent = 'Enter your company name.'; f.company.focus(); return; }
    if (!title) { msg.textContent = 'Give the pre-assessment a title.'; f.title.focus(); return; }
    if (!role) { msg.textContent = 'Enter the role you are hiring for.'; f.role.focus(); return; }
    if (!A.CODE_RE.test(code)) { msg.textContent = 'The code must be 4–20 letters, numbers or dashes.'; f.code.focus(); return; }
    if (!questions.length) { msg.textContent = 'Add at least one question.'; return; }
    if (emails.bad.length) { msg.textContent = 'These do not look like emails: ' + emails.bad.slice(0, 5).join(', '); f.candidates.focus(); return; }
    if (!emails.good.length) { msg.textContent = 'Add at least one candidate email.'; f.candidates.focus(); return; }

    const data = {
      code: code, ownerUid: user.uid, ownerEmail: (user.email || '').toLowerCase(),
      company: company, title: title, role: role, questions: questions.slice(0, MAX_Q), timeLimits: kept.map((x) => x.t).slice(0, MAX_Q), candidates: emails.good.slice(0, 300),
      createdAt: editing ? editing.createdAt : Date.now(), updatedAt: Date.now()
    };
    $('eSave').disabled = true;
    try {
      if (editing) await A.update(data);
      else {
        if (mine.some((a) => a.code === code)) { msg.textContent = 'You already use this code. Pick another one.'; return; }
        await A.create(data);
      }
      await loadList();
    } catch (err) {
      msg.textContent = err && err.code === 'taken' ? 'That code is already taken. Click Generate for a new one.' : 'Could not save. Check your connection and try again.';
    } finally { $('eSave').disabled = false; }
  });

  /* ---------- review ---------- */
  function tile(label, value) {
    const d = el('div', 'iv-score');
    d.append(el('span', 'iv-score-n', String(value)), el('span', 'iv-score-l mono small', label));
    return d;
  }

  function answerBox(r) {
    const box = el('div', 'hist-answer');
    const g = G.ofResult(r);
    const head = el('div', 'co-ans-head');
    head.append(el('p', 'hist-q', r.q), el('strong', 'iv-chip grade-' + g, g));
    box.append(head, el('p', r.kind === 'code' ? 'hist-a hist-code' : 'hist-a', r.a));
    if (r.kind === 'code' && r.s && r.s.tests) box.appendChild(el('p', 'mono small hist-m', 'Tests passed ' + r.s.tests.passed + '/' + r.s.tests.total));
    if (r.feedback) {
      box.appendChild(el('p', 'hist-a', r.feedback));
      if (r.improve) box.appendChild(el('p', 'hist-a', 'To improve: ' + r.improve));
    } else {
      box.appendChild(el('p', 'mono small hist-m', 'Automatic score (no AI review)'));
    }
    return box;
  }

  // One candidate's row: status, grade, AI summary and every answer. s is their session, or null if they have not started.
  function candidateRow(a, email, s, onReset) {
    const d = el('details', 'hist-item');
    const sum = el('summary');
    const who = el('span');
    const status = !s ? 'Not started' : s.complete ? 'Completed ' + fmtDate(s.date) : 'In progress · ' + s.results.length + ' of ' + s.total + ' answered';
    who.append(el('strong', null, s && s.name ? s.name : email), el('span', 'co-sub', ' ' + (s && s.name ? email + ' · ' : '') + status));
    sum.appendChild(who);
    if (s && s.results && s.results.length) {
      const g = s.grade || G.overall(s.results);
      sum.appendChild(el('strong', 'iv-chip grade-' + g, g));
    }
    d.appendChild(sum);
    if (!s) {
      d.appendChild(el('p', 'hist-a hist-summary', 'This candidate has not started yet. Send them the code ' + a.code + ' and ask them to open the Pre-assessment page.'));
    } else {
      if (s.overall && s.overall.summary) d.appendChild(el('p', 'hist-a hist-summary', s.overall.summary));
      const lists = el('div', 'iv-twocol co-twocol');
      const mkList = (title, items) => { const w = el('div'); w.appendChild(el('h3', 'mono small iv-h', title)); const ul = el('ul', 'iv-bullets'); (items || []).forEach((t) => ul.appendChild(el('li', null, t))); w.appendChild(ul); return w; };
      if (s.overall && ((s.overall.strengths || []).length || (s.overall.focus || []).length)) {
        lists.append(mkList('Strengths', s.overall.strengths), mkList('Areas to improve', s.overall.focus));
        d.appendChild(lists);
      }
      (s.results || []).forEach((r) => d.appendChild(answerBox(r)));
      const actions = el('div', 'co-actions co-actions-left co-pad');
      const reset = el('button', 'btn btn-ghost btn-sm co-danger', 'Let them retake'); reset.type = 'button';
      reset.addEventListener('click', async function () {
        if (!confirm('Delete ' + email + '\'s answers so they can take the pre-assessment again?')) return;
        reset.disabled = true;
        try { await A.resetSession(a.code, s.uid); onReset(); }
        catch (e) { reset.disabled = false; alert('Could not reset it. Please try again.'); }
      });
      actions.appendChild(reset);
      d.appendChild(actions);
    }
    return d;
  }

  async function openReview(a) {
    show('cReviewView');
    $('rHeading').textContent = a.title;
    $('rSub').textContent = a.role + ' · code ' + a.code + ' · ' + a.questions.length + ' questions';
    $('rList').replaceChildren();
    $('rStats').replaceChildren();
    $('rLoading').classList.remove('hidden');
    $('rLoading').textContent = 'Loading sessions…';
    let sessions;
    try { sessions = await A.sessionsFor(a.code); }
    catch (e) { $('rLoading').textContent = 'Could not load sessions. Check your connection and try again.'; return; }
    $('rLoading').classList.add('hidden');
    sessionsByCode[a.code] = sessions; renderSide();

    const byEmail = {};
    sessions.forEach((s) => { byEmail[s.email] = s; });
    const emails = a.candidates.concat(sessions.map((s) => s.email).filter((e) => a.candidates.indexOf(e) === -1));
    const done = sessions.filter((s) => s.complete);
    $('rStats').append(
      tile('Invited', a.candidates.length),
      tile('Completed', done.length),
      tile('In progress', sessions.length - done.length),
      tile('Not started', a.candidates.filter((e) => !byEmail[e]).length)
    );

    // Completed first, best grade first; then in progress; then not started.
    const rank = (e) => { const s = byEmail[e]; return !s ? 0 : s.complete ? 100 + G.POINTS[s.grade || G.overall(s.results)] : 50; };
    emails.sort((x, y) => rank(y) - rank(x));

    emails.forEach((email) => $('rList').appendChild(candidateRow(a, email, byEmail[email], () => openReview(a))));
    if (!emails.length) $('rList').appendChild(el('p', 'co-empty', 'No candidates yet. Add their emails with Edit.'));
  }

  /* ---------- start ---------- */
  (function fillRoles() {
    const dl = $('eRoles'), sel = $('eBankRole');
    Object.keys(BANK).forEach(function (r) {
      if (r !== 'General (behavioral)') { const o = el('option'); o.value = r; dl.appendChild(o); }
      const o2 = el('option', null, r); o2.value = r; sel.appendChild(o2);
    });
  })();

  (function fillTimes() {
    const sel = $('eDefaultTime');
    TIMES.forEach(function (t) { const o = el('option', null, t[1]); o.value = String(t[0]); sel.appendChild(o); });
    const mixed = el('option', null, 'Different for each question'); mixed.value = 'mixed'; sel.appendChild(mixed);
    sel.value = '120';
    sel.addEventListener('change', function () { if (sel.value === 'mixed') return; draftLimits = draftQs.map(() => defaultLimit()); renderQs(); });
  })();

  $('cSwitch').addEventListener('click', function () {
    AIIC_AUTH.signOut().then(() => { window.location.href = 'company.html'; });
  });

  AIIC_AUTH.ready.then(function () {
    user = AIIC_AUTH.getUser();
    if (!user) return; // auth.js sends signed-out visitors to the company log in
    if (!A.isCompanyUser()) { show('cNotCompany'); return; }
    $('cWelcome').textContent = (user.name ? 'Welcome, ' + user.name.split(' ')[0] + '. ' : '') + 'Create a pre-assessment, give each candidate the code, and review their interviews here.';
    loadList();
  });
})();
