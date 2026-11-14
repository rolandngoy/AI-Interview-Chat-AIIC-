/* =========================================================
   AI Interview Chat — admin page: every account that has signed up or logged in.
   The server checks the admin email; this page just displays what it is allowed to return.
   ========================================================= */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  let users = [];

  const fmt = (t) => t ? new Date(t).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '–';
  function tile(label, value) {
    const d = document.createElement('div'); d.className = 'iv-score';
    const n = document.createElement('span'); n.className = 'iv-score-n'; n.textContent = value;
    const l = document.createElement('span'); l.className = 'iv-score-l mono small'; l.textContent = label;
    d.append(n, l);
    return d;
  }
  function render() {
    const q = $('aSearch').value.trim().toLowerCase();
    const shown = users.filter((u) => !q || (u.name + ' ' + u.email).toLowerCase().includes(q));
    const rows = shown.map(function (u) {
      const tr = document.createElement('tr');
      [u.name || '–', u.email || '–', u.provider || '–', fmt(u.created), fmt(u.lastSignIn), u.interviews == null ? '–' : String(u.interviews)].forEach(function (v, i) {
        const td = document.createElement('td'); td.textContent = v;
        td.dataset.label = ['Name', 'Email', 'Sign-in', 'Joined', 'Last login', 'Interviews'][i];
        tr.appendChild(td);
      });
      return tr;
    });
    $('aBody').replaceChildren.apply($('aBody'), rows);
    $('aWrap').classList.toggle('hidden', !shown.length);
    $('aStatus').textContent = shown.length ? '' : 'No accounts match.';
    $('aStatus').classList.toggle('hidden', !!shown.length);
  }
  function fail(text) {
    $('aStatus').textContent = text; $('aStatus').classList.remove('hidden');
    $('aWrap').classList.add('hidden'); $('aStats').classList.add('hidden');
    $('aRetry').classList.remove('hidden');
  }
  async function load() {
    $('aRetry').classList.add('hidden');
    $('aStatus').textContent = 'Loading accounts…'; $('aStatus').classList.remove('hidden');
    try {
      const fb = AIIC_AUTH.auth && AIIC_AUTH.auth.currentUser;
      if (!fb) { window.location.replace('login.html'); return; }
      const res = await fetch('/api/accounts-list', { method: 'POST', headers: { 'X-Firebase-Token': await fb.getIdToken(true) } });
      if (!res.ok) {
        let info = {}; try { info = await res.json(); } catch (e) {}
        $('aRetry').classList.remove('hidden'); $('aWrap').classList.add('hidden'); $('aStats').classList.add('hidden');
        $('aStatus').classList.remove('hidden');
        if (res.status === 403) {
          $('aRetry').classList.add('hidden');
          $('aStatus').textContent = 'This page is only for the site admin. You are signed in as ' + (info.email || 'another account') + (info.email && !info.verified ? ', and that email is not verified. Sign in with Google instead.' : '. Sign in with the admin Google account.');
        } else if (res.status === 404) {
          $('aStatus').textContent = 'The accounts service is not running on the server yet. Wait a minute for the latest deploy to finish, then try again.';
        } else if (info.error === 'not_configured') {
          $('aStatus').textContent = 'The server is missing its Firebase setup: ' + (info.detail || 'FIREBASE_SERVICE_ACCOUNT') + '. Add it in Azure (see the README).';
        } else if (info.error === 'server_error') {
          $('aStatus').textContent = 'The server could not check your sign-in (' + (info.detail || 'unknown') + '). Its Firebase service account may belong to a different project, or lack permission.';
        } else {
          $('aStatus').textContent = 'The server rejected your sign-in (' + res.status + '). Log out, log in with Google again, then reload this page.';
        }
        return;
      }
      users = (await res.json()).users || [];
    } catch (e) { return fail('Could not load accounts. Check your connection and try again.'); }
    const week = Date.now() - 7 * 864e5;
    $('aStats').replaceChildren(
      tile('Accounts', users.length),
      tile('Active this week', users.filter((u) => u.lastSignIn && u.lastSignIn > week).length),
      tile('New this week', users.filter((u) => u.created && u.created > week).length),
      tile('Interviews', users.reduce((n, u) => n + (u.interviews || 0), 0))
    );
    $('aStats').classList.remove('hidden');
    render();
  }
  $('aSearch').addEventListener('input', render);
  $('aRetry').addEventListener('click', load);
  AIIC_AUTH.ready.then(function () {
    if (!AIIC_AUTH.getUser()) { window.location.replace('login.html'); return; }
    load();
  });
})();
