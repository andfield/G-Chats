import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import Fade from "react-reveal/Fade";
import { IconButton, Menu, MenuItem, Avatar, Hidden } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ArrowBackIos from "@material-ui/icons/ArrowBack";
import { useState } from "react";
import { useRouter } from "next/router";

function Header() {
  //Get user from use auth state.
  const [user] = useAuthState(auth);

  //States.
  const [menuToggle, setMenuToggle] = useState(null);
  const [name, setName] = useState("none");

  //router initiallization.
  const Router = useRouter();

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

  return (
    <div>
      <HeaderContainer
        onMouseEnter={() => setName("inline")}
        onMouseLeave={() => setName("none")}
      >
        <UserAvatar src={user.photoURL} onClick={() => Router.push("/")} />

        <Fade cascade when={name === "inline"}>
          <UName className="title" style={{ display: name }}>
            {user.displayName.charAt(0).toUpperCase() +
              user.displayName.slice(1)}
          </UName>
        </Fade>

        <IconsContainer>
          <IconBtn onClick={createChat} size={"small"}>
            <ChatIcon style={{fontSize: 25}}/>
          </IconBtn>
          <IconBtn onClick={(e) => setMenuToggle(e.currentTarget)}>
            <MoreVertIcon style={{fontSize: 25}}/>
          </IconBtn>
          <Menu
            style={{ marginTop: "50px", marginRight: "50px" }}
            id="menu"
            anchorEl={menuToggle}
            keepMounted
            open={Boolean(menuToggle)}
            onClose={() => setMenuToggle(null)}
          >
            <MenuItem onClick={() => auth.signOut()}>Logout</MenuItem>
            <MenuItem>T&C</MenuItem>
          </Menu>

          {Router.pathname === "/" ? null : (
            <BackBtn onClick={() => changeStatus(!drawerStatus)}>
              <ArrowBackIos />
            </BackBtn>
          )}
        </IconsContainer>
      </HeaderContainer>
    </div>
  );
}

export default Header;

const HeaderContainer = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #7916dd;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  transition: transform 0.5s;

  :hover {
    transform: scale(1.3);
  }
`;

const UName = styled.h1`
  &&& {
    font-size: 1.6em;
    align-self: center;
    letter-spacing: 0.15em;
    color: white;
    margin-left: 5px;
  }
`;
const IconBtn = styled(IconButton)`
  &&& {
    color: white;
    padding: 2.2px;
  }
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const BackBtn = styled(IconButton)`
  &&& {
    color: white;
    padding: 6px;

    @media (min-width: 768px) {
      display: none;
    }
  }
`;
