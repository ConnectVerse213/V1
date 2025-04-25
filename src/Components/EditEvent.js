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

         const [query, setQuery] = useState("");
           const [suggestions, setSuggestions] = useState([]);
           const [mapUrl, setMapUrl] = useState("");
         const [selectedAddress, setSelectedAddress] = useState("");
            const [startDateTime, setStartDateTime] = useState('');
            const [endDateTime, setEndDateTime] = useState('');
            const [capacity,setCapacity]=useState(10000)
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
         
      
         const handleSelect = (place) => {
          setSelectedAddress(place.display_name);
          setSuggestions([]);
          setQuery(place.display_name);
          setMapUrl(`https://www.google.com/maps?q=${place.lat},${place.lon}&output=embed`);
        };

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
        setSelectedAddress(filteredArray[0].Address)
        setImageUrl(filteredArray[0].Image)
        setStartDateTime(filteredArray[0].StartDateTime)
        setEndDateTime(filteredArray[0].EndDateTime)
        setCapacity(filteredArray[0].Capacity)

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

            
                const newFields = { Name: eventName, Description: eventDescription, Creator:events[0].Creator ,Questions:questions,Attendees:events[0].Attendees,Registrations:events[0].Registrations,AttendeesCount:events[0].AttendeesCount,RegistrationsCount:events[0].RegistrationsCount,StartDateTime:startDateTime,EndDateTime:endDateTime,Capacity:capacity,Address:selectedAddress,Image:imageUrl};
                await updateDoc(userDoc, newFields);
                window.location.reload();
          
            
            };

      useEffect(()=>{
        getEvents()
      },[])
       useEffect(() => {
                        const timeout = setTimeout(() => {
                          if (query.trim() === "") {
                            setSuggestions([]);
                            return;
                          }
                    
                          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1`)
                            .then((res) => res.json())
                            .then((data) => {
                              setSuggestions(data);
                            });
                        }, 300); // debounce 300ms
                    
                        return () => clearTimeout(timeout);
                      }, [query]);
                    
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
      <div style={{ padding: "20px", position: "relative", maxWidth: "600px" }}>
      <h2>Location Search with Suggestions</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Start typing a location..."
        style={{ padding: "8px", width: "100%" }}
      />
      {suggestions.length > 0 && (
        <ul style={{
          listStyle: "none",
          margin: 0,
          padding: "5px",
          background: "#fff",
          border: "1px solid #ccc",
          position: "absolute",
          width: "100%",
          zIndex: 10,
          maxHeight: "200px",
          overflowY: "auto"
        }}>
          {suggestions.map((place, index) => (
            <li
              key={index}
              onClick={() => handleSelect(place)}
              style={{ padding: "8px", cursor: "pointer" }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}

      {selectedAddress && (
        <div style={{ marginTop: "20px" }}>
          <strong>Selected Address:</strong> {selectedAddress}
        </div>
      )}

      {mapUrl && (
        <div style={{ marginTop: "20px" }}>
          <iframe
            title="Google Map"
            src={mapUrl}
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
    <br></br>
   
    <input type="file" accept="image/*" onChange={handleImageUpload} />
      {events[0] && imageUrl && (
        <div style={{ marginTop: "10px" }}>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
        
        </div>
      )}
    <br></br>
    <input type="datetime-local" id="datetime" name="datetime" name="datetime"
        value={startDateTime}
        onChange={(e)=>{
          setStartDateTime(e.target.value)
          
        }}/>
        <br></br>


        <l style={{color:'white'}}>{startDateTime}</l>
        <br></br>
        <input type="datetime-local" id="datetime" name="datetime" name="datetime" placeholder='hello'
        value={endDateTime}
        onChange={(e)=>{
          setEndDateTime(e.target.value)
          
        }}/>
        <br></br>
        <input type="number" id="quantity" name="quantity" min="1" max="10000" onChange={(e)=>{
          setCapacity(e.target.value)
        }}/>
        <br></br>


        <l style={{color:'white'}}>{endDateTime}</l>
        <br></br>
      <button onClick={updateUser}>Update</button>
    </div>
  )
}

export default EditEvent
