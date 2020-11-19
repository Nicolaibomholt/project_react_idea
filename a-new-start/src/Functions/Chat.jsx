import { firestore } from '../providers/firebase'
import { UserContext } from "../providers/UserProvider";
import React, { useState, useContext, useEffect } from "react";
import Select from 'react-select';

/*
progress counter:
0 = start
1 = add friends
2 = Confirm
*/

const Chat = () => {
    const tempFriendList = [];

    const user = useContext(UserContext);
    const { photoURL, displayName, email, uid } = user;
    const [friendList, setFrinedsList] = useState([{}]);
    const [progressCounter, setProgressCounter] = useState(0);
    const [processTitle, setProcessTitle] = useState("Chatten");
    const [chatRoomName, setChatRoomName] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [myChatRooms, setMyChatRooms] = useState();
    const chatRoomRef = firestore.collection("chatrooms");
    const userSubCol = [];

    const [options, setOptions] = useState([
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ])




    const convertStringsLexographical = (user1, user2) => {
        var roomName = 'chat_' + (user1 < user2 ? user1 + '_' + user2 : user2 + '_' + user1);
        return roomName
        /*  for (let index = 0; index < users.length; index++) {
             const element = users[index];
         } */
    }
    const getFriends = async () => {
        try {
            const friendsCollection = await firestore.collection("/users/" + user.uid + "/friends").get();
            friendsCollection.forEach(doc => {
                tempFriendList.push({ label: doc.data().searchResult.displayName, value: doc.id });

                //tempFriendList.push(doc.data().searchResult, {id: doc.id});
            });
            setOptions(tempFriendList);
            console.log(tempFriendList);
        } catch (error) {
            console.log(error);
        }
    }

    const createChatRoomAndGoNext = async () => {
        try {
            const setRoom = await firestore.collection("chatrooms").doc(chatRoomName).set({ name: chatRoomName });
            setProgressCounter(1);

        } catch (error) {
            console.log(error);
        }

    }

    const openConfirmWindow = () => {
        setProgressCounter(2);
    }

    const cancel = () => {
        setProgressCounter(0);
    }

    const func = () => {
        console.log(userSubCol);
    }

    const loadChatRoom = async (index, array) => {
        console.log(index);
        if (index >= array.length) {
            console.log(userSubCol);
            setMyChatRooms(userSubCol);
        } else {
            const chatRoom = array[index];
            let subCollection = await chatRoomRef.doc(chatRoom.id).collection("users").get();
            subCollection.forEach(subColDoc => {
                if (subColDoc.id == user.uid) {
                    userSubCol.push(chatRoom.id)
                }
            });
            index++;
            loadChatRoom(index, array);
        }


    }

    const getMyChatRooms = async () => {
        const testArray = []
        
        const allChatRooms = await chatRoomRef.get();
        try {
            allChatRooms.forEach(doc => {
                testArray.push(doc);
            });

            loadChatRoom(0, testArray);
            /* 
                        allChatRooms.forEach(async doc => {
                            let subCollection = await chatRoomRef.doc(doc.id).collection("users").get()
                            subCollection.forEach(subColDoc => {
                                if (subColDoc.id == user.uid) {
                                    userSubCol.push({ id: doc.id });
                                    console.log(userSubCol);
            
                                }
                            });
                        }); */

        } catch (error) {

        }
    }



    const createRoomWithFriends = async () => {
        try {
            await selectedOption.forEach(element => {
                const setFriendsIndRoom = firestore.collection("chatrooms").doc(chatRoomName).collection("users").doc(element.value).set({ name: element.label });
            });

            //setFriendsIndRoom.collection("users").add(selectedOption);
        } catch (error) {

        }
    }

    useEffect(() => {
        console.log(user.uid);
        getFriends();
        getMyChatRooms();
    }, [])
    return (
        <div style={{ float: 'right', width: '100%', textAlign: 'center', color: 'white' }}>
            <h1 style={{ fontSize: '50px' }}>{processTitle}</h1>

            {progressCounter === 0 &&
                <div>
                    <p>
                        Begin by entering in a chatroom name
                    </p>
                    <input placeholder="Chatroom name" style={{ padding: '10px', marginRight: '10px', color: 'black' }} onChange={e => setChatRoomName(e.target.value)}></input>
                    <button style={{ background: 'white', padding: '10px', color: 'black' }} onClick={() => createChatRoomAndGoNext()}>Next</button>
                    {myChatRooms && myChatRooms.map((index, chatroom) => {
                        return (
                            <h2 key={index}>{"chatroom"}</h2>
                        )
                    })}
                </div>
            }
            <div>

                {progressCounter === 1 &&
                    <div>
                        <p>Choose friends</p>
                        <div style={{ width: '50%', margin: 'auto', color: "black" }}>
                            <Select
                                defaultValue={selectedOption}
                                onChange={setSelectedOption}
                                options={options}
                                isMulti={true}

                            />
                            <button style={{ background: 'white', padding: '10px', color: 'black', marginRight: '10px' }} onClick={() => cancel()}>Cancel</button>
                            <button style={{ background: 'white', padding: '10px', color: 'black', marginLeft: '10px' }} onClick={() => openConfirmWindow()}>Next</button>
                        </div>
                    </div>
                }

                {progressCounter === 2 && <div>
                    <h1>Roomname: {chatRoomName}</h1>
                    <h2>Chosen friends:</h2>

                    {selectedOption && selectedOption.map(option => {
                        return (
                            <div>
                                <h3>{option.label}</h3>
                            </div>
                        )
                    })
                    }
                    <button style={{ background: 'white', padding: '10px', color: 'black', marginRight: '10px' }} onClick={() => cancel()}>Cancel</button>
                    <button style={{ background: 'white', padding: '10px', color: 'black' }} onClick={() => createRoomWithFriends()}>Confirm and create room</button>
                </div>
                }
            </div>
        </div>
    )

}
export default Chat