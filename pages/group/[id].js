import { Hidden } from "@material-ui/core";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar";
import Head from "next/head"
import {auth, db} from "../../firebase"
import {useAuthState} from "react-firebase-hooks/auth"
import GroupScreen from "../../components/GroupScreen"

function Group({group, messages}) {
  const [user]=useAuthState(auth)

  return (
    <Container>
      <Head>
          <title>{group.groupName}</title>
      </Head>
    <Hidden mdDown>
        <Sidebar />
    </Hidden>
    <ChatContainer>
        <GroupScreen group={group} messages={messages}/>
    </ChatContainer>
  </Container>
  )
}

export default Group;

// Server Side Rendering
export async function getServerSideProps(context){

    //Get the current group reference using idb
    const ref = db.collection("groups").doc(context.query.id)

    //Prep all the messages on the server.
    const messageRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get()

    const messages = messageRes.docs
        .map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        .map((messages) => ({
            ...messages,
            timestamp: messages.timestamp.toDate().getTime()
        }))

    // Prepare all the Chats.
    const chatRes = await ref.get()
    const chat = {
        id: chatRes.id,
        ...chatRes.data(),
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            group: chat,
        },
    }

}













//Styled Components
const Container = styled.div`
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
