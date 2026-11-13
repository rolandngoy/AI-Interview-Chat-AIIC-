/* =========================================================
   AI Interview Chat — letter grades
   A is the best and F is failing. Used by the interview results and the history page.
   ========================================================= */
window.AIIC_GRADES = (function () {
  'use strict';
  const POINTS = { A: 4, B: 3, C: 2, D: 1, F: 0 };
  const LABEL = { A: 'Excellent', B: 'Good', C: 'Fair', D: 'Weak', F: 'Failing' };

  const fromPercent = (p) => (p >= 90 ? 'A' : p >= 80 ? 'B' : p >= 70 ? 'C' : p >= 60 ? 'D' : 'F');
  // A saved answer's grade: the AI's if there is one, otherwise from the automatic score.
  const ofResult = (r) => (r && POINTS[r.grade] !== undefined ? r.grade : fromPercent((r && r.s && r.s.overall) || 0));
  function overall(results) {
    if (!results || !results.length) return 'F';
    const avg = results.reduce((n, r) => n + POINTS[ofResult(r)], 0) / results.length;
    return avg >= 3.5 ? 'A' : avg >= 2.5 ? 'B' : avg >= 1.5 ? 'C' : avg >= 0.75 ? 'D' : 'F';
  }
  // A and B pass, C is borderline, D and F are not yet passing.
  const outcome = (g) => (g === 'A' || g === 'B' ? 'Pass' : g === 'C' ? 'Borderline' : 'Not passing yet');

  return { POINTS: POINTS, LABEL: LABEL, fromPercent: fromPercent, ofResult: ofResult, overall: overall, outcome: outcome };
})();
