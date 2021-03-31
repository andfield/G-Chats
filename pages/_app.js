import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from './Login'
import Loading from '../components/Loading'
import { useEffect } from "react";
import firebase from "firebase"

function MyApp({ Component, pageProps }) {
  //get the user if anyone is logged in
  const [user, loading] = useAuthState(auth);

    //when the user first signin capture there details using useEffect.
    useEffect(() => {
      if(user){
        console.log(user)
        db.collection("users").doc(user.uid).set({
          name: user.displayName,
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL
        }, {merge: true})
      }
    }, [user])

  //if the user is being authenticated and its loading.
  if(loading) return <Loading />;

  //If the user doesnt exists
  if (!user) return <Login />

  return <Component {...pageProps} />;
}

export default MyApp;
