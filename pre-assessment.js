/* =========================================================
   AI Interview Chat — candidate pre-assessment
   The candidate logs in with the email the company invited and the company's code. No account is created:
   the server (/api/candidate-login) checks the email against the company's list and signs them in with a
   one-assessment token. firestore.rules then limit that sign-in to this one pre-assessment.
   ========================================================= */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const A = window.AIIC_ASSESS;
  const msg = $('pMsg');
  const form = $('pForm');
  let found = null;

  if (!window.AIIC_AUTH || !AIIC_AUTH.configured) {
    msg.textContent = 'Accounts are not set up yet.';
    form.querySelectorAll('input,button').forEach((b) => { b.disabled = true; });
    return;
  }

  // A code that came in the link (pre-assessment.html?code=ABCD-1234) fills the box.
  const linkCode = new URLSearchParams(window.location.search).get('code');
  if (linkCode) form.elements.code.value = A.normCode(linkCode).replace(/[^A-Z0-9-]/g, '');
  form.elements.email.focus();

  function reset() { found = null; $('pReady').classList.add('hidden'); }

  form.elements.code.addEventListener('input', function () {
    const c = this.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (c !== this.value) this.value = c;
    reset();
  });
  form.elements.email.addEventListener('input', reset);

  async function logIn(email, code) {
    const res = await fetch('/api/candidate-login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, code: code })
    });
    if (!res.ok) { const err = new Error('login'); err.status = res.status; throw err; }
    const cred = await AIIC_AUTH.auth.signInWithCustomToken((await res.json()).token);
    const claims = (await cred.user.getIdTokenResult()).claims;
    // Remember who this is for the interview page (the token carries the email and a guessed first name).
    AIIC_AUTH.setUser({ uid: cred.user.uid, name: claims.candName || '', email: claims.candEmail || email, picture: '', candidate: true });
    return cred.user;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    msg.textContent = '';
    reset();
    const email = A.normEmail(form.elements.email.value);
    const code = A.normCode(form.elements.code.value);
    if (!email) { msg.textContent = 'Enter your email.'; return; }
    if (!A.CODE_RE.test(code)) { msg.textContent = 'Enter the code from the company (4–20 letters, numbers or dashes).'; return; }
    $('pGo').disabled = true;
    try {
      const fbUser = await logIn(email, code);
      const out = await A.open(code, fbUser.uid);
      const a = out.assessment, s = out.session;
      if (s && s.complete) {
        msg.textContent = 'You already completed this pre-assessment on ' + new Date(s.date).toLocaleDateString() + '. ' + (a.company || 'The company') + ' has your answers.';
        return;
      }
      found = a;
      $('pCompany').textContent = a.company || '';
      $('pTitle').textContent = a.title;
      const timed = Array.isArray(a.timeLimits) && a.timeLimits.some((t) => t > 0);
      $('pInfo').textContent = a.role + ' · ' + a.questions.length + (a.questions.length === 1 ? ' question' : ' questions') + (timed ? ' · timed' : '');
      $('pTimed').classList.toggle('hidden', !timed);
      $('pRestart').classList.toggle('hidden', !(s && s.results && s.results.length));
      $('pReady').classList.remove('hidden');
      $('pStart').focus();
    } catch (err) {
      const st = err && err.status;
      msg.textContent =
        st === 404 || (err && err.code === 'not-found') ? 'No pre-assessment matches this code and email. Check the code, and make sure the company invited this email.' :
        st === 429 ? 'Too many attempts. Please try again tomorrow or contact the company.' :
        st === 503 ? 'The pre-assessment service is not available right now. Please try again later.' :
        'Could not log you in. Check your connection and try again.';
    } finally { $('pGo').disabled = false; }
  });

  $('pStart').addEventListener('click', function () {
    if (!found) return;
    try {
      sessionStorage.setItem('aiic_assessment', JSON.stringify({
        code: found.code, title: found.title, role: found.role, company: found.company || '', questions: found.questions, limits: Array.isArray(found.timeLimits) ? found.timeLimits : []
      }));
      sessionStorage.setItem('aiic_role', found.role);
    } catch (err) { msg.textContent = 'Your browser blocked storage for this site. Allow it and try again.'; return; }
    window.location.href = 'interview.html';
  });
})();
