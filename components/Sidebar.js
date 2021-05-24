import styled from "styled-components";
import Header from "./Header"
import {
  Button,
  ButtonGroup,
  Divider,
} from "@material-ui/core";

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
import { useRouter } from "next/router";

function Sidebar() {
  //Get user from use auth state.
  const [user] = useAuthState(auth);

  //router initiallization.
  const Router = useRouter();

  //Get the display status from drawer context.
  const { drawerStatus, changeStatus } = useContext(DrawerContext);

  // //States.
  // const [menuToggle, setMenuToggle] = useState(null);
  // const [name, setName] = useState("none");

  //Group visible state.
  const [group, setGroup] = useState(false);

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
      <Header />
      <Search>
        <SearchBar uEmail={user.email} style={{ width: "200px" }} />
      </Search>

      {/* <ButtonDiv>
        <NewChat onClick={createChat} variant="outlined">
          Star a new chat
        </NewChat>
        <NewGroup onClick={createGroup} variant="outlined">
          Star a new group
        </NewGroup>
      </ButtonDiv> */}

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
                  key={group.index}
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
                  key={group.index}
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
                  key={chat.index}
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
                  key={chat.index}
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
    </Container>
  );
}

export default Sidebar;

//styled components
const Container = styled.div`
  display: ${(props) => (props.display ? "" : "none")};
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
