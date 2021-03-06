import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, Hidden, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  InsertEmoticon,
  MicOutlined,
  ArrowForwardIos,
  ArrowBack,
  ArrowForward,
} from "@material-ui/icons";
import getReciepentEmail from "../utils/getReciepentEmail";
import Message from "../components/Message";
import { useState, useRef } from "react";
import TimeAgo from "timeago-react";
import firebase from "firebase";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import Sidebar from "./Sidebar";
import Fade from "react-reveal/Fade";
import { useContext } from "react";
import { DrawerContext } from "../Context/DrawerContext";

function ChatScreen({ chat, messages }) {
  //States
  const [input, setInput] = useState("");
  const [user] = useAuthState(auth);
  const [emojiDisplay, setEmojiDisplay] = useState("none");
  const [fadeDisplay, setFadeDisplay] = useState("none");

  //ContextProvider
  const { changeStatus, drawerStatus } = useContext(DrawerContext);

  const reciepentEmail = getReciepentEmail(chat.users, user);
  const endOfMessageRef = useRef(null);

  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  //Fetch reciepent
  const [reciepentSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getReciepentEmail(chat.users, user))
  );

  //Function for show message returns some jsx
  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
            id: message.id,
          }}
        />
      ));
    }
    //If the messageSnapshot is not there get the messages from the server side render.
    return JSON.parse(messages).map((message) => (
      <Message key={message.id} user={message.user} message={message} />
    ));
  };

  //Function which allows ui to scroll to bottom when new message is typed.
  const ScrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  //Function to send message.
  const sendMessage = (e) => {
    e.preventDefault();
    //when a user sends message change there last seen on DB.
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        user: user.email,
        photoURL: user.photoURL,
      })
      .then(() => {
        //We have reciepents ID.
        let reciepentID = ""; 
        
        reciepentSnapshot.docs.map((reciepent) => {
          reciepentID = reciepent.id;
        });
        
        //We have timestamp
        const timestamp = firebase.firestore.FieldValue.serverTimestamp()

        //Call a react hook to add Notification to reciepent.
        db.collection("users")
        .doc(reciepentID)
        .collection("notifications")
        .add({
          sender: user.displayName,
          docID: chat.id,
          message: input,
          timestamp: timestamp,
          type: 'message',
          status: 'active'
        })
        .then(() => console.log("Notification sent."));



      });

    setInput("");
    setEmojiDisplay("none");
    ScrollToBottom();
  };
  const reciepent = reciepentSnapshot?.docs?.[0]?.data();

  //Function to Toggle Emojis.
  const emojiFunction = () => {
    if (emojiDisplay == "none") {
      setFadeDisplay(true);
      setEmojiDisplay("");
    } else {
      setFadeDisplay(false);
      setEmojiDisplay("none");
    }
  };

  //Function to select emoji and store it.
  const selectEmoji = (e) => {
    let sym = e.unified.split("-");
    let codeArray = [];
    codeArray.push("0x" + sym[0]);
    let emoji = String.fromCodePoint(...codeArray);
    setInput(input + emoji);
  };

  return (
    <Container>
      <Header>
        {drawerStatus ? (
          <ArrowBack
            onClick={() => changeStatus(!drawerStatus)}
            style={{ marginRight: "5px", color: "white" }}
          />
        ) : (
          <ArrowForward
            onClick={() => changeStatus(!drawerStatus)}
            style={{ marginRight: "5px", color: "white" }}
          />
        )}

        {reciepent ? (
          <Avatar src={reciepent?.photoURL} />
        ) : (
          <Avatar>{reciepentEmail[0]}</Avatar>
        )}
        <HeaderInfo>
          <h3>{reciepent?.name}</h3>
          {reciepentSnapshot ? (
            <p>
              Last active:{" "}
              {reciepent?.lastSeen?.toDate() ? (
                <TimeAgo datetime={reciepent?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading last active...</p>
          )}
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon style={{ color: "white" }} />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}

        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>

      <InputContainer>
        <MainInput>
          <Emoticon onClick={emojiFunction} />
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <button hidden disabled={!input} type="submit" onClick={sendMessage}>
            Send message
          </button>
          <Arrow onClick={sendMessage} />
        </MainInput>
        <Fade bottom when={fadeDisplay}>
          <Picker
            style={{
              width: "100%",
              marginTop: "20px",
              display: emojiDisplay,
              backgroundColor: "whitesmoke",
            }}
            onSelect={selectEmoji}
          />
        </Fade>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;
const Container = styled.div`
  flex: 1;
`;

const Header = styled.div`
  position: sticky;
  background: #0fa;
  background: linear-gradient(90deg, #7916dd, #0fa);
  border-radius: 0px 0px 25px 0px;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  align-items: center;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    font-size: 1.5em;
    color: white;
    font-weight: bold;
    text-shadow: 0px 1px 7px rgba(0, 0, 0, 0.75);
    letter-spacing: 0.1em;
    word-spacing: 0.2em;
  }

  > p {
    font-size: 14px;
    font-weight: lighter;
    margin-top: -1.5em;
    margin-bottom: 2em;
    letter-spacing: 0.1em;
    text-shadow: 0px 1px 7px rgba(0, 0, 0, 0.75);
    color: white;
  }
  @media (max-width: 1024px) {
    > p {
      margin-top: 0px;
    }
  }
  @media (max-width: 800px) {
    > p {
      font-size: 0.6em;
      margin-top: -10px;
    }
    > h3 {
      font-size: 1em;
    }
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background: white;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  border: 0.1em solid black;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;

const InputContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const MainInput = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const Emoticon = styled(InsertEmoticon)`
  &&& {
    transition: transform 0.2s;
  }
  :hover {
    transform: scale(1.5);
  }
`;

const Arrow = styled(ArrowForwardIos)`
  &&& {
    transition: transform 0.2s;
  }
  :hover {
    transform: scale(1.5);
    color: lightGreen;
  }
`;
