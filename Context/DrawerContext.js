import React, { createContext, useReducer } from "react";
import { DrawerReducer } from "../Reducers/DrawerReducers";

//Create and export a DrawerContext.
export const DrawerContext = createContext();

//Initiate the Storage, if localStorage has a drawerStatus Parse it to OBJ type and store it else emptyarray
const storage = localStorage.getItem("drawerStatus")
  ? JSON.parse(localStorage.getItem("drawerStatus"))
  : [];

//Initiate a React State to store all the Context related eg. Color
const initialState = { drawerStatus: true };

//Initiate a context provider which will make this context globally excessible
const ContextProvider = ({ children }) => {
  //To connect global files with Reducers and allow the files access to state and actions to perform on state.
  const [state, dispatch] = useReducer(DrawerReducer, initialState);

  //Methods to export to global files hence allowing then access to perform CRUD operations with States.

  //What's Drawer's current status.
  const drawerStatus = (payload) => {
    dispatch({ type: "CURRENT_STATUS", payload });
  };

  //Change Drawer's status.
  const changeStatus = (payload) => {
    dispatch({ type: "CHANGE_STATUS", payload });
  }; 
};
