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
import { useParams } from 'react-router-dom';

function EventPage() {

  

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
    
    <h1> {events.length!=0 && events[0].Name}</h1>
    <h5>Created by {events.length!=0 && events[0].Creator}</h5>
  
  
 
    <br></br>
    <hr></hr>
    <form onSubmit={handleSubmit}>
      {events.length!=0 && events[0].Questions.map((question, index) => (
        <div key={index} style={{ marginBottom: '15px' }}>
          <label>{question}</label>
          <br />
          <input
            type="text"
            value={answers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            style={{ width: '300px', padding: '5px' }}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
    </div>
  )
}

export default EventPage
