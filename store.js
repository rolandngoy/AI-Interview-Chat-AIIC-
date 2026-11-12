/* =========================================================
   AI Interview Chat — practice history (Cloud Firestore)
   Sessions live at users/{uid}/sessions/{sessionId}, so a user's
   history follows their account to any device.
   Needs firebase-app, firebase-auth and firebase-firestore (compat)
   and auth.js loaded first.
   ========================================================= */
(function () {
  'use strict';

  const sessions = (user) => firebase.firestore().collection('users').doc(user.uid).collection('sessions');
  const usable = (user) => !!(user && user.uid && window.AIIC_AUTH && AIIC_AUTH.configured);

  // Resolves to the list of sessions (empty on error).
  async function getHistory(user) {
    if (!usable(user)) return [];
    await AIIC_AUTH.ready;
    try {
      const snap = await sessions(user).get();
      return snap.docs.map((d) => d.data());
    } catch (e) { return []; }
  }

  // Insert or update a session by id so partial sessions are saved as the user goes.
  async function saveSession(user, session) {
    if (!usable(user)) return false;
    await AIIC_AUTH.ready;
    try { await sessions(user).doc(String(session.id)).set(session); return true; } catch (e) { return false; }
  }

  async function clearHistory(user) {
    if (!usable(user)) return false;
    await AIIC_AUTH.ready;
    try {
      const snap = await sessions(user).get();
      const batch = firebase.firestore().batch();
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      return true;
    } catch (e) { return false; }
  }

  window.AIIC_STORE = {
    getUser: function () { return window.AIIC_AUTH ? AIIC_AUTH.getUser() : null; },
    getHistory: getHistory,
    saveSession: saveSession,
    clearHistory: clearHistory
  };
})();
