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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import uploadImg from '../assets/images/uploadImg.png'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


import './AdminCreate.css'


// import { signInWithGoogle } from "../firebase-config";



const usersCollectionRef = collection(db, "events");
const usersCollectionRef1 = collection(db, "user");


function AdminCreate() {


  const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [mapUrl, setMapUrl] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [capacity,setCapacity]=useState(10000)
    const { showWidgetModal, closeModal } = useOkto();
       const { createWallet, getUserDetails, getPortfolio } = useOkto();
  

  const [imageUrl, setImageUrl] = useState("");
 const notify = () => toast("Event Created!",{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
     
      });
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
        const result=await addDoc(usersCollectionRef, { Name: eventName, Image:imageUrl,Address:selectedAddress,StartDateTime:startDateTime,EndDateTime:endDateTime,Capacity:capacity,Description: eventDescription, Creator:localStorage.getItem('email') ,Questions:questionsArray,Attendees:[],Registrations:[],AttendeesCount:0,RegistrationsCount:0});

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
                    notify()
                  

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
              
                const handleSelect = (place) => {
                  setSelectedAddress(place.display_name);
                  setSuggestions([]);
                  setQuery(place.display_name);
                  setMapUrl(`https://www.google.com/maps?q=${place.lat},${place.lon}&output=embed`);
                };
   
  return (
    <div>
      <br></br> <br></br>
           <div className="full-width-bar" >
             <div class="logo" >  <img src={logo} style={{width:'3em'}} alt="Logo" /></div>
            
     
             <div style={{color:'white'}} >
     
             
           <Button  variant="contained">Create Events</Button>
           <Button variant="outlined" >Manage Events</Button>
           
     
     
             </div>
               
                 <div className="text" > <Button variant="outlined" onClick={()=>{
                   showWidgetModal()
                 }}> <AccountBalanceWalletIcon/></Button></div>
               </div>
     
      <br></br>
      <hr></hr>
      <br></br>
  
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
 
 {imageUrl.length==0 &&        <center>
  <l style={{color:'#1876d1',textAlign:'left'}}>Choose an image for poster</l>
  <br></br><br></br>
      <label
  htmlFor="fileInput"
  style={{
    width: "300px",
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url(${uploadImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    textShadow: "1px 1px 2px black",
    border:"2px solid #1876d1"
  }}
>

</label>
</center>}
      {imageUrl && (
        <div style={{ marginTop: "10px" }}>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
        
        </div>
      )}
      <br></br>
      {imageUrl.length!=0 &&  <center>
      <label
        htmlFor="fileInput"
        style={{
          padding: "10px 20px",
          backgroundColor: "#4A90E2",
          color: "white",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Change Poster
      </label>
      </center>}
     
      <br></br>
      <br></br><br></br>
      <center>
      <l style={{color:'#1876d1',textAlign:'left'}}>Name of the event</l>
      <br></br><br></br>
      <div class="form__group field">
    <input type="input" class="form__field" placeholder="Name" required="" onChange={(e)=>setEventName(e.target.value)} />
  
    {/* <label for="name" class="form__label">Name</label> */}
</div>


</center>
       
      
     
        {/* <h5 style={{color:'#1876d1', fontSize: '24px'}}>Questions</h5>
        {questionsArray.map((x)=>{
            return(
                <div style={{color:'white'}}>
                    {x} &nbsp;  <CheckCircleIcon/>
                    <br></br>
                </div>
            )
        })}
       
        <input placeholder='Type In Question' onChange={(e)=>setQuestion(e.target.value)}></input>
        <button onClick={()=>{
            setQuestionsArray([...questionsArray,question])
        }}>Add Questions</button> */}
       
        <div>
      {/* <input type="file" accept="image/*" onChange={handleImageUpload} /> */}
    
  
    </div>
   
    <center>
    <div style={{ position: "relative", width:'100%',maxWidth: '300px' }}>
      <h2>Location Search with Suggestions</h2>
      <l style={{color:'#1876d1',textAlign:'left'}}>Location of the event</l>
      <br></br><br></br>
      <input
        type="text"
        class="form__field"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Enter Location"
       
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
        <div style={{ marginTop: "20px" , color:'#1876d1'}}>
          <strong>Selected Address:</strong> {selectedAddress}
        </div>
      )}

      {mapUrl && (
        <div style={{ marginTop: "20px" }}>
          <iframe
            title="Google Map"
            src={mapUrl}
            width="300"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
    </center>
    <br></br><br></br><br></br><br></br>
    <l style={{color:'#1876d1',textAlign:'left'}}>Enter Start Date</l>
    <br></br><br></br>
    <input type="datetime-local" id="datetime" style={{
    borderTop: 'none',
    borderRight: 'none',
    borderLeft: 'none',
    borderBottom: '2px solid #1876d1',
    backgroundColor:'black'
  }} name="datetime"
        value={startDateTime}
       
        onChange={(e)=>{
          setStartDateTime(e.target.value)

          
        }}/>
           <br></br><br></br><br></br>
        <l style={{color:'#1876d1'}}>Enter End Date</l>
    
        
        <br></br><br></br>
        <input type="datetime-local" id="datetime" style={{
    borderTop: 'none',
    borderRight: 'none',
    borderLeft: 'none',
    borderBottom: '2px solid #1876d1',
    backgroundColor:'black'
  }
} name="datetime" name="datetime"
        value={endDateTime}
        onChange={(e)=>{
          setEndDateTime(e.target.value)
          
        }}/>
        <br></br> <br></br>
        <br></br><br></br><br></br>
       
        <l style={{color:'#1876d1'}}>Select Capacity</l>
        &nbsp;
        <input type="number" id="quantity" name="quantity" min="1" max="10000"  style={{
    borderTop: 'none',
    borderRight: 'none',
    borderLeft: 'none',
    borderBottom: '2px solid #1876d1',
    backgroundColor:'black',
    color:'#1876d1'
  }
} onChange={(e)=>{
          setCapacity(e.target.value)
        }}/>
        <br></br>
      
        <br></br>
       
        <div style={{color:'white'}}>
        <br></br>
      
      <br></br>
     
     
        <center>
        <l style={{color:'#1876d1'}}></l>
        <br></br> <br></br>
        <textarea
  type="input"
  
 
  required
  onChange={(e) => setEventDescription(e.target.value)}
  rows={20}
  placeholder='Enter description for the event'
  style={{ width: '60%',  borderTop: 'none',
    
    border: '2px solid #1876d1',
    backgroundColor:'black',
    color:'#1876d1' }} // Makes the width 100% of its container
/>
        </center>


      

        </div>
        <br></br> <br></br> <br></br>
        <button className='btn4' onClick={()=>{
            createUser()
        }}>Create</button>
        <br></br><br></br><br></br><br></br><br></br>
<ToastContainer/>
    </div>
  )
}

export default AdminCreate
