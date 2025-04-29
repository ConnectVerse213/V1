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
import CircleIcon from '@mui/icons-material/Circle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DescriptionIcon from '@mui/icons-material/Description';
import { EditorContent, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AddCardIcon from '@mui/icons-material/AddCard';
import './AdminCreate.css'
import ResponsiveAppBar from './ResponsiveAppBar';


// import { signInWithGoogle } from "../firebase-config";



const usersCollectionRef = collection(db, "events");
const usersCollectionRef1 = collection(db, "user");


function AdminCreate() {


  const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [mapUrl, setMapUrl] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const [startDateTime, setStartDateTime] = useState('2025-04-30T08:00');
    const [endDateTime, setEndDateTime] = useState('2025-05-01T14:00');
    const [capacity,setCapacity]=useState(50)
    const { showWidgetModal, closeModal } = useOkto();

    const [description,setDescription]=useState(false)
    const [showCapacity,setShowCapacity]=useState(false)
       const { createWallet, getUserDetails, getPortfolio } = useOkto();

        const editor = useEditor({
           extensions: [StarterKit], // Add basic features: bold, italic, headings, etc.
           content: '<p>Start writing...</p>',
         });
         const [text,setText]=useState('')
       
        

       const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [open_description, setOpen_description] = useState(false);

  const handleClickOpen_description = () => {
    setOpen_description(true);
  };

  const handleClose_description = () => {
    setOpen_description(false);
  };
  

  const [imageUrl, setImageUrl] = useState("");
 const notify = (text,theme,position,type) => toast(text,{
      position: position,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme,
      type:type
     
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
        const result=await addDoc(usersCollectionRef, { Name: eventName, Image:imageUrl,Address:selectedAddress,StartDateTime:startDateTime,EndDateTime:endDateTime,Capacity:capacity,Description: text, Creator:localStorage.getItem('email') ,Questions:questionsArray,Attendees:[],Registrations:[],AttendeesCount:0,RegistrationsCount:0});

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
                    notify("Event Created!","light","top-right","success")
                  

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
      <br></br> 
      <div id="up"></div>
       <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="contained" dashboardButtonStyle="outlined"/>
      
         
               <hr style={{ 
  
  border: '0.05px solid white', // A bit thicker for visibility
  margin: '10px 0' ,
  color:'white'
}} />
      <br></br>
      


      <div class="main">
        <div class="main1">     <input
        type="file"
        accept="image/*"
        id="fileInput"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
 
 {imageUrl.length==0 &&        <center>
  
 
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
    border:"5px solid #1876d1"
  }}
>

</label>
<br></br>
<l style={{color:'#1876d1',textAlign:'left'}}>Choose an image for poster</l>
</center>}
{imageUrl && (
        <div style={{ marginTop: "10px" }}>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
        
        </div>
      )}
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
      </div>
        <div class="main2"> 
     
      <div class="form__group field">
<div class="eventName">
    
    <input type="input" style={{fontSize:'40px',background: "transparent", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", border: "none", width:'100%',color:'white'}} placeholder="Event Name" required="" value={eventName} onChange={(e)=>setEventName(e.target.value)} />
    </div>
   
</div>



       
      
  
       
        <div>
  
    
  
    </div>
    <div class="datetime" style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)" }}>

<div class="datetime1">
  <div class="datetime1a"><CircleIcon fontSize="small"/><MoreVertIcon/><RadioButtonUncheckedIcon fontSize="small"/></div>
  <div class="datetime1b"><l>Start</l>
  <l>End</l></div>



</div>
<div class="datetime2">
 
    <input type="datetime-local"  style={{ height:'2.5em',
         
            backgroundColor: '#8193FE'
         ,color:'white',
           borderRadius:'10px',
           border:'none',
        
        }} name="datetime"
  
        value={startDateTime}
       
        onChange={(e)=>{
          setStartDateTime(e.target.value)

          
        }}/>
        
           
   
    
        
       
        <input type="datetime-local" name="datetime" name="datetime"
        value={endDateTime}
        style={{ height:'2.5em',
          backgroundColor: '#8193FE',
          color:'white', border:"none",
          border:'none',
          borderRadius:'10px'
        }}
        onChange={(e)=>{
          setEndDateTime(e.target.value)
          
        }}/>

   </div>
   </div>
  <div class="location" onClick={handleClickOpen} style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)" }}>
 

<div class="location2"><l style={{fontSize:'20px'}}>
  
  {selectedAddress.length!=0 && <l>&nbsp;&nbsp;<LocationPinIcon fontSize='small' />{selectedAddress.split(',')[0]}</l>}
  {selectedAddress.length==0 && <l>&nbsp;&nbsp;<LocationPinIcon fontSize='small'/> Add Location</l>}
  
  </l>
<l style={{fontSize:'15px'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <i>Offline Location</i></l>


</div>

  </div>



      {mapUrl && (
        <div >
          <iframe
            title="Google Map"
            src={mapUrl}
            width="320"
            height="150"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      )}

      <a href="#up"  style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)" ,color:'white',textDecoration:"none",width:'100%',textAlign:'left', height:'4em'}}>
   <br></br> 
  <div  onClick={()=>{
    
    setDescription(true)

  }}> {text.length==0 ? <l style={{fontSize:'20px'}}>&nbsp;&nbsp;<DescriptionIcon fontSize='small'/>&nbsp;Add Description</l>:<div style={{fontSize:'20px'}} >&nbsp;&nbsp;{text.replace(/<h[1-6][^>]*>|<\/h[1-6][^>]*>|<b>|<\/b>|<i>|<\/i>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>/g, '').replace(/<[^>]+>/g, '').slice(0,20)+"....."} &nbsp; <EditIcon fontSize='small'/></div>}</div></a>

   
       
       
        <l style={{color:'#1876d1'}}>Event Options</l>
        <div class="eventOptions" style={{ background: "rgba(255, 255, 255, 0.15)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", border: "1px solid rgba(255, 255, 255, 0.18)" ,justifyContent:'center'}}>



          <div class="tickets" style={{display:'flex',alignItems:'center',marginTop:'2.5%'}} onClick={()=>{
              notify("Subscribe to premium for paid tickets","light","top-right","warning")
          }}><div style={{display:'flex',alignItems:'center'}}><ConfirmationNumberIcon fontSize='small'/>&nbsp;<l>Tickets</l></div><div style={{display:'flex',alignItems:'center'}}>Free &nbsp;
          <EditIcon fontSize='small'/></div></div>
          
          <a href="#up"  style={{ background: "transparent", border: "none" ,color:'white',textDecoration:"none",width:'100%',textAlign:'left', height:'4em'}}>
          
          <div class="capacity" style={{display:'flex',alignItems:'center'}} onClick={()=>{
            
              setShowCapacity(true)
         
          
           
          }}><div  style={{display:'flex',alignItems:'center'}} ><PeopleAltIcon fontSize='small'/>
          &nbsp;<l>Capacity</l></div>
          <div style={{display:'flex',alignItems:'center'}}>{capacity} &nbsp;
          <EditIcon fontSize='small'/></div>
                      </div>
                      </a>
      
          
          


          
        </div>
      <br></br><br></br>
        <button  className='button-85' style={{height:'2em',width:'100%'}} onClick={()=>{
            createUser()
        }}>Create</button>
       
     
      
      </div>

     
       
      </div>
  <br></br>  <br></br>
     
      {/* <br></br>
      <input style={{ fontSize: '40px',border:'2px solid white',color:'white' }} placeholder="50"></input> */}
    
      <br></br>
      <br></br>
      <br></br>
      <br></br>


    
       
<ToastContainer/>

<Dialog
        open={open}
        onClose={handleClose}
        
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          },
        }}
      >
       
        <DialogContent style={{width:'15em',minHeight:'16em',backgroundColor:'black',border:'1px solid #1876d1',borderRadius:'0'}}>
          <DialogContentText>
            <br></br> <br></br>
          &nbsp;&nbsp;<l style={{color:'white'}}>Enter Location</l>
          </DialogContentText>
          <br></br>
        
          <input
            
            style={{maxWidth:'70%',backgroundColor:'black',borderTop:'none',borderLeft:'none',borderRight:'none',color:'white'}}
            
            
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="&nbsp; 🔍 Search Location"
          />
         
          <br></br>
          {suggestions.length > 0 && (
        <ul style={{
          listStyle: "none",
          margin: 0,
          padding: "5px",
          background: "black",
          border: "1px solid #ccc",
          position: "absolute",
          width: "10em",
          zIndex: 10,
          maxHeight: "200px",
          overflowY: "auto",
          color:'white'
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
            width="250"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      )}
        </DialogContent>
        <DialogActions style={{backgroundColor:'black',borderLeft:'1px solid #1876d1',borderTop:'none',borderRight:'1px solid #1876d1',borderBottom:'1px solid #1876d1',color:'white'}}>
          <Button style={{border:'1px solid red',color:'red'}}onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit">Add</Button>
        </DialogActions>
      </Dialog>


      {description &&  <div style={{
          width: '330px', 
          height: '700px',
          padding: '20px', 
          backgroundColor: 'black', 
          border: '2px solid #1876d1', 
          color:'white',
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          position: 'absolute', 
          top: '5%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 9999,
          animation: 'popupAnimation 0.5s ease',
        }}>
          <h2>Description</h2>
          <div >
                {/* Toolbar with buttons */}
                <div>
                  <div class="editorIcons">
                  <Button variant="outlined" style={{width:'3em',height:'2.5em',fontSize:'20px',width:'2em', border: '1px solid #1876d1'}} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} ><b>H</b></Button>
                  <Button variant="outlined" style={{borderRadius:'0', border: '1px solid #1876d1'}} onClick={() => editor.chain().focus().toggleBold().run()}><FormatBoldIcon/></Button>
                  <Button variant="outlined" style={{borderRadius:'0', border: '1px solid #1876d1'}} onClick={() => editor.chain().focus().toggleItalic().run()}><FormatItalicIcon/></Button>
                 
                  <Button variant="outlined" style={{borderRadius:'0', border: '1px solid #1876d1'}} onClick={() => editor.chain().focus().toggleBulletList().run()}><FormatListBulletedIcon/></Button>
                  <Button variant="outlined"style={{borderRadius:'0', border: '1px solid #1876d1'}} onClick={() => editor.chain().focus().toggleOrderedList().run()}><FormatListNumberedIcon/></Button>
                  </div>
                </div>
          
                {/* The editable content area with increased height */}
                <center>
                <div
                  style={{
                    height: '60vh',
                    overflowY: 'auto',
                    border: '1px solid #1876d1', // Optional: Add a border to the editor
                    backgroundColor:'black',width:'20em',
                    color:'white',
                    textAlign: 'left'
                  }}
                >
                  <EditorContent
                    editor={editor}
                    style={{
                      padding: '10px', // Optional: Add padding for better layout
                    }}
                  />
                </div>
                </center>
          <br></br>
         
                {/* Inline CSS to remove focus outline */}
                <style>
                  {`
                    .ProseMirror:focus {
                      outline: none !important;  /* Remove focus outline */
                      box-shadow: none !important; /* Remove focus shadow */
                    }
                  `}
                </style>
                <br></br>
          
                
               
              </div>
     
          <center>
          <Button variant="outlined" style={{border:'1px solid red',color:'red'}} onClick={()=>{
            
            setDescription(false)
           
          }}>Cancel</Button>
          &nbsp;  &nbsp;   &nbsp;  &nbsp;
          <Button variant="contained"  onClick={()=>{
            
            setText(editor.getHTML())
            setDescription(false)
            console.log(editor.getHTML())
           
          }}>Save</Button>
          </center>
        </div>}
 

        {showCapacity &&  <div style={{
          width: '360px', 
          height: '300px',
          padding: '20px', 
          backgroundColor: 'black', 
          border: '2px solid #1876d1',
          blur:'50px', 
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          position: 'absolute', 
          top: '5%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 9999,
          animation: 'popupAnimation 0.5s ease',
        }}>
          <h2 style={{color:'white'}}>Tickets</h2>
         
          <br></br>
          <center>
          <input style={{fontSize:'28px',backgroundColor:'black',borderTop:'none',borderLeft:'none',borderRight:'none',color:'white'}}onChange={(e)=>{
            setCapacity(parseInt(e.target.value))
          }} placeholder='Enter Capacity'></input>
          </center>
          <br></br>
          <br></br><div class="subscribe"><AddCardIcon/><l>Subscribe to Premium for unlimited capacity </l></div>
          <br></br><l></l>
          <div >
         
              </div>
     <br></br><br></br>
          <center>
          <Button variant="outlined" style={{color:'red',border:'0.5px solid red'}} onClick={()=>{
            
            setCapacity(50)
            setShowCapacity(false)
           
          }}>Cancel</Button>
          &nbsp;  &nbsp;   &nbsp;  
          <Button variant="contained"  onClick={()=>{
            
            setShowCapacity(false)
           
          }}>Save</Button>
          </center>
        </div>}
 

    </div>
  )
}

export default AdminCreate
