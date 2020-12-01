import React, { useEffect, useState } from "react";
import firebase from '../providers/firebase';


export default function Users() {
    const db = firebase.firestore();
    const userRef = db.collection("users");
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phonenr: ''
    });

    
    useEffect(() => {
       
    }, []);

    const updateInupt = (e) => {
        const { name, value } = e.target;

        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(user);
    }

    const submitUser = (e) => {
        e.preventDefault();
        userRef.add(user).then(response => {
            console.log(+"user added");
        });
    }

    return (
        <form onSubmit={submitUser}>
            <input
                type="text"
                name="firstname"
                placeholder="First name"
                onChange={updateInupt}
                value={user.firstname}
            />
            <input
                type="text"
                name="lastname"
                placeholder="Last name"
                onChange={updateInupt}
                value={user.lastname}

            />

            <input
                type="email"
                name="email"
                placeholder="email"
                onChange={updateInupt}
                value={user.email}

            />
            <input
                type="number"
                name="phonenr"
                placeholder="Phone"
                onChange={updateInupt}
                value={user.phonenr}

            />
            <button type="submit">Submit</button>
        </form>
    )

}