import {
  Avatar,
  Hidden,
  Menu,
  MenuItem,
  IconButton,
  Button,
} from "@material-ui/core";
import {
  ArrowBackIos,
  ArrowForwardIos,
  InsertEmoticon,
} from "@material-ui/icons";
import styled from "styled-components";
import { db, auth } from "../firebase";
import firebase from "firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { AttachFile, MoreVert, Group } from "@material-ui/icons";
import { Picker } from "emoji-mart";
import { useAuthState } from "react-firebase-hooks/auth";
import "emoji-mart/css/emoji-mart.css";
import Message from "./Message";

function GroupScreen({ group, messages }) {
  //Assign router.
  const router = useRouter();

  //Current user.
  const [user] = useAuthState(auth);

  //Refs
  const endOfMessageRef = useRef(null);

  //States
  const [userNames, setUserNames] = useState([]);
  const [userEmails, setUserEmails] = useState(group.users);
  const [input, setInput] = useState("");
  const [menuToggle, setMenuToggle] = useState(null);
  const [emojiDisplay, setEmojiDisplay] = useState("none");

  //Fetch all the messages for the group.
  const [messagesSnapshot] = useCollection(
    db
      .collection("groups")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  //useEffect to get names of all the users.
  useEffect(async () => {
    const users = [];

    for (const email of userEmails) {
      await db
        .collection("users")
        .where("email", "==", email)
        .get()
        .then((snapshot) => {
          users.push(snapshot.docs[0].data().name);
        });
    }
    setUserNames(users);
  }, []);

  //Function to Show all the messages.
  const showMessages = () => {
    //If Client is faster
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

    //If SSR is faster.
    return JSON.parse(messages).map((message) => (
      <Message key={message.id} user={message.user} message={message} />
    ));
  };

  //Function to Toggle Emojis.
  const emojiFunction = () => {
    if (emojiDisplay == "none") {
      setEmojiDisplay("");
    } else {
      setEmojiDisplay("none");
    }
  };

  //Function to select Emojis.
  const selectEmoji = () => {
    let sym = e.unified.split("-");
    let codeArray = [];
    codeArray.push("0x" + sym[0]);
    let emoji = String.fromCodePoint(...codeArray);
    setInput(input + emoji);
  };

  //Function which allows ui to scroll to bottom when new message is typed.
  const ScrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  //Function to send Message.
  const sendMessage = (event) => {
    event.preventDefault();
    //When a user sends message change their last seen on DB.
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    //Add Message to current group in DB.
    db.collection("groups").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
    setEmojiDisplay("none");
    ScrollToBottom();
  };

  return (
    <Container>
      <Header>
        <Hidden mdUp>
          <ArrowBackIos
            onClick={() => router.push("/")}
            style={{ marginRight: "5px" }}
          />
        </Hidden>
        {group.photoURL ? (
          <Avatar src={group.photoURL} />
        ) : (
          <Avatar>{group.groupName?.[0]}</Avatar>
        )}
        <HeaderInfo>
          <h3>{group?.groupName}</h3>
        </HeaderInfo>
        <HeaderIcons>
          <IconButton onClick={(e) => setMenuToggle(e.currentTarget)}>
            <Group />
          </IconButton>
          <Menu
            style={{ marginTop: "50px", marginRight: "50px" }}
            id="menu"
            anchorEl={menuToggle}
            keepMounted
            open={Boolean(menuToggle)}
            onClose={() => setMenuToggle(null)}
          >
            {userNames.map((name) => {
              return <MenuItem>{name}</MenuItem>;
            })}
          </Menu>
          <IconButton>
            <AttachFile style={{ color: "white" }} />
          </IconButton>
          <IconButton>
            <MoreVert />
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
            Send Message
          </button>
          <ArrowForwardIos onClick={sendMessage} />
        </MainInput>
        <Picker
          style={{ width: "100%", display: emojiDisplay, marginTop: "20px" }}
          onSelect={selectEmoji}
        />
      </InputContainer>
    </Container>
  );
}

export default GroupScreen;

const Container = styled.div`
  flex: 1;
`;
const Header = styled.div`
  position: sticky;
  background: #0fa;
  background: linear-gradient(90deg, #7916dd, #0fa);
  border-radius: 0px 0px 25px 0px ;
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
  @media (max-width: 540px) {
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

const ViewUsers = styled(Button)`
  &&& {
    border-radius: 50px;
    font-size: 0.5em;
  }
`;

const Emoticon = styled(InsertEmoticon)`
  
  &&&{
    transition: transform .2s;
  }
  :hover {
    transform: scale(1.5);
  }
 
`;
