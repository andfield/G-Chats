import Head from "next/head"
import styled from "styled-components"
import {Button, Link, TextField} from "@material-ui/core"
import {db, auth, provider} from "../firebase"
import {useState} from "react"
import firebase from "firebase"
import {useRouter} from "next/router"

function Login() {

  const router=useRouter(false)

  //States
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")
  const [page, setPage]=useState("")

  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword]=useState("")
  const [name, setName] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")


  //Function to signin a user using google OAuth.
  const gSignin=() => {
    auth.signInWithPopup(provider)
      .catch(alert)
  }

  //Function to signin a user using email and password.
  const signin=() => {
    auth.signInWithEmailAndPassword(email, password)
      .catch(alert)
  }

  //Function to register new user.
  const register = () => {
    auth.createUserWithEmailAndPassword(regEmail, regPassword)
    .then((authUser) => {
      authUser.user.updateProfile({
        displayName: name,
        photoURL: photoUrl,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      })
    }).catch(err => alert(err))
  }

  //Functional component for login page.
  const LoginPage=() => {
    return (
      <Container>
        <Head>
          <title>Login</title>
        </Head>
        <LoginContainer>
          <h1>Log in</h1>
          <Logo src="https://cdn.dribbble.com/users/267404/screenshots/3713416/talkup.png" />
          <TextField
            variant='outlined'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            label="Email"
            type="email"
            style={{marginTop: '-10px', marginBottom: '20px'}}
          />
          <TextField
            variant='outlined'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            label="Password"
            type="password"
            style={{marginBottom: '20px'}} />
          <BtnContainer>
            <Button onClick={gSignin} variant="outlined" style={{width: '100%', marginBottom: '10px'}}>
              Sign in with Google
          </Button>
            <Button onClick={signin} variant="outlined" style={{width: '100%'}}>
              Login
          </Button>
          </BtnContainer>
          <LinkBtn variant="h6" style={{marginTop: '20px'}} onClick={() => setPage(true) }>Dont have an account?</LinkBtn>
        </LoginContainer>
      </Container>
    )
  }

  //Functional component for Register page.
  const RegisterPage=() => {
    return (
      <Container>
        <Head>
          <title>Register</title>
        </Head>
        <LoginContainer>
          <h1>Register</h1>
          <Logo src="https://cdn.dribbble.com/users/267404/screenshots/3713416/talkup.png" />
          <TextField
            variant='outlined'
            value={regEmail}
            onChange={(event) => setRegEmail(event.target.value)}
            label="Email"     
            style={{marginTop: '-10px', marginBottom: '20px'}}
          />
          <TextField
            variant='outlined'
            value={regPassword}
            onChange={(event) => setRegPassword(event.target.value)}
            label="Password"
            type="password"
            style={{marginBottom: '20px'}} />

          <TextField 
            variant="outlined"
            value={name}
            onChange={(event) => setName(event.target.value)}
            label="Name"
            style={{marginBottom: '20px'}}

          />

          <TextField 
            value={photoUrl}
            variant="outlined"
            label="Photo URL"
            tyle="photo"
            style={{marginBottom: '20px'}}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <BtnContainer>

            <Button onClick={register} variant="outlined" style={{width: '100%'}}>
              Register
        </Button>
          </BtnContainer>
          <LinkBtn variant="h6" style={{marginTop: '20px'}} onClick={() => setPage(false)}>Already have an account?</LinkBtn>
        </LoginContainer>
      </Container>
    )
  }

  return (
    page? <RegisterPage />:
      <LoginPage />
  )
}

export default Login

const Container=styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`

const LoginContainer=styled.div`
  padding: 100px;
  align-items: center;
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);

  >h1{
    margin-top: 0;
    font-size: 2em;
  }
`
const BtnContainer=styled.div`

  display: flex;
  flex-direction: column;

`

const Logo=styled.img`
  height: 200px;
  width: 250px;
  margin-bottom: 50px;
`
const LinkBtn = styled(Link)`
  :hover{
    cursor: pointer;
  }
`
