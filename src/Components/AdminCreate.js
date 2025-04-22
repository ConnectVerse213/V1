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
const usersCollectionRef = collection(db, "events");

function AdminCreate() {

    const [eventName,setEventName]=useState('')
    const [eventDescription,setEventDescription]=useState('')
    const [questionsArray,setQuestionsArray]=useState(["Name","Email"])
    const [question,setQuestion]=useState('')

    const createUser = async () => {
        await addDoc(usersCollectionRef, { Name: eventName, Description: eventDescription, Creator:localStorage.getItem('email') ,Questions:questionsArray,Attendees:[],Registrations:[],AttendeesCount:0,RegistrationsCount:0});
      };
    
  return (
    <div>
      <h1>Admin Create Form</h1>

      {localStorage.getItem('name')?<div>Logged In as {localStorage.getItem('name')}</div>:<button onClick={signInWithGoogle}>
        Sign in with Google
      </button>}
      
      <img src={localStorage.getItem('profilePic')} />
      <br></br>
      <hr></hr>

        <input placeholder='Event Name' onChange={(e)=>setEventName(e.target.value)}></input>
        {eventName}
        <br></br>
        <input placeholder='Event Description' onChange={(e)=>setEventDescription(e.target.value)}></input>
        {eventDescription}
        <br></br>
        <h5>Questions</h5>
        {questionsArray.map((x)=>{
            return(
                <div>
                    {x}
                    <br></br>
                </div>
            )
        })}
       
        <input placeholder='Type In Question' onChange={(e)=>setQuestion(e.target.value)}></input>
        <button onClick={()=>{
            setQuestionsArray([...questionsArray,question])
        }}>Add Questions</button>
        <br></br>
        <hr></hr>
        <button  onClick={()=>{
            createUser()
        }}>Create</button>

    </div>
  )
}

export default AdminCreate
