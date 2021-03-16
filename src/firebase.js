import firebase from 'firebase/app';
import 'firebase/firestore';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "t20fantasy-57872.firebaseapp.com",
  projectId: "t20fantasy-57872",
  storageBucket: "t20fantasy-57872.appspot.com",
  messagingSenderId: "406644793229",
  appId: "1:406644793229:web:83ca1ec26a52a9b330a7c4",
  measurementId: "G-GCJFW55V31"
};

firebase.initializeApp(config);
export const firestore = firebase.firestore();
export default firebase;
