import React,{useEffect, useState} from 'react'
import { useOkto } from "okto-sdk-react";
import { db } from "../firebase-config";
import './Home.css'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';
import logo from '../assets/images/logo.png'
import Stack from '@mui/material/Stack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import coinImg from '../assets/images/coinImg.svg'
import Alert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';

// import { signInWithGoogle } from "../firebase-config";
const usersCollectionRef = collection(db, "user");

function Home() {



    const [coins,setCoins]=useState(0)
    const { showWidgetModal, closeModal } = useOkto();
    const { createWallet, getUserDetails, getPortfolio } = useOkto();
    const notify = () => toast("Click on Start Earning to Get Started!",{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
     
      });

    
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

        if(localStorage.getItem('coins'))
        {
          window.location.href = '/home2';
        }
        
      },[])
  return (
    <div>
      <br></br>
     
     
      <br></br>
      <div className="full-width-bar" >
        <div class="logo" >  <img src={logo} style={{width:'3em'}} alt="Logo" /></div>

        <div style={{color:'white'}} >

        
      <Button variant="outlined" onClick={notify} >Events</Button>
      <Button variant="outlined" onClick={notify} >Movies</Button>
      <Button variant="outlined" onClick={notify} >Concerts</Button>


        </div>
          
            <div className="text" > <Button variant="outlined" onClick={()=>{
              showWidgetModal()
            }}> <AccountBalanceWalletIcon/></Button></div>
          </div>
      <hr></hr>

<center>
  
      <div class="coin" >  <img src={coinImg} style={{width:'5em'}} alt="Logo"  /> &nbsp; <l style={{fontSize:"32px"}}>0</l></div>
      </center>

<br></br><br></br>

{coins==0 && <button class="btn4" onClick={async()=>{
    
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
<br></br>
<br></br><br></br><br></br><br></br><br></br><br></br>



<Alert severity="info" >Click on Start Earning to Get Started !</Alert>
<ToastContainer/>




    </div>
  )
}

export default Home
