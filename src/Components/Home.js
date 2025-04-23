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

function Home() {


    const [coins,setCoins]=useState(0)
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
    alert('Click on Start Earning to get Started')
}}>Create Event</button>
<button onClick={()=>{
     alert('Click on Start Earning to get Started')
}}>Manage Event</button>
      <button onClick={()=>{
  showWidgetModal()
}}>Wallet </button>
<br></br>

<h1>Coins : {coins}</h1>
<br></br>

{coins==0 && <button onClick={async()=>{
    
    if( localStorage.getItem('email') )
    {

       
        const data = await getDocs(usersCollectionRef);
                      
        let users=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                    
                       
        const exists = users.some(obj => obj.Email === localStorage.getItem('email'));
                    
       if( !exists )
       {
        await addDoc(usersCollectionRef, { Email:localStorage.getItem('email'), Coins: 100, EventsCreated: [], EventsRegistered: [], EventsApproved:[],EventsAttended: []});
        setCoins(100)

        localStorage.setItem('coins',100)
        window.location.href = '/home2';
       }

       else
       {

         const data = await getDocs(usersCollectionRef);
               
         let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
               
         let filteredArray=eventsTemp.filter(obj => obj.Email === localStorage.getItem('email'))
         console.log(filteredArray)
         localStorage.setItem('coins',filteredArray[0].Coins)
         alert('User already exists')
         window.location.href = '/home2';
       }
       

       

    }
   
}}>Start Earning</button>}


    </div>
  )
}

export default Home
