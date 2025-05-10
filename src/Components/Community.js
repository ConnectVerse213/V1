import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  query
} from "firebase/firestore";
import { db } from "../firebase-config.js";

import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import ResponsiveAppBar from "./ResponsiveAppBar.js";
import DescriptionIcon from '@mui/icons-material/Description';
import PaidIcon from '@mui/icons-material/Paid';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import dayjs from "dayjs";

const Chat = () => {
 
  const [name,setName]=useState('')
  const [description,setDescription]=useState('')
  const [createdCommunities, setCreatedCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);

  const scrollRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "community"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const email = localStorage.getItem('email');

      const filteredArray = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => doc.Creator === email);

     console.log(filteredArray)

      const filteredArray1 = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => doc.Participants?.includes(email));

        console.log(filteredArray1)

      setCreatedCommunities(filteredArray);
      setJoinedCommunities(filteredArray1);
    });

    return () => unsubscribe();
  }, []);


  const createCommunity=async()=>{

    
                   
                   
                    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
                 
                      await addDoc(collection(db,"community"), {Name:name,Description:description, Chats:[],Creator:localStorage.getItem('email'),ProfileImage:localStorage.getItem('profileImg'),Timestamp:now,Participants:[localStorage.getItem('email')]});
    
  }

  return (
    <div>
      <br />
      <h1 style={{ color:'white'}}>Community</h1>
      <br></br>

      <input onChange={(e)=>{

        setName(e.target.value)

      }}></input> <input onChange={(e)=>{

        setDescription(e.target.value)

      }}></input>

      <button onClick={()=>{

        createCommunity()
      }}>Create Community</button>
      <br></br>

      <h3 style={{color:'white'}}>Created Communities</h3>
      {createdCommunities && createdCommunities.length !== 0 && createdCommunities.map((x)=>{

        return (
        <div style={{

          maxWidth: '20em',
         
          display: 'flex',
          flexDirection:'column',
          justifyContent: 'center',
          border:'2px solid white',
          color:'white',
          gap:'5px'
        }} onClick={()=>{

            window.location.href=`/testing3/${x.id}`
        }}>
           
       <l>{x.Name}  </l> 

       <l>Created by {x.Creator}  </l> 

       <l>{x.Description}  </l> 



         
        </div>

       ) })}

   <br></br>

   <hr></hr>

   <h3 style={{color:'white'}}>Joined Communities</h3>
      {joinedCommunities && joinedCommunities.length !== 0 && joinedCommunities.map((x)=>{

        return (
        <div style={{

            maxWidth: '20em',
           
            display: 'flex',
            flexDirection:'column',
            justifyContent: 'center',
            border:'2px solid white',
            color:'white',
            gap:'5px'
          }} onClick={()=>{

            window.location.href=`/testing3/${x.id}`
        }}>
             
         <l>{x.Name}  </l> 
  
         <l>Created by {x.Creator}  </l> 
  
         <l>{x.Description}  </l> 
  
         
        </div>

       ) })}


    </div>
  );
};

export default Chat;

