import React, { createContext, useReducer } from "react";
import { NotificationReducers } from "../Reducers/NotificationReducers";

//Create and export a Notification Context.
export const NotificationContext = createContext();

//Intiate a React state to store all the notifications.
const initialState = { notifications: "try" };

//Initiate a context provider which will make this context globally available.
const NotificationContextProvider = ({ children }) => {
  //Initiate reduceres for the context.
  const [state, dispatch] = useReducer(NotificationReducers, initialState);

  // Reducers cases
  const getAllNotifications = (payload) => {
    dispatch({ type: "GET_ALL", payload });
  };
  const getChatNotifications = (payload) => {
    dispatch({ type: "GET_CHAT_NOTIFICATION", payload });
  };
  const getGroupNotifications = (payload) => {
    dispatch({ type: "GET_GROUP_NOTIFICATION", payload });
  };
  const deleteCurrentNotification = (payload) => {
    dispatch({ type: "DELETE_NOTIFICATION", payload });
  };
  const deleteAllNotifications = (payload) => {
    dispatch({ type: "DELETE_ALL", payload });
  };

  //Bundle context values to provide.
  const contextValues = {
    getAllNotifications,
    getChatNotifications,
    getGroupNotifications,
    deleteAllNotifications,
    deleteCurrentNotification,
    ...state,
  
  
  };

  //Return the notification context provider.
  return (
    <NotificationContext.Provider value={contextValues}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;
