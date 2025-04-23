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
import { useParams } from 'react-router-dom';

function EventManageB() {

    const usersCollectionRef = collection(db, "events");
        const { event_id } = useParams();
    
       const [events, setEvents] = useState([]);
       const [eventName,setEventName]=useState("")
       const [eventDescription,setEventDescription]=useState("")
      
          

    const [attendees, setAttendees] = useState([]);
    const [attendeesCount, setAttendeesCount] = useState(0);
    const [unapprovedAttendees,setUnapprovedAttendees]=useState([])
    const [optionApproved,setOptionApproved]=useState(1)


    function isEqual(obj1, obj2) {
        return obj1.Email === obj2.Email;
      }

    const getEvents = async () => {
        const data = await getDocs(usersCollectionRef);
       
        let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
       
        let filteredArray=eventsTemp.filter(obj => obj.id === event_id)
        console.log(filteredArray)
        setEvents(filteredArray);
        setAttendees(filteredArray[0].Attendees)
        setAttendeesCount(filteredArray[0].AttendeesCount)
        setEventName(filteredArray[0].Name)
        setEventDescription(filteredArray[0].Description)


        const unapprovedArr = filteredArray[0].Registrations.filter(item1 =>
            !filteredArray[0].Attendees.some(item2 => isEqual(item1, item2))
          );
          setUnapprovedAttendees(unapprovedArr)

          if(!localStorage.getItem('email'))
            {
                window.location.href = '/error/User Not Logged In';
            }
    
            if(localStorage.getItem('email') && filteredArray.length!=0 && filteredArray[0].Creator!=localStorage.getItem('email'))
                {
                    window.location.href = '/error/User Not Authorized';
                }
    }
       
      const [newAttendee, setNewAttendee] = useState({});
    
      const handleAddAttendee = (registration) => {
        if (newAttendee !== '') {
          setAttendees([...attendees, registration]);
          setAttendeesCount(attendeesCount+1)
          setNewAttendee('');
        }
      };
      const handleDeleteAttendee = (registration) => {

        const arr2 = attendees.filter(item => item.Email !== registration.Email);
        setAttendees(arr2)
        setAttendeesCount(attendeesCount-1)
        setNewAttendee('');

      };
    //   const handleDeleteQuestion = (indexToDelete) => {
    //     setQuestions(questions.filter((_, index) => index !== indexToDelete));
    //   };

        const updateUser = async () => {
              const userDoc = doc(db, "events", event_id);
              const newFields = { Name: events[0].Name, Description: events[0].Description, Creator:events[0].Creator ,Questions:events[0].Questions,Attendees:attendees,Registrations:events[0].Registrations,AttendeesCount:attendeesCount,RegistrationsCount:events[0].RegistrationsCount};
              await updateDoc(userDoc, newFields);
              window.location.reload();
            };

      useEffect(()=>{
        getEvents()
      },[])
      
  return (
    <div className="p-4 max-w-xl mx-auto">

        <h1>Manage Event</h1>
        {event_id}
        <br></br>
        {events.length!=0 && <div>
            
            Registrations : {events[0].RegistrationsCount}
            <br></br>
           Attendees : {events[0].AttendeesCount}
            <br></br>
            
            
            </div>}
     
        <hr></hr>
      <h2 className="text-xl font-bold mb-4">Manage Attendees</h2>

        <button onClick={()=>{
            setOptionApproved(1)
        }}>All</button>
        <button onClick={()=>{
            setOptionApproved(2)
        }}>Unapproved</button>
        <button onClick={()=>{
            setOptionApproved(3)
        }}>Approved</button>
    
    {events.length!=0 && optionApproved==1 &&  <ul className="space-y-2">
        <h5>All</h5>
        <br></br>
        {events[0].Registrations.map((registration, index) => (
          <li key={index} className="flex justify-between items-center p-2 border rounded">
            <span>{registration.Email}</span>
            <button
              onClick={() =>handleAddAttendee(registration)}
              className="text-red-500 hover:underline"
            >
              Approve
            </button>
          </li>
        ))}
      </ul>}

      {events.length!=0 && optionApproved==2 &&  <ul className="space-y-2">
        <h5>Unapproved</h5>
        {unapprovedAttendees.map((registration, index) => (
          <li key={index} className="flex justify-between items-center p-2 border rounded">
            <span>{registration.Email}</span>
            <button
              onClick={() =>handleAddAttendee(registration)}
              className="text-red-500 hover:underline"
            >
              Approve
            </button>
          </li>
        ))}
      </ul>}

      {events.length!=0 && optionApproved==3 &&  <ul className="space-y-2">
        <h5>Approved</h5>
        {attendees.map((registration, index) => (
          <li key={index} className="flex justify-between items-center p-2 border rounded">
            <span>{registration.Email}</span>
            <button
              onClick={() =>handleDeleteAttendee(registration)}
              className="text-red-500 hover:underline"
            >
              Unapprove
            </button>
          </li>
        ))}
      </ul>}
     
      <br></br>
      <button onClick={updateUser}>Update</button>
    </div>
  )
}

export default EventManageB
