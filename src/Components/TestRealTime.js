import React, { useEffect, useState, useRef} from "react";
import { collection, getDocs,updateDoc, doc, deleteDoc,addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../firebase-config.js";

import dayjs from "dayjs";
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import ResponsiveAppBar from "./ResponsiveAppBar.js";
import DescriptionIcon from '@mui/icons-material/Description';
import PaidIcon from '@mui/icons-material/Paid';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const scrollRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "community"))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const filteredArray = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => doc.Name === "ConnectVerse Community");

      if (filteredArray.length > 0) {
        setMessages(filteredArray[0]);
        console.log("Matched Document:", filteredArray[0]);
      } else {
        setMessages(null);
        console.log("No matching document found");
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  useEffect(()=>{
  
              if (scrollRef.current) {
                  scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
          }
      
      ,[messages])

//   const sendMessage = async () => {x
//     if (!newMessage.trim()) return;

//     await addDoc(collection(db, "community"), {
//       text: newMessage,
//       timestamp: serverTimestamp(),
//     });

//     setNewMessage("");
//   };


  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const data = await getDocs(collection(db, "community"));
                                    
   let communities=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

   let filteredArray=communities.filter(obj=>obj.Name=="ConnectVerse Community")

     const userDoc1 = doc(db, "community", filteredArray[0].id);
    
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

 const newFields1 = {Creator:filteredArray[0].Creator, Name:filteredArray[0].Name ,Description: filteredArray[0].Description,Chats:[...filteredArray[0].Chats,{SenderEmail:localStorage.getItem('email'),SenderUserName:localStorage.getItem('userName'),ProfileImage:localStorage.getItem('profileImg'),Message:newMessage,Timestamp:now}],Timestamp: now}
                     
                               // update
                     
                     
    await updateDoc(userDoc1, newFields1);


    setNewMessage("");
  };

  return (
    <div >
     <br></br>
        
         {messages && messages.length!=0 && (
        <div style={{
          width: '100%',
          position: 'fixed',
          bottom:'0px',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'hidden', // outer div doesn't scroll
          zIndex: 1000,
        }}>
          <div style={{
            width: '100%',
            height: '100vh', // panel height for scrolling content
            backgroundColor: 'black',
            
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden', // important to clip the content inside
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <br></br>
            {messages && messages.length!=0 && 
            <div style={{display:'flex',alignItems:'center',gap:'5px', position:'sticky',width:'100%',justifyContent:'space-between',paddingLeft:'2em',borderBottom:'0.1px solid #1876d1',flexWrap:'wrap',backgroundColor:'black',padding:'1em',paddingRight:'3em'}}>


                <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'5px'}}>

                <img src={messages.ProfileImage} style={{width:'3.5em',height:'3.5em',borderRadius:'50%',objectFit: 'cover'}}></img>


                <l style={{ color: 'white' , fontSize:'24px'}}>{messages.Name}</l>

                <div style={{display:'flex',alignItems:'center',flexWrap:'wrap'}}> 

                <div>

                <Button style={{color:'white'}}><ArrowBackIosIcon/></Button>

                </div>

                    
                <Button style={{color:'white'}} ><DescriptionIcon/> &nbsp; Description</Button>
                <Button style={{color:'white'}}><PaidIcon/> &nbsp; Airdrop</Button>
                
                </div>

                </div>

              
                   
                 
                   
                    
                   
                   
                    </div>
}
<br></br><br></br>
           
      
          

        
      
            {/* Scrollable Comment Section */}
            <div ref={scrollRef}  style={{
              flex: 1, // fill available space
              overflowY: 'auto',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '25px',
            }}>
              { messages.Chats.map((x, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px' }}>
                  <div>
                    <img
                      src={x.ProfileImage}
                      alt="profile"
                      style={{
                        width: '1.5em',
                        height: '1.5em',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      
                    <div style={{display:'flex',gap:'7px'}}>
                    <label style={{ color: 'white', fontSize: '14px' }}><b>{x.SenderUserName}</b></label>
                    <div style={{color:'white', fontSize: '14px'}}>{x.Timestamp && dayjs(x.Timestamp).fromNow() 
                    }</div>
      
                    </div>
                    
      
                    <div style={{ color: 'white', textAlign: 'left' }}>{x.Message}</div>
                   
                  </div>
      
                  
                </div>
              ))}
            </div>
      
            {/* Fixed Input Section */}
            <div style={{
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '1px solid #444',
              backgroundColor: '#000',
            }}>
              <input
                style={{
                  width: '80%',
                  height: '30px',
                  fontSize:'16px',
                  padding: '5px',
                  borderRadius: '5px',
                  border: '1px solid #555',
                  backgroundColor: '#111',
                  color: 'white'
                }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button onClick={sendMessage}>
                <SendIcon fontSize="large" />
              </Button>
            </div>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default Chat;
