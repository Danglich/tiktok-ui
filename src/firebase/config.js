import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDsnUxVfc-7vItHajJDPdYIkUjKY_wBwUE',
    authDomain: 'tiktok-71e4a.firebaseapp.com',
    projectId: 'tiktok-71e4a',
    storageBucket: 'tiktok-71e4a.appspot.com',
    messagingSenderId: '14277413624',
    appId: '1:14277413624:web:622a33c9b07a42d8ec490d',
    measurementId: 'G-YV5PTJNT69',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

if (window.location.hostname === 'localhost') {
    // auth.useEmulator('http://localhost:9099');
    // db.useEmulator('localhost', '8080');
}
export { db };
export default firebase;
