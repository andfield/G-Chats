import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import moment from "moment";

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);

  //Determine who is sender or reciever.
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;

  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <TimeStamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </TimeStamp>
      </TypeOfMessage>
    </Container>
  );
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #fffcad;
`;
const Reciever = styled(MessageElement)`
  margin-left: left;
  background-color: whitesmoke;
`;

const TimeStamp = styled.span`
  color: grey;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
