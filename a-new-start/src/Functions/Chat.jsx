import {firestore} from '../providers/firebase'
import { UserContext } from "../providers/UserProvider";
import React, { useState, useContext, useEffect } from "react";

const Chat = () => {
const user = useContext(UserContext);

    return (
        <div style = {{float: 'right', width: '75%', textAlign: 'center'}}>
            <h1 style = {{fontSize: '50px'}}>Chatten</h1>
            <p>
                Dette er et test projekt, hvor jeg vil forsøge at lave nogle forskellige ting, <br/> en chat og nogle sjove map funktionaliteter
            </p>
        </div>
    )
    
}
export default Chat