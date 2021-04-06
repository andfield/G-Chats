import styled from "styled-components";
import AsyncSelect from "react-select/async";
import {useRouter} from "next/router"
import { db } from "../firebase";
import {useCollection} from "react-firebase-hooks/firestore"

function Search({uEmail}) {
  //Router
  const router = useRouter()


  //Function to query in DB and select all the fields which match the search input.
  const loadOptions = async (inputValue) => {
    return new Promise((resolve) => {
     db.collection("users")
        .orderBy("name")
        .startAt(inputValue)
        .endAt(inputValue + "\uf8ff")
        .get()
        .then((docs) => {
          if (!docs.empty) {
            let options = [];
            docs.forEach((user) => {
              const val = { 
                  value: user.data().email,
                  label: user.data().name,
              }
              options.push(val);
            });
            return resolve(options);
          } else {
            return resolve([]);
          }
        });
    });
  };

  //Function to redirect to chat screen
  const openChat = async (name) => {
      const email = name.value
      const chat =  await db.collection("chats").where("users", "array-contains", [email, uEmail]).get()
        console.log(chat);
    

  }

  return (
    <>
      <AsyncSelect loadOptions={loadOptions}  onChange={openChat}/>
    </>
  );
}

export default Search;
