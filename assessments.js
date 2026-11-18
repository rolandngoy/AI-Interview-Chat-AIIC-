/* =========================================================
   AI Interview Chat — company pre-assessments (Cloud Firestore)
   assessments/{id}                   the company's questions and the invited candidate emails (the id is internal)
   assessments/{id}/sessions/{uid}    one candidate's interview, readable by the candidate and the company
   candidateCodes/{CODE}              one personal code per invited candidate (company-only; the server checks it at log in)
   Access is enforced by firestore.rules. Needs firebase-app, -auth, -firestore (compat) and auth.js.
   ========================================================= */
(function () {
  'use strict';

  const db = () => firebase.firestore();
  const col = () => db().collection('assessments');
  const CODE_RE = /^[A-Z0-9-]{4,20}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const normCode = (c) => String(c || '').trim().toUpperCase().replace(/\s+/g, '');
  const normEmail = (e) => String(e || '').trim().toLowerCase();

  // Splits pasted text (commas, semicolons, spaces or new lines) into unique, valid, lower-case emails.
  function parseEmails(text) {
    const all = String(text || '').split(/[\s,;]+/).map(normEmail).filter(Boolean);
    const good = [], bad = [];
    all.forEach((e) => { if (!EMAIL_RE.test(e)) { if (bad.indexOf(e) === -1) bad.push(e); } else if (good.indexOf(e) === -1) good.push(e); });
    return { good: good, bad: bad };
  }

  // An easy-to-read random personal code (no 0/O or 1/I), 40 bits, like ABCD-EFGH.
  function randomCode() {
    const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const buf = new Uint32Array(8);
    crypto.getRandomValues(buf);
    let s = '';
    for (let i = 0; i < 8; i++) s += abc[buf[i] % abc.length];
    return s.slice(0, 4) + '-' + s.slice(4);
  }

  const isCompanyUser = () => {
    const fb = window.AIIC_AUTH && AIIC_AUTH.auth && AIIC_AUTH.auth.currentUser;
    return !!fb && fb.providerData.some((p) => p.providerId === 'microsoft.com' || p.providerId === 'google.com');
  };

  /* ---------- company side ---------- */
  async function listMine(uid) {
    const snap = await col().where('ownerUid', '==', uid).get();
    return snap.docs.map((d) => d.data()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  // Assessments have a random internal id (never shown). Candidates log in with their own personal code instead.
  const newId = () => col().doc().id;
  const create = (data) => col().doc(data.code).set(data);
  const update = (data) => col().doc(data.code).set(data);

  /* ---------- personal candidate codes ---------- */
  const codesCol = () => db().collection('candidateCodes');

  // { assessmentId: { email: code } } for everything this company has invited.
  async function listCodes(uid) {
    const snap = await codesCol().where('ownerUid', '==', uid).get();
    const out = {};
    snap.docs.forEach((d) => { const v = d.data(); (out[v.assessmentId] = out[v.assessmentId] || {})[v.email] = d.id; });
    return out;
  }

  async function writeInChunks(ops) {
    for (let i = 0; i < ops.length; i += 400) {
      const b = db().batch();
      ops.slice(i, i + 400).forEach((f) => f(b));
      await b.commit();
    }
  }

  // Gives every invited email its own code (keeping the codes they already have) and removes the codes of
  // emails that were taken off the list. Returns the full { email: code } map. Call after the assessment is saved.
  async function syncCodes(a, ownerUid, existing) {
    const have = Object.assign({}, existing || {});
    const ops = [];
    Object.keys(have).forEach((email) => {
      if (a.candidates.indexOf(email) === -1) { const c = have[email]; delete have[email]; ops.push((b) => b.delete(codesCol().doc(c))); }
    });
    await writeInChunks(ops);
    const missing = a.candidates.filter((e) => !have[e]);
    for (let attempt = 0; missing.length && attempt < 3; attempt++) {
      const fresh = {};
      missing.forEach((e) => { fresh[e] = randomCode(); });
      try {
        await writeInChunks(missing.map((e) => (b) => b.set(codesCol().doc(fresh[e]), { assessmentId: a.code, email: e, ownerUid: ownerUid })));
        Object.assign(have, fresh);
        break;
      } catch (e) {
        // A code that is already in use by someone else is refused by the rules; pick new ones and try again.
        if (!(e && e.code === 'permission-denied') || attempt === 2) throw e;
      }
    }
    return have;
  }

  async function sessionsFor(code) {
    const snap = await col().doc(code).collection('sessions').get();
    return snap.docs.map((d) => d.data());
  }
  const resetSession = (code, uid) => col().doc(code).collection('sessions').doc(uid).delete();

  async function remove(code) {
    const fb = AIIC_AUTH.auth.currentUser;
    if (fb) {
      const codes = await codesCol().where('ownerUid', '==', fb.uid).where('assessmentId', '==', code).get();
      await writeInChunks(codes.docs.map((d) => (b) => b.delete(d.ref)));
    }
    const snap = await col().doc(code).collection('sessions').get();
    await Promise.all(snap.docs.map((d) => d.ref.delete()));
    await col().doc(code).delete();
  }

  /* ---------- candidate side ---------- */
  // Resolves to { assessment, session } or rejects with code 'not-found'.
  async function open(code, uid) {
    let snap;
    try { snap = await col().doc(code).get(); }
    catch (e) { if (e && e.code === 'permission-denied') snap = null; else throw e; }
    if (!snap || !snap.exists) { const err = new Error('not found'); err.code = 'not-found'; throw err; }
    let session = null;
    try { const s = await col().doc(code).collection('sessions').doc(uid).get(); session = s.exists ? s.data() : null; } catch (e) {}
    return { assessment: snap.data(), session: session };
  }

  // Saves the candidate's interview so the company can review it.
  // The first save of a finished interview stamps finishedAt with the server time; after that the
  // rules keep the session open for 2 hours (so the AI grades can be added) and then lock it.
  const stamped = {};
  async function saveSession(code, user, session) {
    const ref = col().doc(code).collection('sessions').doc(user.uid);
    const data = Object.assign({}, session, { uid: user.uid, email: normEmail(user.email), name: user.name || '', code: code });
    delete data.finishedAt;
    if (data.complete && !stamped[code]) { data.finishedAt = firebase.firestore.FieldValue.serverTimestamp(); stamped[code] = true; }
    await ref.set(data, { merge: true }); // merge keeps an existing finishedAt untouched
  }

  window.AIIC_ASSESS = {
    CODE_RE: CODE_RE, normCode: normCode, normEmail: normEmail, parseEmails: parseEmails, randomCode: randomCode, newId: newId, listCodes: listCodes, syncCodes: syncCodes,
    isCompanyUser: isCompanyUser, listMine: listMine, create: create, update: update, remove: remove,
    sessionsFor: sessionsFor, resetSession: resetSession, open: open, saveSession: saveSession
  };
})();
