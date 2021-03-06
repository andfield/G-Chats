import styled from "styled-components";
import Header from "./Header";
import { Button, ButtonGroup, Divider } from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";
import { auth, db } from "../firebase";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "../components/Chat";
import { useState, useContext, useEffect } from "react";
import SearchBar from "./Search";
import Fade from "react-reveal/Fade";
import { DrawerContext } from "../Context/DrawerContext";
import { NotificationContext } from "../Context/NotificationContext";
import { useRouter } from "next/router";

function Sidebar() {
  //Get user from use auth state.
  const [user] = useAuthState(auth);

  //router initiallization.
  const Router = useRouter();

  //Test
  const {state} = useContext(NotificationContext);

  useEffect(() => {
  
   console.log(state);
  }, []);

  //Get the display status from drawer context.
  const { drawerStatus, changeStatus } = useContext(DrawerContext);

  //Group visible state.
  const [group, setGroup] = useState(false);

  // //Create a irl notification ref to db using firebase hooks.
  const userNotificationRef = db
    .collection("users")
    .doc(user.uid)
    .collection("notifications");
  const [notificationSnapShot] = useCollection(userNotificationRef);

  // Function to check if the reciepent email has an account.
  const hasAnAccount = async (reciepentEmail) => {
    const snapshot = await db
      .collection("users")
      .where("email", "==", reciepentEmail)
      .get();
    if (!snapshot.empty) {
      console.log("Came here");
      return true;
    }
    return false;
  };

  //Create a irl chat reference to the db using firebase hooks.
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  //Create a IRL group reference to
  const userGroupRef = db
    .collection("groups")
    .where("users", "array-contains", user.email);
  const [groupSnapshot] = useCollection(userGroupRef);

  //Function to check if the chat already exists.
  const chatAlreadyExists = (reciepentEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === reciepentEmail)?.length > 0
    );

  //Function to check if user is already in that group.
  const userAlreadyInGroup = async (name) => {
    const snapshot = await db
      .collection("groups")
      .where("groupName", "==", name)
      .where("users", "array-contains", user.email)
      .get();
    if (!snapshot.empty) {
      return false;
    }
    return true;
  };

  //Function to create new chat.
  const createChat = async () => {
    //Prompt user to get an email.
    const input = prompt(
      "Please enter an email of the user you want to chat with."
    );
    if (!input) return null;
    //Check if the email is valid
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      if ((await hasAnAccount(input)) == true) {
        // If email is valid and the chat doesnt exists push to DB Chats collection.
        db.collection("chats").add({
          //adding email for now but try using name later.
          users: [user.email, input],
        });
      } else alert("User does not exist");
    } else alert("Invalid user please check if a chat already exists.");
  };

  //Function to create new chat room.
  const createGroup = async () => {
    //get user input for group name.
    const name = prompt("Please enter name for your group");
    const photoID = prompt("Please provid a photo for group avatar.");

    //Check if the group name already chatAlreadyExists
    if ((await userAlreadyInGroup(name)) == true) {
      //If everything is fine create the group.
      await db.collection("groups").add({
        groupName: name,
        createdBy: user.email,
        photoURL: photoID,
        users: [user.email],
      });
    } else {
      alert("You are already in that group.");
    }
  };

  return (
    <Container display={drawerStatus}>
      <Header createChat={createChat} />
      <Search>
        <SearchBar uEmail={user.email} style={{ width: "200px" }} />
      </Search>
      <ButtonDiv>
        <NewChat onClick={createChat} variant="outlined">
          Star a new chat
        </NewChat>
        <NewGroup onClick={createGroup} variant="outlined">
          Star a new group
        </NewGroup>
      </ButtonDiv>

      <ButtonGroup style={{ width: "100%", marginTop: "10px" }}>
        <NewChat onClick={() => setGroup(false)}>People</NewChat>
        <NewGroup onClick={() => setGroup(true)}>Groups</NewGroup>
      </ButtonGroup>

      {/* This is where list of chats live. */}
      {group
        ? groupSnapshot?.docs.map((group, index) =>
            index % 2 == 0 ? (
              <>
                <Chat
                  key={index}
                  id={group.id}
                  users={["", ""]}
                  groupName={group.data().groupName}
                  groupURL={group.data().photoURL}
                  color="#fffcad"
                />
                <Divider />
              </>
            ) : (
              <>
                <Chat
                  key={index}
                  id={group.id}
                  users={["", ""]}
                  groupName={group.data().groupName}
                  groupURL={group.data().photoURL}
                  color="#dab5ff"
                />
                <Divider />
              </>
            )
          )
        : chatsSnapshot?.docs.map((chat, index) =>
            index % 2 == 0 ? (
              <>
                <Chat
                  key={index}
                  id={chat.id}
                  users={chat.data().users}
                  groupName={""}
                  groupURL={""}
                  isActive={Router.asPath == `/chat/${chat.id}` ? true : false}
                  color="#dab5ff"
                />
                <Divider />
              </>
            ) : (
              <>
                <Chat
                  key={index}
                  id={chat.id}
                  users={chat.data().users}
                  groupName={""}
                  groupURL={""}
                  color="#fffcad"
                  isActive={Router.asPath == `/chat/${chat.id}` ? true : false}
                />
                <Divider />
              </>
            )
          )}

      <Footer>
        <p>
          {new Date().getFullYear()} &copy;{" "}
          <a href="https://sid-thakur.vercel.app">Sid Thakur</a>
        </p>
      </Footer>
    </Container>
  );
}

export default Sidebar;

//styled components
const Container = styled.div`
  display: ${(props) => (props.display === "inline" ? "inline" : "none")};
  flex: 1;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 370px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 768px) {
    flex-direction: column;
    min-width: 100%;
  }
`;

const Search = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;

  &&& {
    border-color: #0fa;
  }
`;

const ButtonDiv = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 370px;
  height: 50px;
  font-weight: 300;
  border-top: solid 1px lightgray;
  text-align: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const NewChat = styled(Button)`
  width: 80%;
  /* Make sheeit important */
  &&& {
    margin-bottom: 10px;
    :hover {
      //background-color: rgba(253, 231, 76, 0.8);
      background: #7affd3;
    }
  }
`;
const NewGroup = styled(Button)`
  width: 80%;
  /* Make sheeit important */
  &&& {
    margin-bottom: 10px;
    :hover {
      //background-color: rgba(253, 231, 76, 0.8);
      background: #fffcad;
    }
  }
`;
