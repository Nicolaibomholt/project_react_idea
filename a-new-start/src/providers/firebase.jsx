import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { functions } from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyDIcgZ3ezDhefuceBqdtYROWvli-2huk4I",
    authDomain: "anewbeginning-9deaf.firebaseapp.com",
    databaseURL: "https://anewbeginning-9deaf.firebaseio.com",
    projectId: "anewbeginning-9deaf",
    storageBucket: "anewbeginning-9deaf.appspot.com",
    messagingSenderId: "550495036394",
    appId: "1:550495036394:web:495fa1de5dec66404f4893",
    measurementId: "G-EMEJT9HHQ9"
  };
  
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider);
};

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;

  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();

    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};