/* =========================================================
   AI Interview Chat — client-side auth (Google Identity Services)
   Shared by login.html and index.html.
   The signed-in user is remembered in localStorage; nothing is verified server-side.
   ========================================================= */
(function () {
  'use strict';

  const KEY = 'aiic_user';

  function getUser() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function setUser(user) {
    try { localStorage.setItem(KEY, JSON.stringify(user)); } catch (e) {}
  }
  function signOut() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    if (window.google && google.accounts) google.accounts.id.disableAutoSelect();
  }
  function decodeJwt(token) {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  }


  /* ---------- email accounts (stored in this browser only) ---------- */
  const ACCOUNTS_KEY = 'aiic_accounts';
  const ITERATIONS = 200000;

  function getAccounts() {
    try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveAccounts(a) {
    try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a)); return true; } catch (e) { return false; }
  }
  const toHex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  const fromHex = (hex) => new Uint8Array(hex.match(/.{2}/g).map((h) => parseInt(h, 16)));

  async function hashPassword(password, saltHex) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex), iterations: ITERATIONS }, key, 256);
    return toHex(bits);
  }

  function initEmailForms() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    const signupForm = document.getElementById('signupForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabSignup = document.getElementById('tabSignup');
    const msg = document.getElementById('formMsg');

    function showTab(which) {
      const login = which === 'login';
      loginForm.classList.toggle('hidden', !login);
      signupForm.classList.toggle('hidden', login);
      tabLogin.setAttribute('aria-selected', login);
      tabSignup.setAttribute('aria-selected', !login);
      msg.textContent = '';
    }
    tabLogin.addEventListener('click', () => showTab('login'));
    tabSignup.addEventListener('click', () => showTab('signup'));

    if (!(window.crypto && crypto.subtle)) {
      msg.textContent = 'Email accounts need a secure (https) connection.';
    }

    signupForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      msg.textContent = '';
      const name = signupForm.elements.name.value.trim();
      const email = signupForm.elements.email.value.trim().toLowerCase();
      const pw = signupForm.elements.password.value;
      if (pw.length < 8) { msg.textContent = 'Use a password of at least 8 characters.'; return; }
      if (pw !== signupForm.elements.confirm.value) { msg.textContent = 'Passwords do not match.'; return; }
      const accounts = getAccounts();
      if (accounts[email]) { msg.textContent = 'An account with this email already exists. Log in instead.'; return; }
      try {
        const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
        accounts[email] = { name: name, salt: salt, hash: await hashPassword(pw, salt) };
        if (!saveAccounts(accounts)) { msg.textContent = 'Could not save your account. Check that browser storage is enabled.'; return; }
        setUser({ name: name, email: email });
        window.location.href = 'roles.html';
      } catch (err) { msg.textContent = 'Something went wrong creating your account.'; }
    });

    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      msg.textContent = '';
      const email = loginForm.elements.email.value.trim().toLowerCase();
      const acct = getAccounts()[email];
      try {
        if (!acct || (await hashPassword(loginForm.elements.password.value, acct.salt)) !== acct.hash) {
          msg.textContent = 'Incorrect email or password.';
          return;
        }
        setUser({ name: acct.name, email: email });
        window.location.href = 'roles.html';
      } catch (err) { msg.textContent = 'Something went wrong logging you in.'; }
    });
  }

  /* ---------- login page ---------- */
  function initLoginPage() {
    const slot = document.getElementById('googleBtn');
    if (!slot) return;
    if (getUser()) { window.location.replace('roles.html'); return; }
    initEmailForms();

    const clientId = (window.AIIC_CONFIG || {}).googleClientId;
    const msg = document.getElementById('loginMsg');
    if (!clientId || clientId.indexOf('YOUR_') === 0) {
      msg.textContent = 'Google sign-in is not configured yet. Add your client ID in config.js.';
      return;
    }
    initGoogle(slot, clientId);
  }

  function initGoogle(slot, clientId) {
    function render() {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: function (res) {
          const p = decodeJwt(res.credential);
          setUser({ name: p.name, email: p.email, picture: p.picture });
          window.location.href = 'roles.html';
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
    cta.setAttribute('href', 'roles.html');
    const who = document.getElementById('navUser');
    who.querySelector('.nav-user-name').textContent = (user.name || user.email || '').split(' ')[0];
    who.classList.remove('hidden');
    document.getElementById('signOutBtn').addEventListener('click', function () {
      signOut();
      window.location.href = 'index.html';
    });
    document.querySelectorAll('a[href="login.html"]').forEach(function (a) { a.setAttribute('href', 'roles.html'); });
  }

  initLoginPage();
  initNav();
})();
