import styled from "styled-components"
import Head from "next/head"
import Sidebar from "../../components/Sidebar"
import ChatScreen from "../../components/ChatScreen"
import {auth, db} from "../../firebase"
import {useAuthState} from "react-firebase-hooks/auth"
import getReciepectEmail from "../../utils/getReciepentEmail"
import {Hidden} from '@material-ui/core'

function Chat({chat, messages}) {
  const [user]=useAuthState(auth)
  return (
    <Container>
      <Head>
        <title>Chat with {getReciepectEmail(chat.users, user)}</title>
      </Head>
      <Hidden mdDown>
        <Sidebar />
      </Hidden>
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  )
}

export default Chat

//Server side rendering
export async function getServerSideProps(context) {
  //Get the current chat room ref.
  const ref=db.collection("chats").doc(context.query.id)

  //Prep the messages on the server.
  const messagesRes=await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get()

  const messages=messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }))

  //Prep the Chats
  const chatRes=await ref.get()
  const chat={
    id: chatRes.id,
    ...chatRes.data(),
  }
  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  }
}

const Container=styled.div`
  display: flex;
`
const ChatContainer=styled.div`
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
`
