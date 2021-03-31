import Head from "next/head";
import styled from "styled-components";
import { Button } from "@material-ui/core";
import { db, auth, provider } from "../firebase";

function Login() {

  //Function to signin a user
  const signin = () => {
      auth.signInWithPopup(provider)
      .catch(alert)
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>

      <LoginContainer>
        <Logo src="https://cdn.dribbble.com/users/267404/screenshots/3713416/talkup.png" />
        <Button onClick={signin} variant="outlined">
          Sign in with Google
        </Button>
      </LoginContainer>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  padding: 100px;
  align-items: center;
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: 200px;
  width: 250px;
  margin-bottom: 50px;
`;
