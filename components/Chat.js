import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import getReciepectEmail from "../utils/getReciepentEmail";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Chat({ id, users }) {
  const router = useRouter();

  const [user] = useAuthState(auth);
  const reciepentEmail = getReciepectEmail(users, user);

  const [reciepentSnapshot] = useCollection(
    db.collection("users").where("email", "==", reciepentEmail)
  );
  
  const reciepent = reciepentSnapshot?.docs?.[0]?.data();

  //Function to let user enter specific chat.
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {reciepent ? (
        <UserAvatar src={reciepent?.photoURL} />
      ) : (
        <UserAvatar>{reciepentEmail[0]}</UserAvatar>
      )}
      <p>{reciepent?.name}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #edd6ff;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
