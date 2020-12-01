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
        <ProfilePage path = "/base">
        </ProfilePage>
        <About path = "/About"></About>
        <Chat path = "/Chat"></Chat>
        </Router>
      :
        <Router>
          <SignUp path="/base/signUp" />
          <SignIn path="/base" />
          <PasswordReset path = "/base/passwordReset" />
        </Router>
      
  );
}

export default Application;