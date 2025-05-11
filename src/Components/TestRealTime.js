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
import { useParams } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ToastContainer, toast } from 'react-toastify';
import PeopleIcon from '@mui/icons-material/People';

const Chat = () => {

      const { community_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isReply,setIsReply]=useState("")
  const [showChatDiv,setShowChatDiv]=useState(false)

  const scrollRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "community"))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const filteredArray = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => doc.id === community_id);

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

   let filteredArray=communities.filter(obj=>obj.id==community_id)

     const userDoc1 = doc(db, "community", filteredArray[0].id);
    
    const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

     
        if(filteredArray[0].Participants.includes(localStorage.getItem('email')))

            {
                const newFields1 = {Creator:filteredArray[0].Creator, Name:filteredArray[0].Name ,Description: filteredArray[0].Description,Chats:[...filteredArray[0].Chats,{SenderEmail:localStorage.getItem('email'),SenderUserName:localStorage.getItem('userName'),ProfileImage:localStorage.getItem('profileImg'),Message:newMessage,Timestamp:now,ChatId:filteredArray[0].Chats.length-1,isReply:isReply}],Timestamp: now,Participants:[...filteredArray[0].Participants]}

                await updateDoc(userDoc1, newFields1);
            }

        else
        {

            const newFields1 = {Creator:filteredArray[0].Creator, Name:filteredArray[0].Name ,Description: filteredArray[0].Description,Chats:[...filteredArray[0].Chats,{SenderEmail:localStorage.getItem('email'),SenderUserName:localStorage.getItem('userName'),ProfileImage:localStorage.getItem('profileImg'),Message:newMessage,Timestamp:now,ChatId:filteredArray[0].Chats.length-1,isReply:isReply}],Timestamp: now,Participants:[...filteredArray[0].Participants,localStorage.getItem('email')]}

            await updateDoc(userDoc1, newFields1);
        }

       


 
                     
                               // update
                     
                     
   


    setNewMessage("");
  };


   const notifyCustom = (text,type) => toast(text,{
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                type:type
               
                });

  return (
    <div style={{overflowX:'hidden'}}>
     <br></br>{messages && messages.length!=0 && 
            <div style={{display:'flex',alignItems:'center',gap:'5px', position:'sticky',width:'100%',justifyContent:'space-between',paddingLeft:'2em',borderBottom:'0.1px solid #1876d1',flexWrap:'wrap',backgroundColor:'black',padding:'1em',paddingRight:'3em',height:'2em',zIndex:'999999'}}>


                <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'5px'}}>

                <div>

                <Button style={{color:'white'}} onClick={()=>{
                    window.location.href="/community"
                }}><ArrowBackIosIcon fontSize="small"/></Button>

                </div>

                <img src={messages.ProfileImage} style={{width:'2.5em',height:'2.5em',borderRadius:'50%',objectFit: 'cover'}}></img>


                <l style={{ color: 'white' , fontSize:'16px'}}><b>{messages.Name} &nbsp;&nbsp;&nbsp;&nbsp;</b></l>

                </div>

                <div style={{display:'flex',alignItems:'center',flexWrap:'wrap',paddingRight:'2em',gap:'13px'}}> 

              

              {!showChatDiv && <MoreHorizIcon style={{backgroundColor:'#1876d1',borderRadius:'50%',color:'white'}} onClick={()=>{
                setShowChatDiv(true)
              }} fontSize="small"/>}

            {showChatDiv && <MoreVertIcon style={{backgroundColor:'#1876d1',borderRadius:'50%',color:'white'}} onClick={()=>{
                setShowChatDiv(false)
              }} fontSize="small"/>}

                    
               
                
             

                </div>

              
                   
                 
                   
                    
                   
                   
                    </div>
}
        
         {messages && messages.length!=0 && (
        <div style={{
            width: '100%',
            position: 'fixed',
            top:'0px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            overflowY: 'hidden', // outer div doesn't scroll
            zIndex: 100000,
        }}>
          <div style={{
             width: '100%',
             height: '90vh', // panel height for scrolling content
             backgroundColor: 'black',
             
             boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
             overflow: 'hidden', // important to clip the content inside
             display: 'flex',
             flexDirection: 'column',
             justifyContent: 'space-between',
          }}>
            <br></br>
            
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
                <div key={index} style={{ display: 'flex', gap: '10px', alignItems:'flex-end' }}>
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
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start',gap:'5px', backgroundColor: x.SenderUserName !== localStorage.getItem('userName') ? 'rgb(65, 65, 65)' : '#1876d1',padding:'1em',borderRadius:'5px'}}>


                 
                    <div style={{display:'flex',gap:'7px'}} id={`ChatId=${x.ChatId}`} >

                    <label style={{ color: 'white', fontSize: '14px' }}><b>{x.SenderUserName!=localStorage.getItem('userName')?x.SenderUserName : "You"}</b></label>
                   
            
                    
                    <div style={{color:'white', fontSize: '14px'}}>{x.Timestamp && dayjs(x.Timestamp).fromNow() 
                    }</div>

      
                    </div>

                    {x.isReply && x.isReply.length!=0 && 
                

                <a style={{textDecoration:'none'}} href={`#ChatId=${parseInt(x.isReply.slice(
                    x.isReply.indexOf('|') + 1,
                    x.isReply.indexOf('|', x.isReply.indexOf('|') + 1)
                  )
                  )}`}> <div style={{ display:'flex',flexDirection:'column',justifyContent:'space-between' ,gap:'10px',overflow: 'hidden',borderRadius:'5px',backgroundColor: x.isReply.slice(2,x.isReply.indexOf('|')) == x.SenderUserName  && x.SenderUserName ==localStorage.getItem('userName') ? '#82a7cd' : x.SenderUserName ==localStorage.getItem('userName') && x.SenderUserName!=x.isReply.slice(2,x.isReply.indexOf('|')) ?'#82a7cd':x.isReply.slice(2,x.isReply.indexOf('|'))==x.SenderUserName ? 'grey': 'grey' , alignItems:'flex-start',padding:'1em'}}>

                   
                    <label style={{ color:'white', cursor: 'pointer',fontSize:'14px'}} >

                       <b>{x.isReply.slice(2,x.isReply.indexOf('|'))===localStorage.getItem('userName')?"You":x.isReply.slice(2,x.isReply.indexOf('|'))}</b> 
                   </label>
                
                    <div style={{ color:'white', cursor: 'pointer',fontSize:'14px',textAlign:'left'}} >

                

                        <div style={{maxHeight:'2.4em',overflow: 'hidden',padding:'2px'}}>{x.isReply.slice(x.isReply.indexOf('|',x.isReply.indexOf('|')+1)+1)}</div>
                       
                    </div>

                    
                       


                    </div>
                    </a>
                
                
                }
      
                    
                    <div
                        style={{ color: 'grey', cursor: 'pointer',display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'10px' }}
                        onClick={() => {

                            setIsReply(`@(${x.SenderUserName}|${x.ChatId}|${x.Message})`)
                           

                        }
                        
                        } 
                    >

           
                     <div style={{ color: 'white', textAlign: 'left' }} >{x.Message}</div>
                   
                        <label style={{color: 'white',fontSize: '14px'}}> Reply</label>
                       
                    </div>
      
                   
                  </div>
      
                  
                </div>
              ))}
              <br></br>
            </div>
      <br></br>
            {/* Fixed Input Section */}
            <div style={{
                position:'fixed',
                bottom:'0px',
                width:'100%',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '1px solid #444',
              backgroundColor: '#000',
            }}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',width:'100%',gap:'2em'}}>

                {isReply.length!=0 && 
                

                <div style={{ display:'flex',justifyContent:'space-between' ,gap:'10px'}}>
                
                    <label style={{ color: 'grey', cursor: 'pointer',fontSize:'16px'}} >

                        Replying to {isReply.slice(2,isReply.indexOf('|'))}
                    </label>

                    <CancelIcon style={{color:'white'}} fontSize='small' onClick={()=>{
                        setIsReply("")
                    }} />



                    </div>
                
                
                }

                <div style={{display:'flex', width:'100%'}}>

                <input
                style={{
                  width: '100%',
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
          </div>
        </div>
      )}


{showChatDiv &&  <div style={{
          width: '150px', 
          height: '180px',
          padding: '20px', 
         color:'white',
          backgroundColor: 'black', 
          border: '2px solid #1876d1',
          borderRadius:'10px',
          blur:'50px', 
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          position: 'absolute', 
          top: '5%', 
          right: '-40px', 
          transform: 'translateX(-50%)',
          zIndex: 9999,
          animation: 'popupAnimation 0.5s ease',
           
        }}>
          <div style={{width:'100%',textAlign:'left',cursor:'pointer'}} onClick={()=>{
            setShowChatDiv(false)
          }}>
          <CancelIcon style={{left:'2px'}} fontSize="small"/>
          </div>
          <br></br>
          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}} class="dashboardDivMenu" onClick={()=>{
            window.location.href=`/groupinfo/${community_id}`
          }}><DescriptionIcon/> <l>Group Info</l></div>
          <br></br>
          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}} class="dashboardDivMenu" onClick={()=>{
           notifyCustom("Coming Soon!","default")
          }}><PaidIcon/>  Airdrop </div>
          <br></br>
          
          <div style={{width:'100%',borderRadius:'0',textAlign:'left',display:'flex',alignItems:'center',gap:'4px',cursor:'pointer'}} class="dashboardDivMenu" onClick={()=>{
            window.location.href="/testing3"
          }}><PeopleIcon/> Add Members</div>

        




       
          
      
        </div>}

     <ToastContainer/>
    </div>
  );
};

export default Chat;
