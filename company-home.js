/* =========================================================
   AI Interview Chat — company dashboard (after a Microsoft or Google log in)
   - create pre-assessments: the questions and the candidate emails; each candidate gets their own code
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
  let codes = {};       // assessmentId -> { candidate email -> personal code }
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

  const VIEWS = ['cLoading', 'cNotCompany', 'cDashView', 'cListView', 'cPartView', 'cEditView', 'cReviewView', 'cApplicantView'];
  const NAV_OF = { cDashView: 'dash', cListView: 'interviews', cEditView: 'create', cReviewView: 'interviews', cApplicantView: 'participants' };
  let partMode = 'participants'; // what the Participants page shows: everyone, or only people with results
  let backTo = 'cDashView';      // where Back / Cancel returns to
  const MAIN_VIEWS = ['cDashView', 'cListView', 'cPartView'];

  function show(id) {
    VIEWS.forEach((v) => $(v).classList.toggle('hidden', v !== id));
    const inShell = id !== 'cLoading' && id !== 'cNotCompany';
    $('caShell').classList.toggle('hidden', !inShell);
    $('caTopNav').classList.toggle('hidden', !inShell);
    $('caUser').classList.toggle('hidden', id === 'cLoading');
    if (MAIN_VIEWS.indexOf(id) !== -1) backTo = id;
    const key = id === 'cPartView' ? partMode : NAV_OF[id];
    document.querySelectorAll('[data-nav]').forEach((b) => b.classList.toggle('is-active', b.dataset.nav === key));
    window.scrollTo(0, 0);
  }

  /* ---------- small helpers ---------- */
  const SVG_NS = 'http://www.w3.org/2000/svg';
  function svg(paths) {
    const s = document.createElementNS(SVG_NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    paths.forEach((d) => { const p = document.createElementNS(SVG_NS, 'path'); p.setAttribute('d', d); s.appendChild(p); });
    return s;
  }
  const ICON = {
    people: ['M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5', 'M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M16 4.8a3.4 3.4 0 0 1 0 6.4', 'M18 14.8c2 .6 3.3 2.4 3.6 5.2'],
    check: ['M5 12.5l4.5 4.5L19 7.5'],
    bars: ['M5 20V10M12 20V4M19 20v-7'],
    clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'],
    laptop: ['M5 5h14a1 1 0 0 1 1 1v9H4V6a1 1 0 0 1 1-1z', 'M2 19h20'],
    health: ['M6 3v6a4 4 0 0 0 8 0V3', 'M10 13v2a4 4 0 0 0 8 0v-1', 'M18 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
    brief: ['M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z', 'M9 8V5h6v3', 'M4 13h16'],
    question: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7', 'M12 17v.5']
  };
  function icon(name, cls) { const s = svg(ICON[name]); if (cls) s.setAttribute('class', cls); return s; }
  const roleIcon = (role) => /nurs|doctor|physician|therap|pharma|medical|dental|health|vet|paramedic/i.test(role) ? 'health' : /engineer|develop|software|data|\bit\b|tech|cyber|cloud|devops|machine|\bai\b/i.test(role) ? 'laptop' : 'brief';
  const initials = (s) => String(s || '?').replace(/@.*/, '').split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
  const tsMs = (t) => (t && typeof t.toMillis === 'function') ? t.toMillis() : (typeof t === 'number' ? t : 0);
  const fmtDateTime = (ms) => new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + '\n' + new Date(ms).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const BAND = { A: 95, B: 85, C: 75, D: 65, F: 45 }; // a letter grade's usual percent band
  const scoreOf = (s) => (s && s.results && s.results.length) ? Math.round(s.results.reduce((n, r) => n + BAND[G.ofResult(r)], 0) / s.results.length) : null;
  const doneAt = (s) => tsMs(s.finishedAt) || s.date || 0;
  const minutesOf = (s) => (s && s.complete && s.finishedAt && s.date) ? (tsMs(s.finishedAt) - s.date) / 60000 : null;
  const avg = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;

  /* ---------- data: people, per interview ---------- */
  let sessionsByCode = {};   // assessment id -> that interview's candidate sessions
  async function loadSessions() {
    const out = {};
    await Promise.all(mine.map(async function (a) {
      try { out[a.code] = await A.sessionsFor(a.code); } catch (e) { out[a.code] = []; }
    }));
    sessionsByCode = out;
  }

  const codeFor = (a, email) => (codes[a.code] || {})[email] || '';

  // One row for every (interview, person): everyone invited, plus anyone who somehow has a session.
  function rows() {
    const out = [];
    mine.forEach(function (a) {
      const ss = sessionsByCode[a.code] || [];
      const by = {};
      ss.forEach((x) => { by[x.email] = x; });
      a.candidates.concat(ss.map((x) => x.email).filter((e) => a.candidates.indexOf(e) === -1)).forEach(function (email) {
        out.push({ a: a, email: email, s: by[email] || null, code: codeFor(a, email) });
      });
    });
    return out;
  }
  const stateOf = (r) => r.s ? (r.s.complete ? 'done' : 'progress') : 'invited';
  const STATE_LABEL = { done: 'Completed', progress: 'In Progress', invited: 'Invited' };
  const nameOf = (r) => (r.s && r.s.name) || r.email.split('@')[0];

  // Everyone the company has added to any assessment, one entry per email (for the per-person page).
  function applicants() {
    const m = {};
    rows().forEach(function (r) {
      const p = m[r.email] || (m[r.email] = { email: r.email, name: '', items: [] });
      if (r.s && r.s.name) p.name = r.s.name;
      p.items.push({ a: r.a, s: r.s });
    });
    return Object.keys(m).map((k) => m[k]).sort((x, y) => (x.name || x.email).localeCompare(y.name || y.email));
  }

  /* ---------- the Overview numbers ---------- */
  function periodStats(from, to) {
    const emails = new Set(), done = [];
    mine.forEach((a) => { if ((a.createdAt || 0) >= from && (a.createdAt || 0) < to) a.candidates.forEach((e) => emails.add(e)); });
    rows().forEach(function (r) {
      if (!r.s) return;
      if (r.s.date >= from && r.s.date < to) emails.add(r.email);
      if (r.s.complete && doneAt(r.s) >= from && doneAt(r.s) < to) done.push(r.s);
    });
    return { participants: emails.size, completed: done.length, score: avg(done.map(scoreOf).filter((n) => n != null)), time: avg(done.map(minutesOf).filter((n) => n != null && n > 0)) };
  }
  function renderStats() {
    const days = parseInt($('dRange').value, 10) || 0;
    const now = Date.now(), span = days * 86400000;
    const cur = periodStats(days ? now - span : 0, now + 1);
    const prev = days ? periodStats(now - 2 * span, now - span) : null;
    const cards = [
      { ic: 'people', n: String(cur.participants), l: 'Total Participants', v: cur.participants, p: prev && prev.participants, lowerIsBetter: false },
      { ic: 'check', n: String(cur.completed), l: 'Completed Interviews', v: cur.completed, p: prev && prev.completed, lowerIsBetter: false },
      { ic: 'bars', n: cur.score == null ? '—' : Math.round(cur.score) + '%', l: 'Avg. Score', v: cur.score, p: prev && prev.score, lowerIsBetter: false },
      { ic: 'clock', n: cur.time == null ? '—' : (Math.round(cur.time * 10) / 10) + ' min', l: 'Avg. Interview Time', v: cur.time, p: prev && prev.time, lowerIsBetter: true }
    ];
    const host = $('dStats');
    host.replaceChildren();
    cards.forEach(function (c) {
      const card = el('div', 'ca-stat');
      const ic = el('div', 'ca-stat-ic'); ic.appendChild(icon(c.ic));
      const body = el('div', 'ca-stat-body');
      body.append(el('div', 'ca-stat-n', c.n), el('div', 'ca-stat-l', c.l));
      card.append(ic, body);
      if (c.v != null && c.p) {
        const pct = Math.round((c.v - c.p) / c.p * 100);
        if (pct !== 0) {
          const good = c.lowerIsBetter ? pct < 0 : pct > 0;
          card.appendChild(el('span', 'ca-delta' + (good ? '' : ' is-bad'), (pct > 0 ? '↑ +' : '↓ ') + pct + '%'));
        }
      }
      host.appendChild(card);
    });
  }

  /* ---------- pop-up menu (the ⋯ buttons) ---------- */
  let openMenu = null;
  function closeMenu() { if (openMenu) { openMenu.remove(); openMenu = null; } }
  document.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  function popMenu(anchor, host, items) {
    closeMenu();
    const m = el('div', 'ca-menu'); m.setAttribute('role', 'menu');
    const r = anchor.getBoundingClientRect();
    m.style.top = (r.bottom + 6) + 'px';
    m.style.left = Math.max(8, Math.min(window.innerWidth - 184, r.right - 168)) + 'px';
    items.forEach(function (it) {
      const b = el('button', it.danger ? 'is-danger' : '', it.label); b.type = 'button'; b.setAttribute('role', 'menuitem');
      b.addEventListener('click', function (e) { e.stopPropagation(); closeMenu(); it.run(); });
      m.appendChild(b);
    });
    m.addEventListener('click', (e) => e.stopPropagation());
    document.body.appendChild(m);
    openMenu = m;
  }

  /* ---------- interview cards ---------- */
  async function deleteInterview(a) {
    if (!confirm('Delete "' + a.title + '" and all of its candidates\' sessions? This cannot be undone.')) return;
    try { await A.remove(a.code); await refresh(); }
    catch (e) { alert('Could not delete it. Please try again.'); }
  }

  function interviewCard(a) {
    const card = el('article', 'ca-icard');
    card.tabIndex = 0; card.setAttribute('role', 'button'); card.setAttribute('aria-label', 'Open ' + a.title);
    const top = el('div', 'ca-icard-top');
    const ic = el('div', 'ca-icard-ic'); ic.appendChild(icon(roleIcon(a.role)));
    const t = el('div');
    const pills = el('div', 'ca-pills');
    pills.append(el('span', 'ca-pill', a.role), el('span', 'ca-pill is-active', 'Active'));
    t.append(el('h3', null, a.title), pills);
    top.append(ic, t);
    const meta = el('div', 'ca-icard-meta');
    const q = el('span'); q.append(icon('question'), document.createTextNode(a.questions.length + (a.questions.length === 1 ? ' Question' : ' Questions')));
    const pn = el('span'); pn.append(icon('people'), document.createTextNode(a.candidates.length + (a.candidates.length === 1 ? ' Participant' : ' Participants')));
    meta.append(q, pn);
    const kebab = el('button', 'ca-kebab', '⋮'); kebab.type = 'button'; kebab.setAttribute('aria-label', 'More actions for ' + a.title); kebab.setAttribute('aria-haspopup', 'menu');
    kebab.addEventListener('click', function (e) {
      e.stopPropagation();
      popMenu(kebab, card, [
        { label: 'View participants', run: () => openReview(a) },
        { label: 'Edit interview', run: () => openEditor(a) },
        { label: 'Delete', danger: true, run: () => deleteInterview(a) }
      ]);
    });
    card.append(top, meta, el('p', 'ca-icard-date', 'Last updated: ' + fmtDate(a.updatedAt || a.createdAt || Date.now())), kebab);
    card.addEventListener('click', () => openReview(a));
    card.addEventListener('keydown', (e) => { if (e.target === card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openReview(a); } });
    return card;
  }

  function renderList() {
    const ordered = mine.slice();
    $('cEmpty').classList.toggle('hidden', mine.length > 0);
    $('dInterviews').replaceChildren.apply($('dInterviews'), ordered.slice(0, 2).map(interviewCard));
    $('cList').replaceChildren.apply($('cList'), ordered.length ? ordered.map(interviewCard) : [el('p', 'ca-empty', 'You have no interviews yet. Click “Create Interview” to make your first one.')]);
    $('dViewAll').classList.toggle('hidden', mine.length <= 2);
    const sel = $('dSendInterview'), keep = sel.value;
    sel.replaceChildren();
    mine.forEach((a) => { const o = el('option', null, a.title + ' — ' + a.role); o.value = a.code; sel.appendChild(o); });
    if (keep && mine.some((a) => a.code === keep)) sel.value = keep;
    $('dSendGo').disabled = !mine.length;
  }

  /* ---------- participant results table ---------- */
  function copyBtn(code, label) {
    const b = el('button', 'ca-tiny', label || 'Copy code');
    b.type = 'button';
    b.addEventListener('click', function () {
      (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(
        () => { b.textContent = 'Copied'; setTimeout(() => { b.textContent = label || 'Copy code'; }, 1500); },
        () => { b.textContent = code; });
    });
    return b;
  }
  const copyText = (code, anchor) => {
    (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(() => {}, () => { window.prompt('Copy this code:', code); });
  };

  function filteredRows(query, status, onlyResults) {
    const q = String(query || '').trim().toLowerCase();
    let list = rows().filter((r) => (!onlyResults || r.s) && (!status || stateOf(r) === status) &&
      (!q || (nameOf(r) + ' ' + r.email + ' ' + r.code + ' ' + r.a.title).toLowerCase().indexOf(q) !== -1));
    const rank = (r) => stateOf(r) === 'done' ? 3 : stateOf(r) === 'progress' ? 2 : 1;
    list.sort((x, y) => onlyResults
      ? ((scoreOf(y.s) || 0) - (scoreOf(x.s) || 0))
      : (rank(y) - rank(x)) || ((y.s ? doneAt(y.s) : y.a.createdAt || 0) - (x.s ? doneAt(x.s) : x.a.createdAt || 0)));
    return list;
  }

  function buildTable(host, list, empty) {
    host.replaceChildren();
    if (!list.length) { host.appendChild(el('p', 'ca-empty', empty)); return; }
    const table = el('table', 'ca-table');
    const hr = el('tr');
    ['Participant', 'Interview', 'Code', 'Status', 'Score', 'Completed', 'Actions'].forEach((h) => hr.appendChild(el('th', null, h)));
    const thead = el('thead'); thead.appendChild(hr); table.appendChild(thead);
    const tb = el('tbody');
    list.forEach(function (r) {
      const st = stateOf(r), tr = el('tr');
      const who = el('button', 'ca-who'); who.type = 'button';
      const av = el('span', 'ca-avatar', initials(nameOf(r)));
      const nm = el('span'); nm.append(el('strong', null, nameOf(r)), el('span', 'ca-em', r.email));
      who.append(av, nm);
      who.addEventListener('click', () => openApplicant(r.email, r.a.code));
      const c1 = el('td'); c1.appendChild(who);
      const c2 = el('td', null, r.a.title);
      const c3 = el('td'); c3.appendChild(r.code ? el('span', 'ca-code', r.code) : el('span', 'ca-date', '—'));
      const c4 = el('td'); c4.appendChild(el('span', 'ca-status is-' + st, STATE_LABEL[st]));
      const sc = r.s ? scoreOf(r.s) : null;
      const c5 = el('td'); c5.appendChild(el('span', 'ca-score', st === 'done' && sc != null ? sc + '%' : '—'));
      const c6 = el('td'); const when = st === 'done' ? fmtDateTime(doneAt(r.s)).split('\n') : null;
      if (when) { const d = el('div', 'ca-date'); d.append(document.createTextNode(when[0]), document.createElement('br'), document.createTextNode(when[1])); c6.appendChild(d); } else c6.appendChild(el('span', 'ca-date', '—'));
      const act = el('div', 'ca-act');
      const rv = el('button', 'ca-review', st === 'done' ? 'Review' : 'View'); rv.type = 'button';
      rv.addEventListener('click', () => openApplicant(r.email, r.a.code));
      const more = el('button', 'ca-more', '⋯'); more.type = 'button'; more.setAttribute('aria-label', 'More actions for ' + r.email); more.setAttribute('aria-haspopup', 'menu');
      more.addEventListener('click', function (e) {
        e.stopPropagation();
        const items = [];
        if (r.code) items.push({ label: 'Copy code', run: () => copyText(r.code) });
        items.push({ label: 'Open interview', run: () => openReview(r.a) });
        if (r.s) items.push({ label: 'Let them retake', danger: true, run: async function () {
          if (!confirm('Delete ' + r.email + '\'s answers so they can take this interview again?')) return;
          try { await A.resetSession(r.a.code, r.s.uid); await refresh(); } catch (err) { alert('Could not reset it. Please try again.'); }
        } });
        popMenu(more, act, items);
      });
      act.append(rv, more);
      const c7 = el('td'); c7.appendChild(act);
      tr.append(c1, c2, c3, c4, c5, c6, c7);
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    host.appendChild(table);
  }

  const DASH_ROWS = 5;
  function renderDashTable() {
    const list = filteredRows($('dSearch').value, $('dFilter').value, false);
    buildTable($('dTable'), list.slice(0, DASH_ROWS), rows().length ? 'No participants match.' : 'No participants yet. Add an applicant with “Send Interview to Participant”.');
    $('dTableAll').classList.toggle('hidden', list.length <= DASH_ROWS);
  }
  function renderParticipants() {
    const onlyResults = partMode === 'results';
    $('pTitle').textContent = onlyResults ? 'Results & Reviews' : 'Participants';
    $('pSub').textContent = onlyResults ? 'Everyone who has started an interview, best scores first.' : 'Everyone you have invited, across all of your interviews.';
    const list = filteredRows($('pSearch').value, $('pFilter').value, onlyResults);
    buildTable($('pTable'), list, onlyResults ? 'No results yet. They appear here as participants start their interviews.' : 'No participants yet.');
  }

  // Redraws everything that depends on the interviews, codes and sessions.
  function renderAll() {
    renderStats(); renderList(); renderDashTable(); renderParticipants();
    $('caCompany').textContent = (mine[0] && mine[0].company) || (user && user.name ? user.name + '\'s company' : 'Your company');
  }
  const renderSide = renderAll; // older call sites

  $('dRange').addEventListener('change', renderStats);
  $('dSearch').addEventListener('input', renderDashTable);
  $('dFilter').addEventListener('change', renderDashTable);
  $('pSearch').addEventListener('input', renderParticipants);
  $('pFilter').addEventListener('change', renderParticipants);

  /* ---------- navigation ---------- */
  function go(key) {
    if (key === 'dash') show('cDashView');
    else if (key === 'interviews') show('cListView');
    else if (key === 'create') openEditor(null);
    else if (key === 'participants' || key === 'results') { partMode = key; renderParticipants(); show('cPartView'); }
  }
  document.querySelectorAll('[data-nav]').forEach((b) => b.addEventListener('click', () => go(b.dataset.nav)));
  $('dViewAll').addEventListener('click', () => go('interviews'));
  $('dTableAll').addEventListener('click', () => go('participants'));
  $('cNew2').addEventListener('click', () => openEditor(null));
  $('dCreateManual').addEventListener('click', () => openEditor(null));
  $('dCreateAI').addEventListener('click', () => openEditor(null, true));

  /* ---------- one person, across all interviews ---------- */
  function openApplicant(email, focusCode) {
    const p = applicants().filter((x) => x.email === email)[0];
    show('cApplicantView');
    const list = $('aList');
    list.replaceChildren();
    if (!p) { $('aHeading').textContent = email; $('aSub').textContent = 'This applicant is no longer on any of your interviews.'; return; }
    $('aHeading').textContent = p.name || p.email;
    $('aSub').textContent = (p.name ? p.email + ' · ' : '') + p.items.length + (p.items.length === 1 ? ' interview' : ' interviews');
    p.items.forEach(function (i) {
      const w = el('div', 'co-app-item');
      const h = el('div', 'co-app-head');
      const t = el('div');
      t.append(el('strong', null, i.a.title), el('span', 'co-sub', ' ' + i.a.role));
      const go2 = el('button', 'btn btn-teal btn-sm', 'Open interview'); go2.type = 'button';
      go2.addEventListener('click', () => openReview(i.a));
      h.append(t, go2);
      const row = candidateRow(i.a, p.email, i.s, async function () { await refresh(); openApplicant(p.email, focusCode); });
      if (focusCode && i.a.code === focusCode) row.open = true;
      w.append(h, row);
      list.appendChild(w);
    });
  }

  /* ---------- loading ---------- */
  // Fetches everything again without showing the loading screen.
  async function refresh() {
    mine = await A.listMine(user.uid);
    try { codes = await A.listCodes(user.uid); } catch (e) { codes = {}; }
    await loadSessions();
    renderAll();
  }
  async function loadList(target) {
    show('cLoading');
    try { mine = await A.listMine(user.uid); }
    catch (e) { mine = []; $('cLoading').textContent = 'Could not load your interviews. Check your connection and refresh.'; return; }
    try { codes = await A.listCodes(user.uid); } catch (e) { codes = {}; }
    renderAll();
    show(target || 'cDashView');
    await loadSessions();   // the participants, scores and stats
    renderAll();
  }

  /* ---------- send an interview to one participant ---------- */
  const newInviteCode = () => { $('dSendCode').value = A.randomCode(); };
  $('dSendNewCode').addEventListener('click', newInviteCode);
  newInviteCode();
  $('dSend').addEventListener('submit', async function (e) {
    e.preventDefault();
    const msg = $('dSendMsg');
    msg.className = 'ca-msg'; msg.textContent = '';
    const a = mine.filter((x) => x.code === $('dSendInterview').value)[0];
    if (!a) { msg.textContent = 'Create an interview first.'; return; }
    const p = A.parseEmails($('dSendEmail').value);
    if (p.bad.length || p.good.length !== 1) { msg.textContent = 'Enter one valid email address.'; $('dSendEmail').focus(); return; }
    const email = p.good[0];
    if (a.candidates.indexOf(email) !== -1) {
      msg.append(document.createTextNode(email + ' is already invited to this interview. Their code: '), el('code', null, codeFor(a, email) || '(none yet)'));
      return;
    }
    if (a.candidates.length >= 300) { msg.textContent = 'This interview already has 300 participants.'; return; }
    $('dSendGo').disabled = true;
    try {
      const data = Object.assign({}, a, { candidates: a.candidates.concat(email), updatedAt: Date.now() });
      const preset = {}; preset[email] = $('dSendCode').value;
      await A.update(data);
      const have = await A.syncCodes(data, user.uid, codes[a.code], preset);
      await refresh();
      msg.className = 'ca-msg is-ok';
      msg.append(document.createTextNode('Invitation created for ' + email + '. Their code: '), el('code', null, have[email] || ''), document.createTextNode(' '), copyBtn(have[email] || '', 'Copy'));
      $('dSendEmail').value = '';
      newInviteCode();
    } catch (err) {
      msg.textContent = 'Could not create the invitation. Check your connection and try again.';
    } finally { $('dSendGo').disabled = !mine.length; }
  });

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

  function openEditor(a, ai) {
    editing = a || null;
    $('eMsg').textContent = '';
    $('eHeading').textContent = a ? 'Edit interview' : 'New interview';
    const last = mine[0];
    form.elements.company.value = a ? a.company : (last ? last.company : '');
    form.elements.title.value = a ? a.title : '';
    form.elements.role.value = a ? a.role : '';
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
    $('eAiText').value = ''; $('eAiMsg').textContent = '';
    $('eAi').open = !!ai;
    show('cEditView');
    if (ai) $('eAiText').focus();
  }
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
  $('eAiGo').addEventListener('click', async function () {
    const msg = $('eAiMsg'), btn = this;
    msg.textContent = '';
    const text = $('eAiText').value.trim();
    const role = form.elements.role.value.trim();
    if (!text && !role) { msg.textContent = 'Describe the role, skills, or paste a job description first (or fill in the Role above).'; $('eAiText').focus(); return; }
    if (!window.AIIC_AUTH || !AIIC_AUTH.auth || !AIIC_AUTH.auth.currentUser) { msg.textContent = 'Please log in again.'; return; }
    btn.disabled = true; btn.textContent = 'Generating…';
    try {
      const token = await AIIC_AUTH.auth.currentUser.getIdToken();
      const res = await fetch('/api/interviewer', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Firebase-Token': token },
        body: JSON.stringify({ mode: 'generate', role: role, description: text, count: parseInt($('eAiCount').value, 10) || 8 })
      });
      if (res.status === 429) { msg.textContent = 'You have reached today\'s AI limit. It resets tomorrow.'; return; }
      if (!res.ok) { msg.textContent = 'The AI could not generate questions right now (' + res.status + '). Please try again, or add questions manually.'; return; }
      const out = await res.json();
      const qs = Array.isArray(out.questions) ? out.questions : [];
      if (!qs.length) { msg.textContent = 'The AI did not return any questions. Try describing the role in more detail.'; return; }
      addQuestions(qs);
      msg.textContent = 'Added ' + qs.length + ' questions below. Edit, reorder or remove any of them.';
    } catch (e) { msg.textContent = 'Could not reach the AI. Check your connection and try again.'; }
    finally { btn.disabled = false; btn.textContent = 'Generate questions'; }
  });
  document.querySelectorAll('.co-back').forEach((b) => b.addEventListener('click', () => { show(backTo); }));

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const msg = $('eMsg');
    msg.textContent = '';
    const f = form.elements;
    const company = f.company.value.trim(), title = f.title.value.trim(), role = f.role.value.trim();
    const kept = draftQs.map((q, i) => ({ q: q.trim(), t: draftLimits[i] || 0 })).filter((x) => x.q);
    const questions = kept.map((x) => x.q);
    const emails = A.parseEmails(f.candidates.value);
    if (!company) { msg.textContent = 'Enter your company name.'; f.company.focus(); return; }
    if (!title) { msg.textContent = 'Give the pre-assessment a title.'; f.title.focus(); return; }
    if (!role) { msg.textContent = 'Enter the role you are hiring for.'; f.role.focus(); return; }
    if (!questions.length) { msg.textContent = 'Add at least one question.'; return; }
    if (emails.bad.length) { msg.textContent = 'These do not look like emails: ' + emails.bad.slice(0, 5).join(', '); f.candidates.focus(); return; }
    if (!emails.good.length) { msg.textContent = 'Add at least one candidate email.'; f.candidates.focus(); return; }

    const data = {
      code: editing ? editing.code : A.newId(), ownerUid: user.uid, ownerEmail: (user.email || '').toLowerCase(),
      company: company, title: title, role: role, questions: questions.slice(0, MAX_Q), timeLimits: kept.map((x) => x.t).slice(0, MAX_Q), candidates: emails.good.slice(0, 300),
      createdAt: editing ? editing.createdAt : Date.now(), updatedAt: Date.now()
    };
    $('eSave').disabled = true;
    try {
      if (editing) await A.update(data);
      else await A.create(data);
      // Every candidate gets their own personal code.
      await A.syncCodes(data, user.uid, codes[data.code]);
      await loadList('cListView');
    } catch (err) {
      msg.textContent = 'Could not save. Check your connection and try again.';
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
    // This candidate's own code, to send to them.
    const myCode = codeFor(a, email);
    const codeLine = el('div', 'co-actions co-actions-left co-pad');
    if (myCode) codeLine.append(el('span', 'co-codebadge mono', myCode), copyBtn(myCode));
    else codeLine.appendChild(el('span', 'small co-hint', 'No code yet. Click Edit, then Save, to create one.'));
    d.appendChild(codeLine);
    if (!s) {
      d.appendChild(el('p', 'hist-a hist-summary', 'This candidate has not started yet. Send them their code and ask them to open the Pre-assessment page.'));
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
    $('rSub').textContent = a.role + ' · ' + a.questions.length + ' questions';
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
    AIIC_AUTH.signOut().then(() => { window.location.href = '/company'; });
  });

  AIIC_AUTH.ready.then(function () {
    user = AIIC_AUTH.getUser();
    if (!user) return; // auth.js sends signed-out visitors to the company log in
    if (!A.isCompanyUser()) { show('cNotCompany'); return; }
    $('dName').textContent = (user.name || '').split(' ')[0] || 'there';
    $('caUserName').textContent = user.name || user.email || '';
    loadList('cDashView');
  });
})();
