import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCQ8paWODOAbal1nTZhhg7uod9L8jKSHAQ",
  authDomain: "jogo-da-forca-12a0f.firebaseapp.com",
  databaseURL: "https://jogo-da-forca-12a0f.firebaseio.com",
  projectId: "jogo-da-forca-12a0f",
  storageBucket: "jogo-da-forca-12a0f.appspot.com",
  messagingSenderId: "94454696586",
  appId: "1:94454696586:web:343ac2bf0bf9109eb33b73",
  measurementId: "G-EYYJB3ZDMD"
};

firebase.initializeApp(config);

export default firebase;