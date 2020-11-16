import React, { useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "./Functions/SignIn";
import SignUp from "./Functions/SignUp";
import Application from "./Application";
import UserProvider from "./providers/UserProvider";
import ProfilePage from "./Functions/ProfilePage";
import { UserContext } from "./providers/UserProvider";
import MenuContainer from "./Functions/MenuContainer";
function App() {
  const user = useContext(UserContext);
  return (
    <UserProvider>
      <MenuContainer user = {user}></MenuContainer>
      <Application />
    </UserProvider>
  );
}

export default App;