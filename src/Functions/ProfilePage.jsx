import React, { useContext, useState, useEffect  } from "react";
import { UserContext } from "../providers/UserProvider";
import { navigate } from "@reach/router";
import MenuContainer from './MenuContainer'
import {auth, firestore} from "../providers/firebase";
const ProfilePage = () => {
  const user = useContext(UserContext);
  const {photoURL, displayName, email, uid} = user;
  const [showFriends, setShowFriends] = useState(true);
  const [searchMessage, setSearchMessage] = useState("Add friend by ID");
  const [idInputField, setIdInputFiel] = useState("")
  const [friendstList, setFrinedsList] = useState([{}]);
  const tempFriendList = [];

  const [searchResult, setSearchResult] = useState({});
  

  const searchForFriend = async () => {
      try {
        const friend = await firestore.doc("/users/" + idInputField).get().then();

        if (friend.data() != undefined) {
            setSearchResult(friend.data());
            setShowFriends(false);
        }
        else {
            setSearchMessage("Friend not found");
        }
        
      } catch (error) {
          //setSearchMessage("Friend not found")
      } 
  }

  const addFriend = async () => {
    console.log("friend added..");
    try {
        const addFriend = await firestore.collection("/users/" + user.uid +"/friends").doc(idInputField).set({searchResult}); 
        getFriends().then(setShowFriends(true));
        
    } catch (error) {
        console.log(error);
    }
  }

  const getFriends = async () => {
      try {
          const friendsCollection = await firestore.collection("/users/" + user.uid +"/friends").get();
        friendsCollection.forEach(doc => {
            tempFriendList.push({displayName: doc.data().searchResult.displayName, email: doc.data().searchResult.email, id: doc.id});
            //tempFriendList.push(doc.data().searchResult, {id: doc.id});
            console.log(doc.id);
        });
        setFrinedsList(tempFriendList);
        console.log(tempFriendList);
      } catch (error) {
          console.log(error);
      }
  }

  useEffect(() => {
    getFriends();
  }, [])

  return (
      <div>
    <div className = "mx-auto w-11/12 md:w-2/4 py-8 px-4 md:px-8" style= {{float: 'right', color: "white"}}> 
      <div className="flex border flex-col items-center md:flex-row md:items-start border-blue-400 px-3 py-4" style = {{textAlign: 'end'}}>
        <div
          style={{
            background: `url(${photoURL || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png'})  no-repeat center center`,
            backgroundSize: "cover",
            height: "200px",
            width: "200px"
          }}
          className="border border-blue-300"
        ></div>
        <div className = "md:pl-4">
        <h2 className = "text-2xl font-semibold">{displayName}</h2>
        <h3 className = "italic">{email}</h3>
        <h3 className = "bold"><b>ID:</b> {uid}</h3>
        </div>
      </div>
      {showFriends && <h2 className = "text-2xl font-semibold">Friends</h2>}
      {showFriends && friendstList.map(friend => {
          return(
            <div style = {{marginBottom: '20px', borderWidth: 'thin', padding: '5px', borderRadius: '25px'}}>Name: {friend.displayName} <br/> Mail: {friend.email}</div>
          )
      })}
      {showFriends &&
      <div>
      <h2 className = "text-2xl font-semibold">{searchMessage}</h2>
      <input style ={{padding: '10px', color: "black"}} placeholder="Your friends ID" onChange = {e => setIdInputFiel(e.target.value)}>
      </input>
      <button style ={{background: 'white', float: 'right', padding: '10px', color: "black"}} onClick ={() => searchForFriend()}>Search</button>
      </div>
}
        {!showFriends &&
      <div>
      <h2 className = "text-2xl font-semibold">Friend found</h2>   
      <div style = {{marginBottom: '20px', borderWidth: 'thin', padding: '5px', borderRadius: '25px'}}>Name: {searchResult.displayName} <br/> Mail: {searchResult.email}</div>
      <button style ={{background: 'white', marginLeft: '0px', padding: '10px', color: "black"}} onClick ={() => setShowFriends(true)}>Search again</button>
      <button style ={{background: 'white', float: 'right', padding: '10px', color: "black"}} onClick = {() => addFriend()}>Add friend</button>
      </div>
      }


      <button className = "w-full py-4 bg-red-600 mt-5 text-white" style={{button: '0'}} onClick = {() => {auth.signOut()}}>Sign out</button>
    </div>
    </div>
  ) 
};

export default ProfilePage;