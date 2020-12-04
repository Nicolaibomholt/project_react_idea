import React, { useEffect, useState, useContext } from "react";
import { firestore } from '../providers/firebase'
import { UserContext } from "../providers/UserProvider";
import Select from 'react-select';
import { Spinner, Button } from 'react-bootstrap';



export default function MapGame() {
    const chatRoomRef = firestore.collection("chatrooms");
    const user = useContext(UserContext);
    const { displayName, uid } = user;
    const [loading, setLoading] = useState(false);
    const [myChatRooms, setMyChatRooms] = useState([{}]);
    const userSubCol = [];


    const loadChatRoom = async (index, array) => {
        if (index >= array.length) {
            setMyChatRooms(userSubCol);
            setLoading(false);
        } else {
            const chatRoom = array[index];
            let subCollection = await chatRoomRef.doc(chatRoom.id).collection("users").get();
            subCollection.forEach(subColDoc => {
                if (subColDoc.id == user.uid) {
                    userSubCol.push({ id: chatRoom.id })
                }
            });
            index++;
            loadChatRoom(index, array);
        }
    }

    const getMyChatRooms = async () => {
        const testArray = []
        setLoading(true);
        const allChatRooms = await chatRoomRef.get();
        try {
            allChatRooms.forEach(doc => {
                testArray.push(doc);
            });
            loadChatRoom(0, testArray);

        } catch (error) {

        }
    }

    useEffect(() => {
        getMyChatRooms();
    }, []) 

    const selectGameRoom = (chatroom) => {
        console.log(chatroom);
    }

    return (
        <div style={{ float: 'right', width: '100%', textAlign: 'center', color: 'white' }}>
            {loading &&
             <Spinner animation="border" style = {{width: '75px', height: '75px', position: "absolute", top: '40%', right: '50%'}}/>
            }
            
            <div>
            <h1 style={{ fontSize: '50px' }}>Pick a chatroom to start</h1>
            {!loading && 
            <div style = {{margin: "auto", maxWidth: "fit-content"}}>
            {myChatRooms && myChatRooms.map((chatroom => {
               return(
                   <div style = {{display: "flex"}}>
                       <Button onClick = {() => selectGameRoom(chatroom)}>{chatroom.id}</Button>
                   </div>
               ) 
            }))}
            </div>
            }
            </div>
        </div>

    )

}