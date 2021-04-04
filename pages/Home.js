import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import ChatScreen from "../components/ChatScreen";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Container } from '@material-ui/core'
 
function HomePage() {
  const [user] = useAuthState(auth);

  return (
    <MainContainer>
      <Head>
        <title>Sup! {user?.displayName}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <HomeScreenContainer>
          <RoundedImg src="Gif.gif" alt="logo" />
          <h1>Welcome to G-Chats</h1>
          <p>Select a pre existing chat or create new chat to start talking with your G's.</p>
        </HomeScreenContainer>
        {/* <ChatScreen chat={null} messages={null}/> */}
      </ChatContainer>
    </MainContainer>
  );
}

export default HomePage;

const MainContainer = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
  //Hide the scroll-bar
  ::-webkit-scrollbar {
    display: none;
  }
  /* For IE and edge browser */
  -ms-overflow-style: none;
  /* For Firefox */
  scrollbar-width: none;
`;

const HomeScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: whitesmoke;
  min-height: 100vh;

  >h1{
    align-self: center;
    margin-top: -100px;
    font-size: 2.9em;
  }

  >p{
    align-self: center;
    margin-top: 5px;
    font-size: 1.5em;
    text-align: center;
  }
`;

const RoundedImg = styled.img`
  border-radius: 50%;
  align-self: center;
  margin-top: -6em;

  @media (max-width: 1024px){
    margin-top: -4em;
  }
`;
