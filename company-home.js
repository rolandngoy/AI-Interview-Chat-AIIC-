/* Company page shown after a Microsoft log in. */
(function () {
  'use strict';
  AIIC_AUTH.ready.then(function () {
    const user = AIIC_AUTH.getUser();
    if (!user) return; // auth.js sends signed-out visitors to the company log in
    document.getElementById('cTitle').textContent = 'Welcome' + (user.name ? ', ' + user.name.split(' ')[0] : '');
  });
})();
