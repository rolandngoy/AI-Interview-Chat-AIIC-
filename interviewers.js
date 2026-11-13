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
    title: 'Senior Interviewer',
    img: 'images/makenzie.jpg',
    pitch: 1.24,
    rate: 1.05,
    voiceHints: ['Microsoft Jenny', 'Microsoft Aria', 'Ava', 'Allison', 'Zoe', 'Samantha', 'Google US English', 'Microsoft Zira', 'Susan', 'Victoria'],
    greeting: (role) => 'Hi, I\'m Makenzie, a senior interviewer here. Thanks for making the time today. I\'ll be interviewing you for the ' + role + ' role, so let\'s get started.'
  },
  roland: {
    id: 'roland',
    name: 'Roland',
    title: 'Senior Interviewer',
    img: 'images/roland.jpg',
    pitch: 1.06,
    rate: 1.02,
    voiceHints: ['Microsoft Guy', 'Microsoft Christopher', 'Microsoft Davis', 'Aaron', 'Tom', 'Evan', 'Nathan', 'Google UK English Male', 'Daniel'],
    greeting: (role) => 'Hello, I\'m Roland, a senior interviewer here. Thanks for joining. We\'ll talk through the ' + role + ' role today, so whenever you\'re ready, let\'s begin.'
  }
};
