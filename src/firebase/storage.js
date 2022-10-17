import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
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
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export default storage;
