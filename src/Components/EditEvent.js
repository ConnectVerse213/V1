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

function EditEvent() {

    const usersCollectionRef = collection(db, "events");
        const { event_id } = useParams();
    
       const [events, setEvents] = useState([]);
       const [eventName,setEventName]=useState("")
       const [eventDescription,setEventDescription]=useState("")
      
          

    const [questions, setQuestions] = useState([]);
    const getEvents = async () => {
        const data = await getDocs(usersCollectionRef);
       
        let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
       
        let filteredArray=eventsTemp.filter(obj => obj.id === event_id)
        console.log(filteredArray)
        setEvents(filteredArray);
        setQuestions(filteredArray[0].Questions)
        setEventName(filteredArray[0].Name)
        setEventDescription(filteredArray[0].Description)

        if(!localStorage.getItem('email'))
        {
            window.location.href = '/error/User Not Logged In';
        }

        if(localStorage.getItem('email') && filteredArray.length!=0 && filteredArray[0].Creator!=localStorage.getItem('email'))
            {
                window.location.href = '/error/User Not Authorized';
            }
    }
       
      const [newQuestion, setNewQuestion] = useState('');
    
      const handleAddQuestion = () => {
        if (newQuestion.trim() !== '') {
          setQuestions([...questions, newQuestion]);
          setNewQuestion('');
        }
      };
    
      const handleDeleteQuestion = (indexToDelete) => {
        setQuestions(questions.filter((_, index) => index !== indexToDelete));
      };

        const updateUser = async () => {
              const userDoc = doc(db, "events", event_id);
              const newFields = { Name: eventName, Description: eventDescription, Creator:events[0].Creator ,Questions:questions,Attendees:events[0].Attendees,Registrations:events[0].Registrations,AttendeesCount:events[0].AttendeesCount,RegistrationsCount:events[0].RegistrationsCount};
              await updateDoc(userDoc, newFields);
              window.location.reload();
            };

      useEffect(()=>{
        getEvents()
      },[])
      
  return (
    <div className="p-4 max-w-xl mx-auto">

        <h1>Edit Event</h1>
        {event_id}
        <br></br>
        {events.length!=0 && <div>
            
            <input placeholder={eventName} onChange={(e)=>{
                setEventName(e.target.value)
            }}></input>
            Edit Name
            <br></br>
           
            <input placeholder={eventDescription} onChange={(e)=>{
                setEventDescription(e.target.value)
            }}></input>
              Edit Description
              <br></br>
            
            </div>}
        <hr></hr>
      <h2 className="text-xl font-bold mb-4">Manage Questions</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Add a new question"
          className="flex-grow p-2 border rounded"
        />
        <button
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    {events.length!=0 &&  <ul className="space-y-2">
        {questions.map((question, index) => (
          <li key={index} className="flex justify-between items-center p-2 border rounded">
            <span>{question}</span>
            <button
              onClick={() => handleDeleteQuestion(index)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>}
     
      <br></br>
      <button onClick={updateUser}>Update</button>
    </div>
  )
}

export default EditEvent
