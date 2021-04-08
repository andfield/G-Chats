import { Avatar, Hidden } from "@material-ui/core";
import { ArrowBackIos } from "@material-ui/icons";
import styled from "styled-components";
import { db, auth } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import {useState, useEffect} from "react"

function GroupScreen({ group, messages }) {
  //Assign router.
  const router = useRouter();

  //States
  const [userNames, setUserNames] = useState();
  

  //Fetch all the messages for the group.
  const [messagesSnapshot] = useCollection(
    db
      .collection("groups")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  // Fetch all the users of the group
//   const [usersSnapshot] = useCollection(
//       db.
//         .collection("")
//   
    const [users] = group.users.forEach( (user) => (useCollection(db.collection("users".where("email", "==", user))))

  useEffect(() => {
     group.users.forEach( user => {
         method1(user)
     })
  }, [])

const method1 = async (email) => {
    const [user] = useCollection(db.collection("users").where("email", "==", email))
    
    user.docs.map((user) => {
        setUserNames(...userNames, user.data().name)
    })
}

  return (
    <Container>
      <Header>
        <Hidden mdUp>
          <ArrowBackIos
            onClick={() => router.push("/")}
            style={{ marginRight: "5px" }}
          />
        </Hidden>
        {group.photoURL ? (
          <Avatar src={group.photoURL} />
        ) : (
          <Avatar>{group.groupName[0]}</Avatar>
        )}
        <HeaderInfo>
          <h3>{group?.groupName}</h3>
          {
              console.log(userNames)
          }
        </HeaderInfo>
      </Header>
    </Container>
  );
}

export default GroupScreen;

const Container = styled.div`
  flex: 1;
`;
const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  align-items: center;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: grey;
  }
  @media (max-width: 1024px) {
    > p {
      margin-top: 0px;
    }
  }
  @media (max-width: 540px) {
    > p {
      font-size: 0.8em;
    }
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #edd6ff;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  border: 0.1em solid black;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;

const InputContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const MainInput = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;
