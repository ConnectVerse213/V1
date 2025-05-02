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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ResponsiveAppBar from './ResponsiveAppBar';
import eventpageBackground from '../assets/images/coinBackground2.gif'
import eventpageEntireBackground from '../assets/images/eventBackground5.gif'
import CloseIcon from '@mui/icons-material/Close';


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

   const [showAcceptInvite, setShowAcceptInvite] = useState(false);

   function formatDate(dateStr) {
    const date = new Date(dateStr);
  
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }); // e.g., "Feb"
    const year = date.getFullYear();
  
    // Get ordinal suffix for day
    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    return `${day}${getOrdinal(day)} ${month}, ${year}`;
  }

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
    <div style={{
      
    }}>
      <div id="up"></div>
      <br></br>
      <ResponsiveAppBar   homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="contained"/>
      <hr></hr>
      <br></br> <br></br>
  
        <div className="item" >

<div className="item1">

<div class="item1a">

<img class="poster" src={events.length!=0 && events[0].Image}></img>

</div>

<div
  className="item1b"
  style={{
    width: '300px',               // Set fixed width
    wordWrap: 'break-word',       // Break long words
    whiteSpace: 'normal',         // Allow text to wrap
    overflowWrap: 'break-word',   // For better cross-browser wrapping
    border: '1px solid gray',
    padding: '10px',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.25)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  }}
>
  <p style={{
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
    margin: 0,
    textAlign:'left'
  }}>
    Hosted by {events.length!=0 && events[0].Creator}
  </p>

  <div
    className="item1c"
    style={{ marginTop: '10px' }}
  >
    <span style={{ color: 'white' }}>
      Registrations:&nbsp;
      {events.length !== 0 && events[0].RegistrationsCount}
    </span>
  </div>
</div>


</div>





<div className="item2">
<div class="item2a" style={{border: '1px solid gray',
    padding: '10px',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.25)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    backgroundImage:`url(${eventpageBackground})`,
    backgroundSize: 'cover', // Ensures the image covers the entire area without distortion
    backgroundPosition: 'center center', // Centers the image within the div
    backgroundRepeat: 'no-repeat', // Prevents repeating of the image
    
    }}>
  
  <h1 style={{color:'white'}}>{events.length!=0 && events[0].Name}</h1>
<div style={{color:'white',display:'flex',alignItems:'center',gap:'3px'}}><CalendarMonthIcon/><l>{events.length!=0 && formatDate(events[0].StartDateTime)}</l></div>

<div style={{textAlign:'left',display:'flex',alignItems:'flex-start',gap:'3px'}}>
<LocationPinIcon style={{color:'white'}}/> 
{events.length!=0 && events[0].Address && <l style={{color:'white'}} >{events[0].Address}</l>}
</div>

<div>

{events.length!=0 && events[0].Address && <iframe
            title="Google Map"
            src={`https://www.google.com/maps?q=${events[0].Address}&output=embed`}
           class="map"
           
            allowFullScreen=""
            loading="lazy"
          ></iframe>}

</div>

<div style={{paddingLeft:'1.5em'}}>

<a href="#up" style={{textDecoration:'none'}}>
      <button class="button-85" style={{height:'3em'}} type="submit" onClick={()=>{

        setShowAcceptInvite(true)
      }}>Accept Invitation</button></a>
</div>


</div>

<div class="item2b" >
 
<h1 style={{color:'white'}}>About Event</h1>


<div style={{textAlign:'left'}}>



{events.length!=0 && <div style={{textAlign:'left',color:'white'}} dangerouslySetInnerHTML={{ __html: events[0].Description }} />}
</div>


</div>
    </div>
    
    </div>

    {showAcceptInvite &&  <div style={{
          width: '100%', 
          height:'100%',
         position:'sticky',
          padding: '20px', 
          backgroundColor: 'black', 
          border: '2px solid #1876d1',
          blur:'50px', 
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          position: 'absolute', 
          top: '0%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 9999,
          animation: 'popupAnimation 0.5s ease',
          display:'flex',
          flexDirection:'column',
          justifyContent:'center',
          alignItems:'center'
        }}>
          <div style={{position:"absolute" ,top:'20px',right:'40px'}} onClick={()=>{
            setShowAcceptInvite(false)
          }}><CloseIcon style={{color:'red'}}/></div>
         
          <br></br>
          <center>
          <form onSubmit={handleSubmit} style={{backgroundColor:'black',color:'white'}}>
      {events.length!=0 && events[0].Questions.map((question, index) => (
        <div key={index} style={{ marginBottom: '15px',color:'white'}}>
          <label >{question}</label>
          <br /><br></br>

        
          <input  
            type="text" 
            className='custom-input'
            style={{fontSize:'28px',maxWidth:'70%',borderTop:'none',borderLeft:'none',borderRight:'none',backgroundColor:'black',color:'white'}}
           placeholder={answers[index]}
           
            
            onChange={(e) => handleChange(index, e.target.value)}
            
            
          />




        </div>
      ))}
       <br></br>
     
       <br></br>

       
      <button  type="submit" class="button-85" style={{height:'2em',width:'10em'}}>Register</button>
      
      </form>

      
          </center>
          
          <div >
         
              </div>
     <br></br><br></br>
         
       
        </div>}
        <br></br> <br></br> <br></br> <br></br> <br></br>
    </div>
  )
}

export default EventPage
