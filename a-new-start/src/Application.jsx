import React, { useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "./Functions/SignIn";
import SignUp from "./Functions/SignUp";
import UserProvider from "./providers/UserProvider";
import ProfilePage from "./Functions/ProfilePage";
import { UserContext } from "./providers/UserProvider";
import PasswordReset from "./Functions/PasswordReset";
import About from "./Functions/About";
import Chat from "./Functions/Chat"
import MenuContainer from "./Functions/MenuContainer";
function Application() {
  const user = useContext(UserContext);
  return (
        
        user ?
        <Router>
        <ProfilePage path = "/">
        </ProfilePage>
        <About path = "/About"></About>
        <Chat path = "/Chat"></Chat>
        </Router>
      :
        <Router>
          <SignUp path="signUp" />
          <SignIn path="/" />
          <PasswordReset path = "passwordReset" />
        </Router>
      
  );
}

export default Application;