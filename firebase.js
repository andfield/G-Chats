import firebase from "firebase";

//Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAUBJuuT8gbzv1HLle1PbHJMkCakuswdkI",
  authDomain: "g-chats-5e994.firebaseapp.com",
  projectId: "g-chats-5e994",
  storageBucket: "g-chats-5e994.appspot.com",
  messagingSenderId: "292531634074",
  appId: "1:292531634074:web:67a9fc81261c471cd04423"
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
