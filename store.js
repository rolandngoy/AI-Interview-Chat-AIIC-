/* =========================================================
   AI Interview Chat — local storage for users and history
   History is kept per Google account (email) in this browser's
   localStorage, so it survives closing the tab and signing out.
   It does not sync across devices.
   ========================================================= */
(function () {
  'use strict';

  const USER_KEY = 'aiic_user';
  const histKey = (email) => 'aiic_history_' + String(email || '').toLowerCase();

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }

  function getUser() { return read(USER_KEY); }
  function getHistory(email) { const h = read(histKey(email)); return Array.isArray(h) ? h : []; }

  // Insert or update a session by id so partial sessions are saved as the user goes.
  function saveSession(email, session) {
    const list = getHistory(email);
    const i = list.findIndex((s) => s.id === session.id);
    if (i === -1) list.push(session); else list[i] = session;
    return write(histKey(email), list);
  }
  function clearHistory(email) {
    try { localStorage.removeItem(histKey(email)); } catch (e) {}
  }

  window.AIIC_STORE = { getUser: getUser, getHistory: getHistory, saveSession: saveSession, clearHistory: clearHistory };
})();
