import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from "./Login";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import firebase from "firebase";
import ContextProvider from "../Context/DrawerContext";
import { useRouter } from "next/router";
import { route } from "next/dist/next-server/server/router";

function MyApp({ Component, pageProps }) {
  //get the user if anyone is logged in
  const [user, loading] = useAuthState(auth);

  //state to manage loading screen display between routes.
  const [loadScreen, setLoadScreen] = useState(false);

  //Router
  const router = useRouter();

  //when the router is between routes return loading screeen
  useEffect(() => {
    const updateLoadingStatus = () => setLoadScreen(!loadScreen);

    router.events.on("routeChangeStart", updateLoadingStatus);
    router.events.on("routeChangeComplete", updateLoadingStatus);

    return () => {
      router.events.off("routeChangeStart", updateLoadingStatus);
      router.events.off("routeChangeComplete", updateLoadingStatus);
    };
  }, [loadScreen]);

  //when the user first signin capture there details using useEffect.
  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set(
        {
          name: user.displayName,
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [user]);

  //if the user is being authenticated and its loading.
  if (loading) return <Loading />;

  //If the user doesnt exists
  if (!user) return <Login />;

  //return loading screen on route change.
  if (loadScreen) return <Loading />;

  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  )
}

export default MyApp;
