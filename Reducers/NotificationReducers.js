import { db } from "../firebase";

//Create and export Notification Reducers.
export const NotificationReducers = (state, action) => {
  


  //Get all the Notifications
  if (action.type == "GET_ALL") {
  //  state.state = ['try', 'keep trying']
    return {
        ...state
    }
  }

  //Get all the message Notifications
  if (action.type == "GET_CHAT_NOTIFICATION") {
    console.log("work in progress");
  }

  //Get all the group message Notifications
  if (action.type == "GET_GROUP_NOTIFICATION") {
    console.log("work in progress");
  }

  //Delete a Notification using ID
  if (action.type == "DELETE_NOTIFICATION") {
    console.log("work in progress");
  }

  //Delete all Notifications
  if (action.type == "DELETE_ALL") {
    console.log("work in progress");
  }
};
