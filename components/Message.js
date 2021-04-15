import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import moment from "moment";
import { Avatar, Badge } from "@material-ui/core";
import { useState, useEffect } from "react";
// Import the circular menu
import { CircleMenu, CircleMenuItem } from "react-circular-menu";
import "react-circular-menu/styles.css";

//Test Icons
import MailIcon from "@material-ui/icons/Mail";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import MapIcon from "@material-ui/icons/Map";

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);
  const [messageUser, setMessageUser] = useState();

  useEffect(() => {
    db.collection("users")
      .where("email", "==", user)
      .get()
      .then((snapshot) => {
        setMessageUser(snapshot.docs[0].data().photoURL);
      });
  }, [user]);

  //Determine who is sender or reciever.
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;

  return (
    <Container>
      {user != userLoggedIn.email ? (
        <>
          <Icon src={messageUser} />
          <TypeOfMessage>
            {message.message}
            <TimeStamp>
              {message.timestamp
                ? moment(message.timestamp).format("LT")
                : "..."}
            </TimeStamp>
          </TypeOfMessage>
        </>
      ) : (
        <>
          <TypeOfMessage>
            {message.message}
            <TimeStamp>
              {message.timestamp
                ? moment(message.timestamp).format("LT")
                : "..."}
            </TimeStamp>
          </TypeOfMessage>

          <Icon src={messageUser}>
            <ul>
              <li>HELP</li>
              <li>HELP</li>
              <li>HELP</li>
              <li>HELP</li>
            </ul>
          </Icon>

          {/* <CircleMenu
            startAngle={-90}
            rotationAngle={360}
            itemSize={2}
            radius={3}
            rotationAngleInclusive={false}
            
          >
            <CircleMenuItem
              onClick={() => alert("Clicked the item")}
              tooltip="Email"
              tooltipPlacement="right"
            >
              <MailIcon />
            </CircleMenuItem>
            <CircleMenuItem tooltip="Help">
              <HelpOutlineIcon />
            </CircleMenuItem>
            <CircleMenuItem tooltip="Location">
              <MapIcon />
            </CircleMenuItem>
            <CircleMenuItem tooltip="Info">
              <MapIcon />
            </CircleMenuItem>
          </CircleMenu> */}
        </>
      )}
    </Container>
  );
}

export default Message;

const Container = styled.div`
  display: flex;
  align-items: flex-end;
`;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: center;
  max-width: 50%;
  color: black;
  @media (max-width: 540px) {
    max-width: 100%;
  }
`;

const Icon = styled(Avatar)``;

const Sender = styled(MessageElement)`
  margin-left: auto;
  border-radius: 20px 20px 0px 20px;
  background: rgb(85, 18, 235);
  background: linear-gradient(
    to right bottom,
    rgba(85, 18, 235, 1) 0%,
    rgba(143, 18, 235, 1) 100%
  );
  color: white;
`;
const Reciever = styled(MessageElement)`
  margin-left: left;
  border-radius: 20px 20px 20px 0px;
  background-color: #f0f8fe;

  > span {
    color: black;
  }
`;

const TimeStamp = styled.span`
  color: white;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
