import React from 'react'
import { useState, useEffect } from "react";
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
import { BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';
const usersCollectionRef = collection(db, "events");

function EventManage() {

     const [events, setEvents] = useState([]);
  
      const getEvents = async () => {

          const data = await getDocs(usersCollectionRef);
         
          let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          console.log(eventsTemp)
          let filteredArray=eventsTemp.filter(obj => obj.Creator === localStorage.getItem('email'))
          console.log(filteredArray)

          setEvents(filteredArray);
         
         
        
        };

        useEffect(()=>{

          getEvents()

        },[])

  return (
    <div>

        <h1>Manage Events</h1>
        <hr></hr>

     
      {events.length!=0 && events.map((x)=>{
        return (
          <div style={{ border: '2px solid black' }}>

              {x.Name}
              <br></br>
              Registrations : {x.RegistrationsCount}
              <br></br>
              <Link to={`/manageevent/${x.id}`}><button>Manage</button></Link>
            
              <Link to={`/editevent/${x.id}`}><button>Edit</button></Link>
              
          </div>
        
        )
      })}
      
    </div>
  )
}

export default EventManage
