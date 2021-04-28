import styled from "styled-components"
import AsyncSelect from "react-select/async"
import {useRouter} from "next/router"
import {db} from "../firebase"
import {useState} from 'react'
import {Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Button} from '@material-ui/core'

function SearchBar({uEmail}) {
  //Router
  const router=useRouter()

  //States
  const [open, setOpen]= useState(false)

  //Function to query in DB and select all the fields which match the search input.
  const loadOptions=async (inputValue) => {
    return new Promise((resolve) => {
      db.collection("users")
        .orderBy("name")
        .startAt(inputValue)
        .endAt(inputValue+"\uf8ff")
        .get()
        .then((docs) => {
          if (!docs.empty) {
            let options=[]
            docs.forEach((user) => {
              const val={
                value: user.data().email,
                label: user.data().name,
              }
              options.push(val)
            })
            return resolve(options)
          } else {
            return resolve([])
          }
        })
    })
  }

  //Function to redirect to chat screen
  const openChat=async (name) => {
    const email=name.value
    console.log(email)
    //If the selected name has a Chat with user ? redrict to the chat else open dialog asking user if they want to start a chat with choosen user.  
    if (email != uEmail) {
      const chat = await db
        .collection("chats")
        .where("users", "array-contains", email)
        .get()
      chat.docs.map((doc) => {
        if (doc.data().users.includes(uEmail)) {
          router.push(`/chat/${doc.id}`)
        }
        else {
          //Open dialog here
          setOpen(!open)
          console.log(open)
          console.log(email)
        }
      })
    }
    else {
      alert("Can't chat with yourself G")
    }
  }

  return (
    <>
      <Select
        loadOptions={loadOptions}
        onChange={openChat}
        placeholder="Search"
      />
      <Dialog open={open} aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button  color="primary" onClick={() => setOpen(false)}>
            Disagree
          </Button>
          <Button color="primary" autoFocus onClick={() => }>
            Agree
          </Button>
        </DialogActions>

      </Dialog>

    </>
  )
}

export default SearchBar

const Select=styled(AsyncSelect)`
  &&& {
    width: 90%;
  }
`
