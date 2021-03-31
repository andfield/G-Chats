import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from './Login'
import Loading from '../components/Loading'

function MyApp({ Component, pageProps }) {
  //get the user if anyone is logged in
  const [user, loading] = useAuthState(auth);

  //if the user is being authenticated and its loading.
  if(loading) return <Loading />;

  //If the user doesnt exists
  if (!user) return <Login />

  return <Component {...pageProps} />;
}

export default MyApp;
