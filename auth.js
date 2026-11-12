/* =========================================================
   AI Interview Chat — client-side auth (Google Identity Services)
   Shared by login.html and index.html.
   The session lives in sessionStorage; nothing is verified server-side.
   ========================================================= */
(function () {
  'use strict';

  const KEY = 'aiic_user';

  function getUser() {
    try { return JSON.parse(sessionStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function setUser(user) {
    try { sessionStorage.setItem(KEY, JSON.stringify(user)); } catch (e) {}
  }
  function signOut() {
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    if (window.google && google.accounts) google.accounts.id.disableAutoSelect();
  }
  function decodeJwt(token) {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  }

  /* ---------- login page ---------- */
  function initLoginPage() {
    const slot = document.getElementById('googleBtn');
    if (!slot) return;
    if (getUser()) { window.location.replace('index.html#demo'); return; }

    const clientId = (window.AIIC_CONFIG || {}).googleClientId;
    const msg = document.getElementById('loginMsg');
    if (!clientId || clientId.indexOf('YOUR_') === 0) {
      msg.textContent = 'Google sign-in is not configured yet. Add your client ID in config.js.';
      return;
    }

    function render() {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: function (res) {
          const p = decodeJwt(res.credential);
          setUser({ name: p.name, email: p.email, picture: p.picture });
          window.location.href = 'index.html#demo';
        }
      });
      google.accounts.id.renderButton(slot, { type: 'standard', theme: 'filled_black', size: 'large', text: 'signin_with', shape: 'pill' });
    }
    if (window.google && google.accounts) render();
    else document.getElementById('gsiScript').addEventListener('load', render);
  }

  /* ---------- landing page nav ---------- */
  function initNav() {
    const cta = document.getElementById('navCta');
    if (!cta) return;
    const user = getUser();
    if (!user) return;
    cta.setAttribute('href', '#demo');
    const who = document.getElementById('navUser');
    who.querySelector('.nav-user-name').textContent = (user.name || user.email || '').split(' ')[0];
    who.classList.remove('hidden');
    document.getElementById('signOutBtn').addEventListener('click', function () {
      signOut();
      window.location.href = 'index.html';
    });
    document.querySelectorAll('a[href="login.html"]').forEach(function (a) { a.setAttribute('href', '#demo'); });
  }

  initLoginPage();
  initNav();
})();
