import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import getReciepectEmail from "../utils/getReciepentEmail";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

function Chat({ id, users, groupName, groupURL, color }) {
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

  //Function to let user Enter specific group.
  const enterGroup = () => {
    router.push(`/group/${id}`);
  };

  return groupName != "" ? (
    <Container onClick={enterGroup} color={color}>
      {groupURL ? (
        <UserAvatar src={groupURL} />
      ) : (
        <UserAvatar>{groupName[0]}</UserAvatar>
      )}
      <p>{groupName}</p>
    </Container>
  ) : (
    <Container onClick={enterChat} color={color}>
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
    background-color: ${(props) => (props.color ? props.color : "#c68cff")};
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
