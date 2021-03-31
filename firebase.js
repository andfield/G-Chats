import firebase from "firebase";

//Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC0xS_FDlpkulaQcXUZsjT8H2mgq7jIT1U",
  authDomain: "g-chats-andfield.firebaseapp.com",
  projectId: "g-chats-andfield",
  storageBucket: "g-chats-andfield.appspot.com",
  messagingSenderId: "547822548837",
  appId: "1:547822548837:web:bb912be9d5232096d1938c",
};

//Setup and initiallize the Application but make sure its only done once
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

//Initialize the Database.
const db = app.firestore();

// Initialize the firebase google authentication
const auth = app.auth();

// Create a New google auth provider.
const provider = new firebase.auth.GoogleAuthProvider();

export {
    db, auth, provider
}
