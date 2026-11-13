/* =========================================================
   AI Interview Chat — the two AI interviewers
   Keep `id` in sync with api/src/personas.js (the server holds their personalities).
   `voiceHints` are voice names to prefer for read-aloud; the browser picks the
   closest installed voice, so it sounds different on every device.
   ========================================================= */
window.AIIC_INTERVIEWERS = {
  makenzie: {
    id: 'makenzie',
    name: 'Makenzie',
    title: 'Hiring Manager',
    img: 'images/makenzie.jpg',
    pitch: 1.08,
    rate: 0.97,
    voiceHints: ['Samantha', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Karen'],
    greeting: (role) => 'Hi, I\'m Makenzie, the hiring manager. Thanks for making the time today. I\'ll be interviewing you for the ' + role + ' role, so let\'s get started.'
  },
  roland: {
    id: 'roland',
    name: 'Roland',
    title: 'Senior Interviewer',
    img: 'images/roland.jpg',
    pitch: 0.82,
    rate: 0.95,
    voiceHints: ['Daniel', 'Google UK English Male', 'Microsoft Guy', 'Microsoft Davis', 'Alex'],
    greeting: (role) => 'Hello, I\'m Roland, a senior interviewer here. Thanks for joining. We\'ll talk through the ' + role + ' role today, so whenever you\'re ready, let\'s begin.'
  }
};
