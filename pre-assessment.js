/* =========================================================
   AI Interview Chat — candidate pre-assessment
   The candidate enters their email and the company's code. It only opens when the company
   put that email on the assessment's candidate list (checked by firestore.rules).
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
    return;
  }

  // Keep a code that came in the link (pre-assessment.html?code=ABCD-1234) across the log in.
  const params = new URLSearchParams(window.location.search);
  try {
    if (params.get('code')) sessionStorage.setItem('aiic_pa_code', A.normCode(params.get('code')));
  } catch (e) {}

  function reset() { found = null; $('pReady').classList.add('hidden'); }

  AIIC_AUTH.ready.then(function () {
    const user = AIIC_AUTH.getUser();
    if (!user) { $('pSignedOut').classList.remove('hidden'); return; }
    form.classList.remove('hidden');
    form.elements.email.value = user.email || '';
    try { form.elements.code.value = sessionStorage.getItem('aiic_pa_code') || ''; } catch (e) {}
    (form.elements.email.value ? form.elements.code : form.elements.email).focus();

    form.elements.code.addEventListener('input', function () {
      const c = this.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
      if (c !== this.value) this.value = c;
      reset();
    });
    form.elements.email.addEventListener('input', reset);

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      msg.textContent = '';
      reset();
      const email = A.normEmail(form.elements.email.value);
      const code = A.normCode(form.elements.code.value);
      if (!email) { msg.textContent = 'Enter your email.'; return; }
      if (!A.CODE_RE.test(code)) { msg.textContent = 'Enter the code from the company (4–20 letters, numbers or dashes).'; return; }
      if (email !== A.normEmail(user.email)) {
        msg.textContent = 'You are logged in as ' + (user.email || 'another account') + '. Log out (top right), then log in with ' + email + ' to take this pre-assessment.';
        return;
      }
      $('pGo').disabled = true;
      try {
        const out = await A.open(code, user.uid);
        const a = out.assessment, s = out.session;
        try { sessionStorage.setItem('aiic_pa_code', code); } catch (err) {}
        if (s && s.complete) {
          msg.textContent = 'You already completed this pre-assessment on ' + new Date(s.date).toLocaleDateString() + '. ' + (a.company || 'The company') + ' has your answers.';
          return;
        }
        found = a;
        $('pCompany').textContent = a.company || '';
        $('pTitle').textContent = a.title;
        $('pInfo').textContent = a.role + ' · ' + a.questions.length + (a.questions.length === 1 ? ' question' : ' questions');
        $('pRestart').classList.toggle('hidden', !(s && s.results && s.results.length));
        $('pReady').classList.remove('hidden');
        $('pStart').focus();
      } catch (err) {
        msg.textContent = err && err.code === 'not-found'
          ? 'No pre-assessment matches this code and email. Check the code, and make sure the company invited this email.'
          : 'Could not check the code. Check your connection and try again.';
      } finally { $('pGo').disabled = false; }
    });

    $('pStart').addEventListener('click', function () {
      if (!found) return;
      try {
        sessionStorage.setItem('aiic_assessment', JSON.stringify({
          code: found.code, title: found.title, role: found.role, company: found.company || '', questions: found.questions
        }));
        sessionStorage.setItem('aiic_role', found.role);
      } catch (err) { msg.textContent = 'Your browser blocked storage for this site. Allow it and try again.'; return; }
      window.location.href = 'interview.html';
    });
  });
})();
