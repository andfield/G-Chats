import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useCollection } from "react-firebase-hooks/firestore";
import { InsertEmoticon, MicOutlined } from "@material-ui/icons";
import getReciepentEmail from "../utils/getReciepentEmail";
import Message from "../components/Message";
import { useState, useRef } from "react";
import TimeAgo from "timeago-react";
import firebase from "firebase";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

function ChatScreen({ chat, messages }) {
  //States
  const [input, setInput] = useState("");
  const [user] = useAuthState(auth);
  const [emojiDisplay, setEmojiDisplay] = useState("none");
  const [emoji, setEmoji] = useState("");

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

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    ScrollToBottom();
  };
  const reciepent = reciepentSnapshot?.docs?.[0]?.data();

  //Function to Toggle Emojis.
  const emojiFunction = () => {
    if (emojiDisplay == "none") {
      window.scrollTo({ top: 400, behavior: "smooth" });
      setEmojiDisplay("");
    } else {
      setEmojiDisplay("none");
    }
  };

  //Function to select emoji and store it.
  const selectEmoji = (e) => {
    let sym = e.unified.split("-");
    let codeArray = [];
    codeArray.push("0x" + sym[0]);
    let emoji = String.fromCodePoint(...codeArray)
    setInput(input + emoji)
  };

  return (
    <Container>
      <Header>
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
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}

        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticon onClick={emojiFunction} />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send message
        </button>
        <MicOutlined />
      </InputContainer>
      <Picker
        style={{ width: "100%", display: emojiDisplay }}
        onSelect={selectEmoji}
      />
    </Container>
  );
}

export default ChatScreen;
const Container = styled.div`
  flex: 1;
`;

const Header = styled.div`
  position: sticky;
  background-color: white;
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
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: grey;
  }
  @media (max-width: 1024px) {
    > p {
      margin-top: 0px;
    }
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #edd6ff;
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
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
