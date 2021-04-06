import Head from "next/head";
import styled from "styled-components";
import { Button, Link, TextField, Paper, } from "@material-ui/core";
import { db, auth, provider } from "../firebase";
import { useState } from "react";
import firebase from "firebase";
import { useRouter } from "next/router";

function Login() {
  const router = useRouter(false);

  //States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState(false);

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  //Function to signin a user using google OAuth.
  const gSignin = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  //Function to signin a user using email and password.
  const signin = () => {
    auth.signInWithEmailAndPassword(email, password).catch(alert);
  };

  //Function to register new user.
  const register = () => {
    auth
      .createUserWithEmailAndPassword(regEmail, regPassword)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: name,
          photoURL: photoUrl,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        });
      })
      .catch((err) => alert(err));
    setRegEmail("");
    setRegPassword("");
  };

  return page ? (
    <Container>
    <Head>
      <title>Register</title>
    </Head>
    <LoginContainer elevation={0}>
      <h1>Register</h1>
      <Logo src="https://cdn.dribbble.com/users/267404/screenshots/3713416/talkup.png" />
      <TextField
        variant="outlined"
        value={regEmail}
        onChange={(event) => setRegEmail(event.target.value)}
        label="Email"
        style={{ marginTop: "-10px", marginBottom: "20px", width: "250px" }}
      />
      <TextField
        variant="outlined"
        value={regPassword}
        onChange={(event) => setRegPassword(event.target.value)}
        label="Password"
        type="password"
        style={{ marginBottom: "20px" , width: "250px" }}
      />

      <TextField
        variant="outlined"
        value={name}
        onChange={(event) => setName(event.target.value)}
        label="Name"
        style={{ marginBottom: "20px" , width: "250px" }}
      />

      <TextField
        value={photoUrl}
        variant="outlined"
        label="Photo URL"
        tyle="photo"
        style={{ marginBottom: "20px" , width: "250px" }}
        onChange={(e) => setPhotoUrl(e.target.value)}
      />
      <BtnContainer>
        <Button
          onClick={register}
          variant="outlined"
          style={{ width: "100%" }}
        >
          Register
        </Button>
      </BtnContainer>
      <LinkBtn
        variant="h6"
        style={{ marginTop: "20px" }}
        onClick={() => setPage(false)}
      >
        Already have an account?
      </LinkBtn>
    </LoginContainer>
  </Container>
  ) : (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer elevation={0}>
        <h1>Log in</h1>
        <Logo src="https://cdn.dribbble.com/users/267404/screenshots/3713416/talkup.png" />
        <TextField
          variant="outlined"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          label="Email"
          type="email"
          style={{ marginTop: "-10px", marginBottom: "20px" , width: "250px" }}
        />
        <TextField
          variant="outlined"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          label="Password"
          type="password"
          style={{ marginBottom: "20px" , width: "250px"}}
        />
        <BtnContainer>
          <Button
            onClick={gSignin}
            variant="outlined"
            style={{ width: "100%", marginBottom: "10px" }}
          >
            Sign in with Google
          </Button>
          <Button onClick={signin} variant="outlined" style={{ width: "100%" }}>
            Login
          </Button>
        </BtnContainer>
        <LinkBtn
          variant="h6"
          style={{ marginTop: "20px" }}
          onClick={() => setPage(true)}
        >
          Dont have an account?
        </LinkBtn>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  height: 100vh;
`;

const LoginContainer = styled(Paper)`
  padding: 100px;
  align-items: center;
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  width: 100%;
  height: 100%;

  > h1 {
    margin-top: 0;
    font-size: 2em;
  }
`;
const BtnContainer = styled.div`
  display: flex;
  
  flex-direction: column;
`;

const Logo = styled.img`
  height: 200px;
  width: 250px;
  margin-bottom: 50px;
`;
const LinkBtn = styled(Link)`
  :hover {
    cursor: pointer;
  }
`;
