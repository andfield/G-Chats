import styled from "styled-components"
import {Avatar, IconButton} from "@material-ui/core"
import getReciepectEmail from "../utils/getReciepentEmail"
import {auth, db} from "../firebase"
import {useAuthState} from "react-firebase-hooks/auth"
import {useCollection} from "react-firebase-hooks/firestore"
import {useRouter} from "next/router"
import {useState, useEffect} from "react"
import DeleteIcon from '@material-ui/icons/Delete'


function Chat({id, users, groupName, groupURL, color, isActive}) {

  //Router
  const router=useRouter()

  //States.
  const [touch, setTouch]=useState(false)


  //Current User.
  const [user]=useAuthState(auth)

  //Util to get reciepentEmail
  const reciepentEmail=getReciepectEmail(users, user)

  const [reciepentSnapshot]=useCollection(
    db.collection("users").where("email", "==", reciepentEmail)
  )

  const reciepent=reciepentSnapshot?.docs?.[0]?.data()

  //Function to let user enter specific chat.
  const enterChat=() => {
    router.push(`/chat/${id}`)
  }

  //Function to let user Enter specific group.
  const enterGroup=() => {
    router.push(`/group/${id}`)
  }

  //Function to delete chat.
  const deleteChat = () => {
    // if user was currently on that chat route redrict to home page.
    if(router.asPath == `/chat/${id}`){
      db.collection("chats").doc(id).delete()     
    }
    else{
      db.collection("chats").doc(id).delete()
    }

  }

  return groupName!=""? (
    <Container onClick={enterGroup} color={color}>
      {groupURL? (
        <UserAvatar src={groupURL} />
      ):(
        <UserAvatar>{groupName?.[0]}</UserAvatar>
      )}
      <p>{groupName}</p>
    </Container>
  ):(
    <Container isActive={isActive} color={color} onMouseEnter={() => setTouch(!touch)} onMouseLeave={() => setTouch(!touch)}>
      {reciepent? (
        <UserAvatar src={reciepent?.photoURL} />
      ):(
        <UserAvatar>{reciepentEmail?.[0]}</UserAvatar>
      )}
      <Name onClick={enterChat}>{reciepent?.name}</Name>
      {
        touch && router.asPath != `/chat/${id}`?
          <Delete onClick={deleteChat}>
            <DeleteIcon />
          </Delete>:null
      }
    </Container>
  )
}

export default Chat

const Container=styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  background-color: ${(props) => (props.isActive ? props.color: "white")};
  :hover {
    background-color: ${(props) => (props.color? props.color:"#c68cff")};
  }
`

const UserAvatar=styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`

const Name = styled.p`
  
  &&&{
    transition: transform .2s ease-in-out;
    padding-left: 5px;
  }

  :hover{
    color: white;
    text-shadow: 1px 1px 2px black;
    font-weight: bold;
    transform: scale(1.2);
  }
`;

const Delete=styled(IconButton)`
    &&&{
      margin-left: auto;
      transition: transform .2s;
      z-index: 10;
    }

    :hover{
      transform: scale(1.2);
    }
`