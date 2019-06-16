import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'snapszer-score-counter.firebaseapp.com',
  databaseURL: 'https://snapszer-score-counter.firebaseio.com',
  projectId: 'snapszer-score-counter',
  storageBucket: 'snapszer-score-counter.appspot.com',
  messagingSenderId: '304290792120',
  appId: '1:304290792120:web:ccccf2fac7ef7719',
};

export const auth = firebase.auth;

export const init = () => firebase.initializeApp(firebaseConfig);

// FirebaseUI config
export const uiConfig = {
  signInFlow: 'popup',
  credentialHelper: 'none',
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};
