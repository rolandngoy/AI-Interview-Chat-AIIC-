/* =========================================================
   AI Interview Chat — accounts (Firebase Authentication)
   Shared by every page. Email/password and Google sign-in.
   The signed-in user is mirrored into localStorage so pages can
   check it synchronously; Firebase remains the source of truth.
   ========================================================= */
(function () {
  'use strict';

  const KEY = 'aiic_user';
  const GUARDED = /\/(roles|interview|history|admin)(\.html)?$/;
  const cfg = (window.AIIC_CONFIG || {}).firebase || {};
  const configured = !!(cfg.apiKey && cfg.apiKey.indexOf('YOUR_') !== 0 && window.firebase);

  function getUser() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function setUser(user) {
    try { localStorage.setItem(KEY, JSON.stringify(user)); } catch (e) {}
  }
  function clearUser() {
    try { localStorage.removeItem(KEY); sessionStorage.removeItem('aiic_role'); } catch (e) {}
  }
  const toUser = (fb) => ({ uid: fb.uid, name: fb.displayName || '', email: fb.email || '', picture: fb.photoURL || '' });

  let auth = null;
  if (configured) { firebase.initializeApp(cfg); auth = firebase.auth(); }

  let resolveReady;
  const ready = new Promise((r) => { resolveReady = r; });
  let busy = false; // set while a login/sign-up form is mid-flight
  const onLoginPage = !!document.getElementById('googleBtn');

  if (auth) {
    auth.onAuthStateChanged(function (fb) {
      if (fb) {
        // Keep the name we set at sign-up if Firebase has not caught up yet.
        const prev = getUser();
        const u = toUser(fb);
        if (!u.name && prev && prev.uid === u.uid) u.name = prev.name;
        setUser(u);
        if (onLoginPage && !busy) window.location.replace('roles.html');
      } else {
        clearUser();
        if (GUARDED.test(window.location.pathname) && !window.AIIC_AUTH.suppressRedirect) window.location.replace('login.html');
      }
      resolveReady();
    });
  } else {
    resolveReady();
  }

  function signOut() {
    window.AIIC_AUTH.suppressRedirect = true;
    clearUser();
    return auth ? auth.signOut() : Promise.resolve();
  }

  window.AIIC_AUTH = { ready: ready, configured: configured, auth: auth, signOut: signOut, getUser: getUser, suppressRedirect: false };

  /* ---------- login page ---------- */
  function friendly(err) {
    switch (err && err.code) {
      case 'auth/email-already-in-use': return 'An account with this email already exists. Log in instead.';
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password': return 'Incorrect email or password.';
      case 'auth/weak-password': return 'Use a password of at least 8 characters.';
      case 'auth/invalid-email': return 'Enter a valid email address.';
      case 'auth/too-many-requests': return 'Too many attempts. Wait a few minutes and try again.';
      case 'auth/network-request-failed': return 'Network error. Check your connection and try again.';
      case 'auth/popup-blocked': return 'Your browser blocked the Google pop-up. Allow pop-ups for this site and try again.';
      case 'auth/unauthorized-domain': return 'This site\'s domain is not authorized in Firebase yet.';
      default: return 'Something went wrong. Please try again.';
    }
  }

  function initLoginPage() {
    const googleBtn = document.getElementById('googleBtn');
    if (!googleBtn) return;
    const loginForm = document.getElementById('loginForm');
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

    if (!auth) {
      msg.textContent = 'Accounts are not set up yet. Add your Firebase settings in config.js.';
      [googleBtn].concat(Array.from(document.querySelectorAll('.login-form button'))).forEach((b) => { b.disabled = true; });
      return;
    }

    async function run(fn) {
      msg.textContent = '';
      busy = true;
      try { await fn(); window.location.href = 'roles.html'; }
      catch (err) {
        busy = false;
        if (err && err.code === 'auth/popup-closed-by-user') return;
        msg.textContent = friendly(err);
      }
    }

    googleBtn.addEventListener('click', () => run(() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())));

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      run(() => auth.signInWithEmailAndPassword(loginForm.elements.email.value.trim(), loginForm.elements.password.value));
    });

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const first = signupForm.elements.first.value.trim();
      const last = signupForm.elements.last.value.trim();
      const pw = signupForm.elements.password.value;
      if (pw.length < 8) { msg.textContent = 'Use a password of at least 8 characters.'; return; }
      if (pw !== signupForm.elements.confirm.value) { msg.textContent = 'Passwords do not match.'; return; }
      run(async function () {
        const cred = await auth.createUserWithEmailAndPassword(signupForm.elements.email.value.trim(), pw);
        const name = first + ' ' + last;
        await cred.user.updateProfile({ displayName: name });
        setUser({ uid: cred.user.uid, name: name, email: cred.user.email, picture: '' });
      });
    });

    document.getElementById('forgotBtn').addEventListener('click', async function () {
      const email = loginForm.elements.email.value.trim();
      if (!email) { msg.textContent = 'Enter your email above, then click "Forgot password?".'; return; }
      try {
        await auth.sendPasswordResetEmail(email);
        msg.textContent = 'If an account exists for that email, a reset link is on its way.';
      } catch (err) { msg.textContent = friendly(err); }
    });
  }

  /* ---------- landing page nav ---------- */
  function initNav() {
    const cta = document.getElementById('navCta');
    if (!cta) return;
    const user = getUser();
    if (!user) return;
    cta.setAttribute('href', 'roles.html');
    document.querySelectorAll('a[href="login.html"]').forEach(function (a) { a.setAttribute('href', 'roles.html'); });
  }

  initLoginPage();
  initNav();
})();
