import React, { useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "./Functions/SignIn";
import SignUp from "./Functions/SignUp";
import Application from "./Application";
import UserProvider from "./providers/UserProvider";
import ProfilePage from "./Functions/ProfilePage";
import { UserContext } from "./providers/UserProvider";
import MenuContainer from "./Functions/MenuContainer";
import { Link, navigate } from "@reach/router";

function App() {
  const user = useContext(UserContext);
  const start = () => {
    navigate("/base");
  }
  return (
    
    <UserProvider>
      <button onClick = {() => start()}>Start</button>
      <MenuContainer user = {user}></MenuContainer>
      <Application />
    </UserProvider>
  );
}

export default App;