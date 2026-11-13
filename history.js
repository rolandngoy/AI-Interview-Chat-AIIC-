/* =========================================================
   AI Interview Chat — practice history for the signed-in user
   ========================================================= */
(function () {
  'use strict';

  const user = AIIC_STORE.getUser();
  if (!user) { window.location.replace('login.html'); return; }

  const $ = (id) => document.getElementById(id);

  const avg = (arr) => arr.length ? Math.round(arr.reduce((n, x) => n + x, 0) / arr.length) : 0;
  const sessionScore = (s) => avg(s.results.map((r) => r.s.overall));
  const G = window.AIIC_GRADES;
  const sessionGrade = (s) => s.grade || G.overall(s.results);

  function tile(label, value) {
    const d = document.createElement('div'); d.className = 'iv-score';
    const n = document.createElement('span'); n.className = 'iv-score-n'; n.textContent = value;
    const l = document.createElement('span'); l.className = 'iv-score-l mono small'; l.textContent = label;
    d.append(n, l);
    return d;
  }

  async function render() {
    $('hLoading').classList.remove('hidden');
    const all = await AIIC_STORE.getHistory(user);
    $('hLoading').classList.add('hidden');
    const sessions = all.filter((s) => s.results && s.results.length).sort((a, b) => b.date - a.date);
    const list = $('hList');
    list.replaceChildren();
    $('hEmpty').classList.toggle('hidden', sessions.length > 0);
    $('hClear').classList.toggle('hidden', sessions.length === 0);

    const scores = sessions.map(sessionScore);
    $('hStats').replaceChildren(
      tile('Sessions', sessions.length),
      tile('Average grade', sessions.length ? G.overall([].concat.apply([], sessions.map((s) => s.results))) : '–'),
      tile('Best grade', sessions.length ? sessions.map(sessionGrade).sort((a, b) => G.POINTS[b] - G.POINTS[a])[0] : '–'),
      tile('Answers', sessions.reduce((n, s) => n + s.results.length, 0))
    );
    $('hStats').classList.toggle('hidden', sessions.length === 0);

    sessions.forEach(function (s) {
      const d = document.createElement('details'); d.className = 'hist-item';
      const sum = document.createElement('summary');
      const title = document.createElement('span');
      title.textContent = s.role + ' · ' + new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + (s.complete ? '' : ' · unfinished');
      const sc = document.createElement('strong'); sc.className = 'iv-chip grade-' + sessionGrade(s); sc.textContent = sessionGrade(s);
      sum.append(title, sc);
      d.appendChild(sum);

      if (s.overall && s.overall.summary) {
        const o = document.createElement('p'); o.className = 'hist-a hist-summary'; o.textContent = s.overall.summary;
        d.appendChild(o);
      }
      s.results.forEach(function (r) {
        const box = document.createElement('div'); box.className = 'hist-answer';
        const q = document.createElement('p'); q.className = 'hist-q'; q.textContent = r.q;
        const a = document.createElement('p'); a.className = r.kind === 'code' ? 'hist-a hist-code' : 'hist-a'; a.textContent = r.a;
        const m = document.createElement('p'); m.className = 'mono small hist-m';
        const g = G.ofResult(r);
        m.textContent = 'Grade ' + g + (r.kind === 'code' ? ' · Tests passed ' + r.s.tests.passed + '/' + r.s.tests.total : '');
        box.append(q, a, m);
        if (r.feedback) {
          const f = document.createElement('p'); f.className = 'hist-a'; f.textContent = r.feedback; box.appendChild(f);
          if (r.improve) { const im = document.createElement('p'); im.className = 'hist-a'; im.textContent = 'To improve: ' + r.improve; box.appendChild(im); }
          if (r.better) { const b = document.createElement('p'); b.className = 'hist-a hist-better'; b.textContent = 'A stronger answer: ' + r.better; box.appendChild(b); }
        }
        d.appendChild(box);
      });
      list.appendChild(d);
    });
  }

  $('hClear').addEventListener('click', async function () {
    if (confirm('Delete all your saved practice history? This cannot be undone.')) {
      await AIIC_STORE.clearHistory(user);
      render();
    }
  });

  render();
})();
