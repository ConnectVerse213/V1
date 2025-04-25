import React from 'react'
import { useState, useEffect } from "react";
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
import { signInWithGoogle } from "../firebase-config";
import { useParams } from 'react-router-dom';
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
import './Home2.css'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import './EventPage.css'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import mapImage from '../assets/images/mapImage.svg'
function EventPage() {



  const { showWidgetModal, closeModal } = useOkto();
  const { createWallet, getUserDetails, getPortfolio } = useOkto();
  

    // Store answers as an array
  const [answers, setAnswers] = useState([]);

  // Handle input change
  const handleChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

   

    const result = {};
    events.length!=0 && events[0].Questions.forEach((question, index) => {
    result[question] = answers[index];
    });

  console.log(result);

    console.log(result); // You can send this to backend or do whatever you need
    updateUser(result)
  };


    const usersCollectionRef = collection(db, "events");
    const usersCollectionRef1 = collection(db, "user");
    const { event_id } = useParams();

   const [events, setEvents] = useState([]);

    const getEvents = async () => {
        const data = await getDocs(usersCollectionRef);
       
        let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
       
        let filteredArray=eventsTemp.filter(obj => obj.id === event_id)
        console.log(filteredArray)
        setEvents(filteredArray);
       
      
      };

      const updateUser = async (result) => {
        const userDoc = doc(db, "events", event_id);
        const newFields = { Name: events[0].Name, Description: events[0].Description, Creator:events[0].Creator ,Questions:events[0].Questions,Attendees:events[0].Attendees,Registrations:[...events[0].Registrations,result],AttendeesCount:events[0].AttendeesCount,RegistrationsCount:events[0].RegistrationsCount+1};
        await updateDoc(userDoc, newFields);
     

        const data = await getDocs(usersCollectionRef1);
                                     
        let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                    
                                     
        let filteredArray=eventsTemp.filter(obj => obj.Email === localStorage.getItem('email'))
        
        console.log(filteredArray)
                      
        await updateDoc(userDoc, newFields);
        const userDoc1 = doc(db, "user", filteredArray[0].id);
        const newFields1 = { Email: filteredArray[0].Email, Coins:filteredArray[0].Coins, EventsCreated:filteredArray[0].EventsCreated,EventsRegistered:[...filteredArray[0].EventsRegistered,event_id], EventsApproved:[...filteredArray[0].EventsApproved],EventsAttended:filteredArray[0].EventsAttended};
        await updateDoc(userDoc1, newFields1);
        window.location.reload();


      };

    useEffect(() => {

      if(!localStorage.getItem('email'))
      {
        alert('Please Log In First')
        window.location.href = '/oktologin';

      }
      else
      {
        getEvents();
      }
         
        },[])

      
  return (
    <div>
      <br></br>
      <br></br>
      <div className="full-width-bar" >
        <div class="logo" >  <img src={logo} style={{width:'3em'}} alt="Logo" /></div>
       

        <div style={{color:'white'}} >

        <Button  variant="outlined" onClick={()=>{
          window.location.href="/home"
        }} >Home</Button>
      <Button  variant="contained"  >Event</Button>
      


        </div>
          
            <div className="text" > <Button variant="outlined" onClick={()=>{
              showWidgetModal()
            }}> <AccountBalanceWalletIcon/></Button></div>
          </div>
          <br></br>
          <hr></hr>
          <br></br>
    <img style={{width:'20em'}} src={events.length!=0 && events[0].Image}></img>
    <h1 style={{color:'white'}}> {events.length!=0 && events[0].Name}</h1>
    {/* <h5 style={{color:'#1876d1'}}>Created by {events.length!=0 && events[0].Creator}</h5> */}
  
  
 
    <br></br>
    {events.length!=0 && <div> <div class="alignIcons"><l style={{color:'#1876d1'}}><CalendarTodayIcon/> </l><l style={{color:'#1876d1'}}>Start: &nbsp; </l><l style={{color:'white'}}> {events.length!=0 && events[0].StartDateTime.slice(0,10)}</l>&nbsp;&nbsp;&nbsp;&nbsp; <l style={{color:'#1876d1'}}><AccessTimeIcon/> </l><l style={{color:'#1876d1'}}>Time: &nbsp; </l><l style={{color:'white'}}> {events.length!=0 && parseInt(events[0].StartDateTime.slice(11,13))>12 ? <l>{parseInt(events[0].StartDateTime.slice(11,13))-12}:{events[0].StartDateTime.slice(14)}&nbsp; PM</l>:<l>{parseInt(events[0].StartDateTime.slice(12,13))}:{events[0].StartDateTime.slice(14)}&nbsp; AM </l> }</l></div>
  
    
  <br></br> 
  <div class="alignIcons"><l style={{color:'#1876d1'}}><CalendarTodayIcon/> </l><l style={{color:'#1876d1'}}>End: &nbsp; </l><l style={{color:'white'}}> {events.length!=0 && events[0].EndDateTime.slice(0,10)}</l> &nbsp;&nbsp;&nbsp;&nbsp; <l style={{color:'#1876d1'}}><AccessTimeIcon/>  </l><l style={{color:'#1876d1'}}>Time: &nbsp; </l><l style={{color:'white'}}> {events.length!=0 && parseInt(events[0].EndDateTime.slice(11,13))>12 ? <l>{parseInt(events[0].EndDateTime.slice(11,13))-12}:{events[0].EndDateTime.slice(14)}&nbsp; PM</l>:<l>{parseInt(events[0].EndDateTime.slice(12,13))}:{events[0].EndDateTime.slice(14)}&nbsp; AM </l> }</l> </div>
  <br></br>
 
  <div class="alignIcons"><l style={{color:'#1876d1'}}><LocationPinIcon/> </l><l style={{color:'#1876d1'}}>Location: &nbsp; </l><l style={{color:'white'}}> {events.length!=0 && events[0].Address.slice(events[0].Address.lastIndexOf(",") + 1)} </l><l onClick={()=>{
    window.location.href=`https://www.google.com/maps?q=${events[0].Address}`
  }}style={{color:'white'}}>(View in Google Maps)</l><img src={mapImage} style={{width:'2em'}} onClick={()=>{
    window.location.href=`https://www.google.com/maps?q=${events[0].Address}`
  }}></img></div></div>
    
    
    }
   <br></br>
   <br></br>
    <l style={{color:'#1876d1', fontSize:'24px'}}>About the event</l>
    <br></br>
    <center>
    {events.length!=0 && <p style={{color:'white',maxWidth:'500px'}}>{events[0].Description}</p>}
    </center>
    <br></br>  <br></br>
    <hr></hr>

    <br></br><br></br>
    <br></br>
    <form onSubmit={handleSubmit}>
      {events.length!=0 && events[0].Questions.map((question, index) => (
        <div key={index} style={{ marginBottom: '15px',color:'white' }}>
          <label style={{color:'#1876d1'}}>{question}</label>
          <br />
         
          <input  class="form__field"
            type="text" 
            value={answers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            style={{maxWidth:'350px'}}
            
          />
        </div>
      ))}
       <br></br>
     
       <br></br>
      <button class="btn4" type="submit">Register</button>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
     
     

    </form>
    </div>
  )
}

export default EventPage
