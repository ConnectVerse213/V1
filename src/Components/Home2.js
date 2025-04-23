import React,{useEffect, useState} from 'react'
import { useOkto } from "okto-sdk-react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
// import { signInWithGoogle } from "../firebase-config";
const usersCollectionRef = collection(db, "user");

function Home2() {


    const [coins,setCoins]=useState(localStorage.getItem('coins')?localStorage.getItem('coins'):0)
    const { showWidgetModal, closeModal } = useOkto();
    const { createWallet, getUserDetails, getPortfolio } = useOkto();
    
    const createUser = async (email) => {

            try{
                await addDoc(usersCollectionRef, { Email:email, Coins: 100, EventsCreated: [], EventsRegistered: [], EventsAttended: []});
            }
            catch{
                alert('Problem Creating User')
            }
          
           
          };


    useEffect(()=>{
        getUserDetails()
        .then((result) => {
            if(!localStorage.getItem('email'))
            {
              localStorage.setItem('email',result.email)
             
             
              window.location.reload()
            }
           
            
        })
        .catch((error) => {
            console.error(`error:`, error);
        });
      },[])
  return (
    <div>
      <h1>Home</h1>
      <hr></hr>
      <button onClick={()=>{
     window.location.href = '/creator';
}}>Create Event</button>
<button onClick={()=>{
     window.location.href = '/manage';
}}>Manage Event</button>
      <button onClick={()=>{
  showWidgetModal()
}}>Wallet </button>
<br></br>

<h1>Coins : {coins}</h1>
<br></br>




    </div>
  )
}

export default Home2
