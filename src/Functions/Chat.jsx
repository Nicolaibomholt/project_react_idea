import { firestore } from '../providers/firebase'
import { UserContext } from "../providers/UserProvider";
import React, { useState, useContext, useEffect, useRef } from "react";
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
    const {displayName, uid } = user;
    const [progressCounter, setProgressCounter] = useState(0);
    const [processTitle, setProcessTitle] = useState("Chatten");
    const [chatRoomName, setChatRoomName] = useState("");
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([{}]);
    const [usersInSelectedChatRoom, setUsersInSelectedChatRoom] = useState([{}]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [myChatRooms, setMyChatRooms] = useState();
    const chatRoomRef = firestore.collection("chatrooms");
    const userSubCol = [];

    const [options, setOptions] = useState([
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
    ])

    const getFriends = async () => {
        try {
            const friendsCollection = await firestore.collection("/users/" + user.uid + "/friends").get();
            friendsCollection.forEach(doc => {
                tempFriendList.push({ label: doc.data().searchResult.displayName, value: doc.id });
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
        const unsubscribe = chatRoomRef.doc(processTitle).collection("messages").onSnapshot(onSnapshot => {

        })

        unsubscribe();
        setProcessTitle("Chatten");
    }


    const loadChatRoom = async (index, array) => {
        if (index >= array.length) {
            setMyChatRooms(userSubCol);
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

        const allChatRooms = await chatRoomRef.get();
        try {
            allChatRooms.forEach(doc => {
                testArray.push(doc);
            });

            loadChatRoom(0, testArray);


        } catch (error) {

        }
    }

    const selectChatRoom = async (chatroomId) => {
        let tempMessages = [];
        setProgressCounter(null);
        setProcessTitle(chatroomId);
        const subref = await chatRoomRef.doc(chatroomId).collection("messages").orderBy("created", "asc").onSnapshot(onSnapshot => {
            onSnapshot.forEach(message => {
                tempMessages.push(message.data());
            })

            setMessageList(tempMessages);
            tempMessages = [];
        });
        
        getParticipantsInRoom(chatroomId);
    }

    const getParticipantsInRoom = async (chatroomId) => {
        try {
            const usersInRoom = await chatRoomRef.doc(chatroomId).collection("users").get();
            usersInRoom.forEach(user => {
                tempFriendList.push(user.data());
            });
            setUsersInSelectedChatRoom(tempFriendList);
        } catch (error) {

        }
    }

    const createRoomWithFriends = async () => {
        let tempFriendsListWithSelf = [{ label: displayName, value: uid }];
        try {
            
            selectedOption.forEach(element => {
                tempFriendsListWithSelf.push({label: element.label, value: element.value});
            });
            await tempFriendsListWithSelf.forEach(friend => {
                const setFriendsIndRoom = firestore.collection("chatrooms").doc(chatRoomName).collection("users").doc(friend.value).set({ name: friend.label });

            })
            setProgressCounter(0)
            getMyChatRooms();

        } catch (error) {

        }
    }

    useEffect(() => {
        getFriends();
        getMyChatRooms();
    }, [])

    const sendMessage = async () => {
        await chatRoomRef.doc(processTitle).collection("messages").add({ name: displayName, uid: uid, message: message, created: new Date() });
        setMessage("");

    }

    const handleEnter = (e) => {
        if (e.keyCode == 13) {
            sendMessage();
        }
    }
    
    const addFriendToChat = async () => {
        await chatRoomRef.doc(processTitle).collection("users").doc(selectedOption.value).set({name: selectedOption.label});
        getParticipantsInRoom(processTitle);
        setSelectedOption(null);
    }
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
                <div style={{ position: "absolute", bottom: '0', right: '0' }}>
                    <h2>Select a room to chat in:</h2>
                    {myChatRooms && myChatRooms.map((chatroom) => {
                        return (
                            <div>
                                <button key={chatroom.id} onClick={() => selectChatRoom(chatroom.id)}>{chatroom.id}</button>
                            </div>
                        )
                    })}
                </div>
                {progressCounter === null && <div style={{ position: "absolute", top: '0', right: '0' }}><button onClick={() => cancel()}>Back</button></div>}

                {progressCounter === null &&
                    <div style={{ position: "absolute", bottom: '0', left: '0' }}>
                        <h2>People in this</h2>
                        {usersInSelectedChatRoom.map((userInRoom) => {
                            return (
                                <div><p>{userInRoom.name}</p></div>
                            )
                        })}
                    </div>
                }

                {progressCounter === null &&
                    <div>
                        <div style={{ height: '500px', maxHeight: '500px', overflow: "auto", margin: "auto", width: '50%' }}>
                            {messageList && messageList.map((message) => {
                                if (message.uid === uid) {
                                    return (
                                        <div style = {{marginLeft: '50%'}}>
                                            <label style={{ fontSize: '10px', marginLeft: '5px' }}>½</label>
                                            <p style = {{background: 'dodgerblue', borderRadius: '20px', borderStyle: "solid", borderWidth: '1px'}}>{message.message}</p>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div style = {{marginRight: '50%'}}>
                                            <label style={{ fontSize: '10px', marginLeft: '5px' }}>{message.name}</label>
                                            <p style = {{background: 'dodgerblue', borderRadius: '20px', borderStyle: "solid", borderWidth: '1px'}}>{message.message}</p>
                                        </div>
                                        )
                                }
                            })}
                        <ScrollComponent></ScrollComponent>
                        
                        <div style={{color: "black", position: 'absolute', left: '0', top: '45%'}}>
                        <p style = {{color: "white"}}>Add friend to chat</p>
                            <Select
                                defaultValue={selectedOption}
                                onChange={setSelectedOption}
                                   options={options}
                            />
                            <button style={{ background: 'white', padding: '10px', color: 'black', marginLeft: '10px' }} onClick={() => addFriendToChat()}>Add</button>
                        </div>
                        
                        </div>
                        <input onKeyDown = {handleEnter} value={message} style={{ color: "black", marginTop: '10px', padding: "10px" }} onChange={e => setMessage(e.target.value)}></input><button onClick={() => sendMessage()} style={{ background: 'white', padding: '10px', color: 'black', marginLeft: '10px' }}>Send</button>
                    </div>
                }

            </div>
        </div>
    )

}

const ScrollComponent = () => {
    const divRef = useRef(null);
  
    useEffect(() => {
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    });
  
    return <div ref={divRef} />;
  }


export default Chat