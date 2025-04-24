import React from 'react'
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { useOkto } from "okto-sdk-react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
// import { signInWithGoogle } from "../firebase-config";



const usersCollectionRef = collection(db, "events");
const usersCollectionRef1 = collection(db, "user");


function AdminCreate() {


  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_unsigned_preset"); // 👈 Replace
    formData.append("cloud_name", "getsetcourse");       // 👈 Replace

    const res = await fetch(`https://api.cloudinary.com/v1_1/getsetcourse/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.secure_url); // ✅ Final image URL
  };

    const [eventName,setEventName]=useState('')
    const [eventDescription,setEventDescription]=useState('')
    const [questionsArray,setQuestionsArray]=useState(["Name","Email"])
    const [question,setQuestion]=useState('')

    const [user,setUser]=useState([])

    const createUser = async () => {
        const result=await addDoc(usersCollectionRef, { Name: eventName, Image:imageUrl,Description: eventDescription, Creator:localStorage.getItem('email') ,Questions:questionsArray,Attendees:[],Registrations:[],AttendeesCount:0,RegistrationsCount:0});

        console.log(result.id)

        if(user.length!=0)
        {
          updateUser(result.id)
        }
       
      };

        const updateUser = async (id) => {

            console.log(user[0])
                    const userDoc = doc(db, "user", user[0].id);
                    const newFields = { Email: user[0].Email, Coins:user[0].Coins, EventsCreated:[...user[0].EventsCreated,id],EventsRegistered:user[0].EventsRegistered, EventsApproved:user[0].EventsApproved,EventsAttended:user[0].EventsAttended};
                    await updateDoc(userDoc, newFields);
                    window.location.reload();
                  };

      const getEvents = async () => {
      
      
                const data = await getDocs(usersCollectionRef1);
               
                let users=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
             
                
               const newArr = users.filter(obj => obj.Email === localStorage.getItem('email'));
             
               console.log(newArr[0].id)

               setUser(newArr)
               
              
              };
      
              useEffect(()=>{
      
                getEvents()
      
              },[])
   
  return (
    <div>
      <h1>Admin Create Form</h1>

      {/* {localStorage.getItem('name')?<div>Logged In as {localStorage.getItem('name')}</div>:<button onClick={signInWithGoogle}>
        Sign in with Google
      </button>} */}
      
     
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
        <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageUrl && (
        <div style={{ marginTop: "10px" }}>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
        
        </div>
      )}
    </div>
    <br></br>
        <hr></hr>
        <button  onClick={()=>{
            createUser()
        }}>Create</button>

    </div>
  )
}

export default AdminCreate
