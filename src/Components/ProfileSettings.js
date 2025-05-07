import React,{useState,useEffect} from 'react'
import ResponsiveAppBar from './ResponsiveAppBar'
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange } from '@mui/material/colors';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import accountImg from '../assets/images/accountImg.png'

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
import { ToastContainer, toast } from 'react-toastify';

function ProfileSettings() {

    const usersCollectionRef1 = collection(db, "user");

     const [imageUrl, setImageUrl] = useState("");
     const [userName,setUserName]=useState("")

      const notify = (text,type) => toast(text,{
           position: "top-right",
           autoClose: 5000,
           hideProgressBar: false,
           closeOnClick: false,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
           theme: "light",
           type:type
          
           });


    const getUser=async ()=>{

        try{

            const data = await getDocs(usersCollectionRef1);
                                          
               let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
     
               let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))

             console.log(filteredArray)

             if(filteredArray[0].ProfileImage)
             {
                setImageUrl(filteredArray[0].ProfileImage)
             }

             if(filteredArray[0].UserName)
             {
                setUserName(filteredArray[0].UserName)
             }
             else
             {
                setUserName("Enter User Name")
             }

            
           
                           
        }
        catch{

            notify("Error loading profile setting","error")
            setInterval(()=>{
                window.location.href="/home"
              },3000)
        }

    }

      const updateUser = async () => {
     
             try{
     
              
     
               const data = await getDocs(usersCollectionRef1);
                                          
               let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
     
               let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))

             console.log(filteredArray)
                           
            const userDoc1 = doc(db, "user", filteredArray[0].id);
             const newFields1 = { Email: filteredArray[0].Email, Coins:filteredArray[0].Coins, EventsCreated:filteredArray[0].EventsCreated,EventsRegistered:[...filteredArray[0].EventsRegistered], EventsApproved:[...filteredArray[0].EventsApproved],EventsAttended:filteredArray[0].EventsAttended,ProfileImage:imageUrl,UserName:userName};
     
               // update
     
     
             await updateDoc(userDoc1, newFields1);
             
             notify("Profile updated!","success")
     
             setInterval(()=>{
               window.location.reload();
             },3000)
     
             
             }
             catch{
               
               notify("Some error occured","error")
             }
     
           };

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

      useEffect(()=>{
        getUser()
      },[])

  return (
    <div>
        <br></br>
        <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="outlined"/>
    
        <hr></hr><br></br>
       <br></br>
        <div style={{color:'white', display:'flex',alignItems:'center',gap:'3px',justifyContent:'center'}}><SettingsIcon fontSize="large"/> &nbsp;<l style={{fontSize:'28px'}}> Profile Settings </l></div>

        <br></br> 
        <center>

       
        <br></br>


         <input
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
            width: "250px",
            height: "250px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `url(${accountImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            textShadow: "1px 1px 2px black",
            
          }}
        >
        
        </label>
        <br></br>
        <l style={{color:'#1876d1',textAlign:'left'}}>Set Profile Picture</l>
        </center>}
        {imageUrl && (
                <div style={{ marginTop: "10px" }}>
                  <img src={imageUrl} alt="Uploaded" style={{ width: "250px",height:'250px',borderRadius:'50%',objectFit: 'cover' }} />
                
                </div>
              )}
              <br></br>
        {imageUrl.length!=0 &&  <center>
              <label
                htmlFor="fileInput"
                style={{
                  padding: "10px 20px",
                  
                  color: "#1876d1",
                  
                  cursor: "pointer",
                }}
              >
                Change Photo
              </label>
              </center>}
        
        <br></br>  <br></br>

       <input  style={{color:'black',fontSize:'16px',width:'11em',height:'2em'}} value={userName} onChange={(e)=>{
        setUserName(e.target.value)
       }}></input>
       
        <br></br>  <br></br>
        <Button variant="contained" style={{width:'13em'}} onClick={()=>{
            updateUser()
        }}>Save</Button>
        <br></br>
        <br></br>
        <Button variant="outlined" style={{width:'13em',border:'1px solid red',color:'red'}} onClick={()=>{
            localStorage.clear();
            window.location.href="/oktologin"
        }}>Logout</Button>

        </center>
<br></br>

      <ToastContainer/>
    </div>
  )
}

export default ProfileSettings
