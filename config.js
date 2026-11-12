// Public settings. Firebase web config values are not secrets; access is
// controlled by the Firestore rules in firestore.rules.
// Get yours at console.firebase.google.com → Project settings → Your apps → Web app.
window.AIIC_CONFIG = {
  firebase: {
    apiKey: 'YOUR_FIREBASE_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    appId: 'YOUR_FIREBASE_APP_ID'
  }
};
