/* =========================================================
   AI Interview Chat — practice history for the signed-in user
   ========================================================= */
(function () {
  'use strict';

  const user = AIIC_STORE.getUser();
  if (!user) { window.location.replace('login.html'); return; }

  const $ = (id) => document.getElementById(id);
  $('hUser').textContent = user.name || user.email;

  const avg = (arr) => arr.length ? Math.round(arr.reduce((n, x) => n + x, 0) / arr.length) : 0;
  const sessionScore = (s) => avg(s.results.map((r) => r.s.overall));

  function tile(label, value) {
    const d = document.createElement('div'); d.className = 'iv-score';
    const n = document.createElement('span'); n.className = 'iv-score-n'; n.textContent = value;
    const l = document.createElement('span'); l.className = 'iv-score-l mono small'; l.textContent = label;
    d.append(n, l);
    return d;
  }

  function render() {
    const sessions = AIIC_STORE.getHistory(user.email).filter((s) => s.results && s.results.length).sort((a, b) => b.date - a.date);
    const list = $('hList');
    list.replaceChildren();
    $('hEmpty').classList.toggle('hidden', sessions.length > 0);
    $('hClear').classList.toggle('hidden', sessions.length === 0);

    const scores = sessions.map(sessionScore);
    $('hStats').replaceChildren(
      tile('Sessions', sessions.length),
      tile('Average', avg(scores)),
      tile('Best', scores.length ? Math.max.apply(null, scores) : 0),
      tile('Answers', sessions.reduce((n, s) => n + s.results.length, 0))
    );
    $('hStats').classList.toggle('hidden', sessions.length === 0);

    sessions.forEach(function (s) {
      const d = document.createElement('details'); d.className = 'hist-item';
      const sum = document.createElement('summary');
      const title = document.createElement('span');
      title.textContent = s.role + ' · ' + new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + (s.complete ? '' : ' · unfinished');
      const sc = document.createElement('strong'); sc.className = 'mono'; sc.textContent = sessionScore(s);
      sum.append(title, sc);
      d.appendChild(sum);

      s.results.forEach(function (r) {
        const box = document.createElement('div'); box.className = 'hist-answer';
        const q = document.createElement('p'); q.className = 'hist-q'; q.textContent = r.q;
        const a = document.createElement('p'); a.className = 'hist-a'; a.textContent = r.a;
        const m = document.createElement('p'); m.className = 'mono small hist-m';
        m.textContent = 'Overall ' + r.s.overall + ' · Structure ' + r.s.structure + ' · Clarity ' + r.s.clarity + ' · Impact ' + r.s.impact;
        box.append(q, a, m);
        d.appendChild(box);
      });
      list.appendChild(d);
    });
  }

  $('hClear').addEventListener('click', function () {
    if (confirm('Delete all your saved practice history in this browser? This cannot be undone.')) {
      AIIC_STORE.clearHistory(user.email);
      render();
    }
  });

  render();
})();
