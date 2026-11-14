/* =========================================================
   AI Interview Chat — company log in (Microsoft, via Firebase Authentication)
   ========================================================= */
(function () {
  'use strict';
  const btn = document.getElementById('microsoftBtn');
  const msg = document.getElementById('formMsg');
  const auth = window.AIIC_AUTH && AIIC_AUTH.auth;
  if (!btn) return;

  if (!auth) {
    msg.textContent = 'Accounts are not set up yet. Add your Firebase settings in config.js.';
    btn.disabled = true;
    return;
  }

  // Already signed in (for example with Microsoft earlier): go straight to the company page.
  AIIC_AUTH.ready.then(function () { if (AIIC_AUTH.getUser()) window.location.replace('company-home.html'); });

  function friendly(err) {
    switch (err && err.code) {
      case 'auth/operation-not-allowed': return 'Microsoft sign-in is not turned on yet. Enable it in the Firebase console (see the README).';
      case 'auth/popup-blocked': return 'Your browser blocked the Microsoft pop-up. Allow pop-ups for this site and try again.';
      case 'auth/account-exists-with-different-credential': return 'An account with this email already exists with a different sign-in method. Use that method to log in.';
      case 'auth/unauthorized-domain': return 'This site\'s domain is not authorized in Firebase yet.';
      case 'auth/network-request-failed': return 'Network error. Check your connection and try again.';
      default: return 'Something went wrong. Please try again.';
    }
  }

  btn.addEventListener('click', async function () {
    msg.textContent = '';
    btn.disabled = true;
    try {
      const provider = new firebase.auth.OAuthProvider('microsoft.com');
      provider.setCustomParameters({ prompt: 'select_account' });
      await auth.signInWithPopup(provider);
      window.location.href = 'company-home.html';
    } catch (err) {
      btn.disabled = false;
      const c = err && err.code;
      if (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request') return;
      msg.textContent = friendly(err);
    }
  });
})();
