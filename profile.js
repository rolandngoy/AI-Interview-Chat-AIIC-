/* =========================================================
   AI Interview Chat — profile menu (top right once signed in)
   Mounts into #profileMenu. Menu: History, Admin (admin only), Log out, Delete account.
   Needs auth.js (and store.js for deleting history) loaded first.
   ========================================================= */
(function () {
  'use strict';

  const mount = document.getElementById('profileMenu');
  const user = window.AIIC_AUTH && AIIC_AUTH.getUser();
  if (!mount || !user) return;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ---------- avatar + menu ---------- */
  const label = user.name || user.email || 'Account';
  const initials = label.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';

  const btn = el('button', 'profile-btn');
  btn.type = 'button';
  btn.setAttribute('aria-haspopup', 'menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Account menu for ' + label);
  if (user.picture) {
    const img = el('img');
    img.src = user.picture; img.alt = ''; img.referrerPolicy = 'no-referrer';
    img.addEventListener('error', () => { btn.replaceChildren(document.createTextNode(initials)); });
    btn.appendChild(img);
  } else {
    btn.textContent = initials;
  }

  const menu = el('div', 'profile-menu hidden');
  menu.setAttribute('role', 'menu');
  const head = el('div', 'profile-head');
  head.append(el('strong', null, user.name || 'Signed in'), el('span', 'small', user.email || ''));

  const history = el('a', 'profile-item', 'History');
  history.href = 'history.html'; history.setAttribute('role', 'menuitem');
  const logout = el('button', 'profile-item', 'Log out');
  logout.type = 'button'; logout.setAttribute('role', 'menuitem');
  const del = el('button', 'profile-item profile-danger', 'Delete account');
  del.type = 'button'; del.setAttribute('role', 'menuitem');
  menu.append(head, history);
  // Only a shortcut; the server decides who may actually see the accounts.
  if ((user.email || '').toLowerCase() === 'rolandngoy0703@gmail.com') {
    const admin = el('a', 'profile-item', 'Admin: all accounts');
    admin.href = 'admin.html'; admin.setAttribute('role', 'menuitem');
    menu.appendChild(admin);
  }
  menu.append(logout, del);
  mount.append(btn, menu);
  mount.classList.remove('hidden');

  function setOpen(open) {
    menu.classList.toggle('hidden', !open);
    btn.setAttribute('aria-expanded', open);
  }
  btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(menu.classList.contains('hidden')); });
  document.addEventListener('click', (e) => { if (!mount.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  logout.addEventListener('click', function () {
    AIIC_AUTH.signOut().then(() => { window.location.href = 'index.html'; });
  });

  /* ---------- delete account ---------- */
  function openDeleteDialog() {
    setOpen(false);
    const fb = AIIC_AUTH.auth && AIIC_AUTH.auth.currentUser;
    const usesPassword = !!fb && fb.providerData.some((p) => p.providerId === 'password');

    const overlay = el('div', 'dialog-overlay');
    const box = el('div', 'dialog');
    box.setAttribute('role', 'alertdialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-labelledby', 'delTitle');
    const title = el('h2', null, 'Are you sure you want to delete your account?');
    title.id = 'delTitle';
    const body = el('p', null, 'This permanently deletes your account and all of your practice history. This cannot be undone.');
    box.append(title, body);

    let pw = null;
    if (usesPassword) {
      pw = el('input', 'role-search');
      pw.type = 'password'; pw.placeholder = 'Confirm your password'; pw.autocomplete = 'current-password';
      pw.setAttribute('aria-label', 'Password');
      box.appendChild(pw);
    }
    const msg = el('p', 'dialog-msg small');
    msg.setAttribute('role', 'alert');
    const actions = el('div', 'dialog-actions');
    const cancel = el('button', 'btn btn-accent btn-md', 'No, keep my account'); cancel.type = 'button';
    const confirmBtn = el('button', 'btn btn-danger btn-md', 'Yes, delete my account'); confirmBtn.type = 'button';
    actions.append(cancel, confirmBtn);
    box.append(msg, actions);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    (pw || cancel).focus();

    const close = () => overlay.remove();
    cancel.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    confirmBtn.addEventListener('click', async function () {
      msg.textContent = '';
      if (!fb) { msg.textContent = 'You are not signed in.'; return; }
      if (pw && !pw.value) { msg.textContent = 'Enter your password to continue.'; return; }
      confirmBtn.disabled = cancel.disabled = true;
      AIIC_AUTH.suppressRedirect = true;
      try {
        // Deleting is a sensitive action, so Firebase needs a fresh sign-in.
        if (pw) await fb.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(fb.email, pw.value));
        else if (fb.providerData.some((p) => p.providerId === 'microsoft.com')) await fb.reauthenticateWithPopup(new firebase.auth.OAuthProvider('microsoft.com'));
        else await fb.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider());

        if (window.AIIC_STORE && !(await AIIC_STORE.clearHistory(user))) {
          throw { code: 'history-failed' };
        }
        await fb.delete();
        try { localStorage.removeItem('aiic_user'); sessionStorage.removeItem('aiic_role'); } catch (e) {}
        window.location.href = 'index.html';
      } catch (err) {
        AIIC_AUTH.suppressRedirect = false;
        confirmBtn.disabled = cancel.disabled = false;
        const c = err && err.code;
        if (c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request') return;
        msg.textContent =
          c === 'auth/invalid-credential' || c === 'auth/wrong-password' ? 'Incorrect password.' :
          c === 'auth/too-many-requests' ? 'Too many attempts. Wait a few minutes and try again.' :
          c === 'auth/popup-blocked' ? 'Your browser blocked the Google pop-up. Allow pop-ups and try again.' :
          c === 'history-failed' ? 'Could not delete your history, so your account was not deleted. Try again.' :
          'Could not delete your account. Please try again.';
      }
    });
  }
  del.addEventListener('click', openDeleteDialog);
})();
