import styled from "styled-components";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import ChatScreen from "../components/ChatScreen";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, Container, Hidden } from "@material-ui/core";
import { DrawerContext } from "../Context/DrawerContext";
import { useContext } from "react";

function HomePage() {
  const [user] = useAuthState(auth);

  //Get Drawer Context.
  const { drawerStatus, changeStatus } = useContext(DrawerContext);

  return (
    <MainContainer>
      <Head>
        <title>Sup! {user?.displayName}</title>
      </Head>
      {drawerStatus == true ? <Sidebar /> : null}
      <ChatContainer>
        <HomeScreenContainer>
          <RoundedImg src="Gif.gif" alt="logo" />
          <h1 className="title">Welcome to G-Chats
            {console.log(drawerStatus)}
          </h1>
          <p>
            Select a pre existing chat or create new chat to start talking with
            your G's.
          </p>
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

  @media (max-width: 540px) {
    display: none;
  }
`;

const HomeScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: whitesmoke;
  min-height: 100vh;

  > h1 {
    align-self: center;
    margin-top: -100px;
    font-size: 5em;
    font-weight: 550;
  }

  > p {
    align-self: center;
    margin-top: -20px;
    font-size: 1.5em;
    text-align: center;
  }

  @media (max-width: 956px) {
    > h1 {
      align-self: center;
      font-size: 2em;
    }
  }
`;

const RoundedImg = styled.img`
  border-radius: 50%;
  align-self: center;
  margin-top: -6em;

  @media (max-width: 1024px) {
    margin-top: -4em;
  }
`;
