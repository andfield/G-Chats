import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import getReciepectEmail from "../utils/getReciepentEmail";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Chat({ id, users }) {
  const [user] = useAuthState(auth);

  const reciepentEmail = getReciepectEmail(users, user);
  
  return (
    <Container>
      <UserAvatar />
      <p>{reciepentEmail}</p>
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
