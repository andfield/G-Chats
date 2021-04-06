import styled from "styled-components"
import {Avatar, IconButton, Button, Tooltip, TextField, InputAdornment} from "@material-ui/core"
import ChatIcon from "@material-ui/icons/Chat"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import SearchIcon from "@material-ui/icons/Search"
import {auth, db} from "../firebase"
import * as EmailValidator from "email-validator"
import {useAuthState} from "react-firebase-hooks/auth"
import {useCollection} from "react-firebase-hooks/firestore"
import Chat from "../components/Chat"
import {useState} from "react"
import SearchBar from "./Search"

function Sidebar() {
  //Get user from use auth state.
  const [user]=useAuthState(auth)

  // Function to check if the reciepent email has an account.
  const hasAnAccount=async (reciepentEmail) => {
    const snapshot=await db
      .collection("users")
      .where("email", "==", reciepentEmail)
      .get()
    if (!snapshot.empty) {
      console.log("Came here")
      return true
    }
    return false
  }

  //Create a irl chat reference to the db using firebase hooks.
  const userChatRef=db
    .collection("chats")
    .where("users", "array-contains", user.email)
  const [chatsSnapshot]=useCollection(userChatRef)

  //Function to create new chat.
  const createChat=async () => {
    //Prompt user to get an email.
    const input=prompt(
      "Please enter an email of the user you want to chat with."
    )

    if (!input) return null

    //Check if the email is valid
    if (
      EmailValidator.validate(input)&&
      !chatAlreadyExists(input)&&
      input!==user.email
    ) {
      if ((await hasAnAccount(input))==true) {
        // If email is valid and the chat doesnt exists push to DB Chats collection.
        db.collection("chats").add({
          //adding email for now but try using name later.
          users: [user.email, input],
        })
      } else alert("User does not exist")
    } else alert("Invalid user please check if a chat already exists.")
  }

  //Function to check if the chat already exists.
  const chatAlreadyExists=(reciepentEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user===reciepentEmail)?.length>0
    )

  //Function to create new chat room.

  return (
    <Container>
      <Header>
        <Tooltip title="Logout">
          <UserAvatar onClick={() => auth.signOut()} src={user.photoURL} />
        </Tooltip>
        <UName>{user.displayName}</UName>
        <IconsContainer>
          <IconBtn onClick={createChat}>
            <ChatIcon />
          </IconBtn>
          <IconBtn>
            <MoreVertIcon />
          </IconBtn>
        </IconsContainer>
      </Header>

       <Search>

       <SearchBar uEmail={user.email}/>
      
      </Search> 

      <SidebarButton onClick={createChat} variant="outlined" >Star a new chat</SidebarButton>

      {/* This is where list of chats live. */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  )
}

export default Sidebar

//styled components
const Container=styled.div`
  flex: 1;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 540px){
    display: flex;
    flex-direction: column;
    min-width: 100%;
  }
`

const Header=styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background: #7261A3;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`

const UserAvatar=styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

const IconsContainer=styled.div`
  display: flex;
  justify-content: space-between;
`

const Search=styled.div`
  
  padding: 20px;
`

const SidebarButton=styled(Button)`
  width: 100%;
  /* Make sheeit important */
  &&&{
    margin-bottom: 10px;
    :hover{
    background-color: rgba(253, 231, 76, 0.8);
  
  }
  }
  
`

const UName=styled.h1`
  font-size: 1.2em;
  color: white;
  margin-left: -30px;
`

const IconBtn=styled(IconButton)`
  
  &&& {
    color: white;
    padding: 6px;
  }

`
