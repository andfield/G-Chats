import styled from "styled-components";
import Select from "react-select";
import { useRouter } from "next/router";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import firebase from 'firebase'

function SearchBar({ uEmail }) {
  //Router
  const router = useRouter();

  //States
  const [userList, setUserList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [userInput, setUserInput] = useState("");

  // Grouped options
  const groupedOptions = [
    {
      label: "People",
      options: userList,
    },
    {
      label: "Groups",
      options: groupList,
    },
  ];

  //Use effect to get all the data from firebase.
  useEffect(() => {
    function getData() {
      const users = [];
      const groups = [];
      db.collection("users")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((user) => {
            let obj = {
              ["label"]: user.data().name,
              ["email"]: user.data().email,
              ["type"]: "user",
            };
            users.push(obj);
          });
          setUserList(users);
        });

      db.collection("groups")
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((group) => {
            let obj = {
              ["label"]: group.data().groupName,
              ["id"]: group.id,
              ["type"]: "group",
            };
            groups.push(obj);
          });
          setGroupList(groups);
        });
    }
    getData();
  }, []);

  //Handle search changes
  async function handleSearchChange(name) {

    //If searched value is a user find if the current user has a chat with him.
    if (name.type === "user") {
      //check if the selected user is not current user.
      if (name.email != uEmail) {
        //Create a chats ref and find all the chats where the searched user is.
        const chats = await db
          .collection("chats")
          .where("users", "array-contains", name.email)
          .get()
          //If the Searched user has no chat at all.
          if(chats.docs.length < 1){
            createNewChat(name.email)
          }
          
          chats.docs.map(chat => {
            if(chat.data().users.includes(uEmail)){
              router.push(`/chat/${chat.id}`)
            }
            else{
              createNewChat(name.email)
            }
          })
        
        
      }
    }
    //Else search for current user in that specific group.
    else {
      if(name.type === 'group'){
        //Create a groups ref and find the searched group.
        const group = await db
        .collection("groups")
        .doc(name?.id)
        .get()

        //If the user is already in that group just redirect.
        if(group.data().users.includes(uEmail)){
          router.push(`/group/${name?.id}`)
        }

        //Else add them to the group and redirect.
        addUserToGroup(name?.id)
      }
    }
  }

  //Create new Chat
  function createNewChat(email){

    db.collection("chats").add({
      users: [uEmail, email]
    }).then(doc => {
      router.push(`/chat/${doc.id}`)
    })
  }

  //Add current user to a group.
  function addUserToGroup(gid) {

    db.collection("groups").doc(gid).update({
      users: firebase.firestore.FieldValue.arrayUnion(uEmail)
    }).then(() => {
      router.push(`/group/${gid}`)
    })

  }

  
  return (
    <>
      <Search
        options={groupedOptions}
        placeholder="Search to cure boredom..."
        onChange={handleSearchChange}
      />
    </>
  );
}

export default SearchBar;

const Search = styled(Select)`
  &&& {
    width: 90%;
  }
`;
