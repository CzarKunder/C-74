import * as firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyCc_PzkPskx9bLz-zOJRqT6jd5RNc9C5b4",
    authDomain: "wily-a602e.firebaseapp.com",
    projectId: "wily-a602e",
    storageBucket: "wily-a602e.appspot.com",
    messagingSenderId: "120516981908",
    appId: "1:120516981908:web:24bb874ff6be827d2a7081"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()