import React,{useEffect, useState} from 'react'
import { useOkto } from "okto-sdk-react";


function Home() {

    const { showWidgetModal, closeModal } = useOkto();
    const { createWallet, getUserDetails, getPortfolio } = useOkto();


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
      })
  return (
    <div>
      <h1>Home</h1>
      <hr></hr>
      <button onClick={()=>{
     window.location.href = '/creator';
}}>Create Event</button>
<button onClick={()=>{
     window.location.href = '/creator';
}}>Manage Event</button>
      <button onClick={()=>{
  showWidgetModal()
}}>Wallet </button>
<br></br>

<h1>Coins : 0</h1>

    </div>
  )
}

export default Home
