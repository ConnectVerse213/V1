import React,{useState,useEffect,useRef} from 'react'
import ResponsiveAppBar from './ResponsiveAppBar'
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import MessageIcon from '@mui/icons-material/Message';
import PeopleIcon from '@mui/icons-material/People';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import './Chat.css'
import SendIcon from '@mui/icons-material/Send';
import dayjs from "dayjs";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';




const usersCollectionRef1 = collection(db, "user");
const usersCollectionRef4 = collection(db, "chats");

function Chat() {

        const [buttonHight,setButtonHighlight]=useState(1)
        const [showChat1Div,setShowChat1Div]=useState(true)
        const [showChat2Div,setShowChat2Div]=useState([])
        const [usersData,setUsersData]=useState([])
        const [searchUser,setSearchUser]=useState('')
       
            
            const [makeComment,setMakeComment]=useState('')
            const [comments,setComments]=useState([])
            const [event_id,setEvent_id]=useState('')
            const [userName,setUserName]=useState('')
            const [profileImage,setProfileImage]=useState('')



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



            const getComments=async(userName,profileImage)=>{
            
                
            
                    console.log("userName",userName)
            
                    let data = await getDocs(usersCollectionRef4);
                                         
                     let chats=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            
                     let filteredArray=chats.filter(obj=>obj.People.includes(localStorage.getItem('userName')) && obj.People.includes(userName))
                                       
                     console.log("fileteredArray",filteredArray)
            
                     if(filteredArray.length!=0)
            
                      {
    
        
        
                     setShowChat2Div(filteredArray[0])
            
                    
                      }

                      else{

                       
                          setShowChat2Div(["not exist"])
                
                          return;
                        
                      }
            
                    
            
            
                     
            
                   }
            
                  const handleSendComment=async ()=>{
            
            
                      if(!(localStorage.getItem('profileImg') && localStorage.getItem('userName')))
                                {
                                  notifyCustom("Set up your profile to chat!","error")
                    
                                  setInterval(()=>{
                    
                                    window.location.href="/profilesettings"
                                  },4000)
            
                                  return;
                                }
            
                   
            
                 
            
            
            
                    
            
                       const data = await getDocs(usersCollectionRef4);
                                            
                        let chats=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            
                        let filteredArray=chats.filter(obj=>obj.People.includes(localStorage.getItem('userName')) && obj.People.includes(userName))
                                          
                        console.log("fileteredArray",filteredArray)
            
                        if(filteredArray.length==0)
            
                          {
                           
                           
                            const now = dayjs().format("YYYY-MM-DD HH:mm:ss");
                         
                            await addDoc(usersCollectionRef4, { People: [localStorage.getItem('userName'), userName], Chats: [{ Sender: localStorage.getItem('userName'), SentTo: userName, Message: makeComment, Timestamp: now }], Timestamp: now, ProfileImage: { [localStorage.getItem('userName')]: localStorage.getItem('profileImg'), [userName]: profileImage } });

                            setMakeComment("")

                            getComments(userName,profileImage)
                            
                            
                             
                           
                          }

                          else{

                            const userDoc1 = doc(db, "chats", filteredArray[0].id);
                            
                            const now = dayjs().format("YYYY-MM-DD HH:mm:ss");

                            const newFields1 = { People: [localStorage.getItem('userName'), userName], Chats: [...filteredArray[0].Chats,{ Sender: localStorage.getItem('userName'), SentTo: userName, Message: makeComment, Timestamp: now }], Timestamp: now, ProfileImage: { [localStorage.getItem('userName')]: localStorage.getItem('profileImg'), [userName]: profileImage } }
                                                
                                                        
                                                
                                                
                            await updateDoc(userDoc1, newFields1);

                            setMakeComment("")

                            getComments(userName,profileImage)

                          


                          }
            
                         
}


        const hasConersationWith=async(userName)=>{

            let data = await getDocs(usersCollectionRef4);
                                         
            let chats=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
   
            let filteredArray=chats.filter(obj=>obj.People.includes(localStorage.getItem('userName')) && obj.People.includes(userName))
                              
            console.log("fileteredArray",filteredArray)
   
            if(filteredArray.length!=0)
   
             {

                return filteredArray[0].Timestamp
           
             }

             else{

       
                 return ""
               
             }
   
           
        }

        const getUsers=async()=>{

            let data = await getDocs(usersCollectionRef1);
                                         
            let users=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

            let fileteredArray=users.filter(obj=>obj.UserName && obj.ProfileImage)

            for(let i=0;i<fileteredArray.length;i++)
                {
    
                    hasConersationWith(fileteredArray[i].UserName).then((a)=>{
                        if(a.length!=0)
                            {
                                fileteredArray[i].conversation=a
                            }
                            else{
                                fileteredArray[i].conversation="no"
                            }
                    })
                   
                }

            console.log("chalo",fileteredArray)

            setShowChat1Div(fileteredArray)

            setUsersData(fileteredArray)
            
                     
        }

        const scrollRef = useRef(null);

        useEffect(()=>{

            if(!localStorage.getItem('email'))
            {
               window.location.href="/oktologin"

            }

            if(localStorage.getItem('getChat'))

                {
                    let x=JSON.parse(localStorage.getItem('getChat'))
                    setUserName(x.UserName)
                    setProfileImage(x.ProfileImage)
                   getComments(x.UserName,x.ProfileImage)

                   localStorage.removeItem('getChat')
                }

           


           
              
            getUsers()
        },[])

        useEffect(()=>{

            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              }
        }
    
    ,[showChat2Div])
  return (
    <div>
        <br></br>
         <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" chatButtonStyle="contained" dashboardButtonStyle="outlined"/>
         <hr></hr>
            <br></br> <br></br>
        

           {showChat1Div.length!=0 && (
           <div style={{
            width: '100%',
            position: 'fixed',
            top:'12em',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            overflowY: 'hidden', // outer div doesn't scroll
            zIndex: 1000,
           }}>
             <div style={{
               width: '95%',
               height: '85vh', // panel height for scrolling content
               backgroundColor: 'black',
              
               boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
               overflow: 'hidden', // important to clip the content inside
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'space-between',
             }}>
               
               {/* Header */}
               <br></br>
         <br></br>   <br></br>
               <center>
               
                 <input placeholder='Search by Username' style={{
                  width: '80%',
                  height: '30px',
                  fontSize:'16px',
                  padding: '5px',
                  borderRadius: '5px',
                  border: '1px solid #555',
                  backgroundColor: '#111',
                  color: 'white'}} onChange={(e)=>{

                    setSearchUser(e.target.value)

                 }}></input>
               </center>

           

               <div style={{color:'white'}}>

               <div style={{display:'flex',flexDirection:'column',padding:'3em'}}>
                 {usersData.length!=0  && <div style={{color:'white'}}>
                    
                 {usersData.filter(person => {
                    const query = searchUser.toLowerCase().replace(/\s/g, '');
                    const userName = person.UserName.toLowerCase().replace(/\s/g, '');
                    const email = person.Email.toLowerCase().replace(/\s/g, '');
                  
                    return userName.includes(query) || email.includes(query);
                }).map((x)=>{

                    if(x.UserName!==localStorage.getItem('userName') ) return(

                       

                            <div class="people" onClick={()=>{
                               
                                setUserName(x.UserName)
                                setProfileImage(x.ProfileImage)
                               getComments(x.UserName,x.ProfileImage)
                            }} >

                            <div>

                            <img src={x.ProfileImage} style={{width:'3em',height:'3em',borderRadius:'50%',objectFit: 'cover'}}></img>

                            </div>

                            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
                                
                                <div> {x.UserName}</div>

                                {
                                    x.conversation==="no" &&  <div style={{color:'grey'}}> Chat</div>
                                }

                                {
                                    x.conversation && x.conversation!=="no" &&  <div style={{color:'grey'}}>{ dayjs(x.conversation).fromNow() 
                                    } </div>
                                }
 </div>

                            
                            

                            </div>

                    )
                })
                
                }
                    
                </div>}

                </div>



               </div>
         
               {/* Scrollable Comment Section */}
               <div style={{
                 flex: 1, // fill available space
                 overflowY: 'auto',
                 padding: '10px',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: '25px',
               }}>
                 
         
             
               </div>
             </div>
           </div>
         )}


      
        {showChat2Div.length !== 0 && (
        <div  style={{
            width: '100%',
            position: 'fixed',
            bottom:'0px',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            overflowY: 'hidden', // outer div doesn't scroll
            zIndex: 100000,
        }}>
          <div style={{
            width: '95%',
            height: '85vh', // panel height for scrolling content
            backgroundColor: 'black',
            
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden', // important to clip the content inside
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            
            {/* Header */}
            <div style={{
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#1876d1',
              padding: '10px',
            }} onClick={() => {
              setShowChat2Div([]);
              setMakeComment("");
            }}>
      <br></br>
              &nbsp;    
             <ArrowBackIosIcon/>
            </div>
      
            <center>
              <h2 style={{ color: 'white' }}>Chats</h2>
            </center>
      
            {/* Scrollable Comment Section */}
            <div ref={scrollRef} style={{
              flex: 1, // fill available space
              overflowY: 'auto',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '25px',
            }}>
              {showChat2Div.length !== 0 && showChat2Div[0] !== "not exist" && showChat2Div.Chats.map((x, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px' }}>
                  <div>

                    { x.Sender===localStorage.getItem('userName') &&
                         <img
                         src={localStorage.getItem('profileImg')}
                         alt="profile"
                         style={{
                           width: '1.5em',
                           height: '1.5em',
                           borderRadius: '50%',
                           objectFit: 'cover'
                         }}
                       />
                    }

            { x.Sender!=localStorage.getItem('userName') &&
                                    <img
                                    src={profileImage}
                                    alt="profile"
                                    style={{
                                    width: '1.5em',
                                    height: '1.5em',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                         }}
                       />
                    }
                   



                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      
                    <div style={{display:'flex',gap:'7px'}}>
                    <label style={{ color: 'white', fontSize: '14px' }}><b>{x.Sender}</b></label>
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
                value={makeComment}
                onChange={(e) => setMakeComment(e.target.value)}
              />
              <Button onClick={()=>{handleSendComment()}}>
                <SendIcon fontSize="large" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div style={{display:'flex',justifyContent:'center', gap:'5px'}}>
         
         {buttonHight==1 && <Button variant="contained" style={{borderRadius:'0px'}} onClick={()=>{
           
       }}>Chat &nbsp; <MessageIcon/> </Button>}
        {buttonHight!=1 && <Button variant="outlined" style={{borderRadius:'0px',border:'#1876d1 0.09px solid', color:'#1876d1'}} onClick={()=>{
            setButtonHighlight(1)

            setShowChat1Div(true)
           
       }}>Chat &nbsp; <MessageIcon/>  </Button>}

       {buttonHight==2 && <Button variant="contained" style={{borderRadius:'0px'}} onClick={()=>{
           window.location.href="/community"
       }}>Community &nbsp; <PeopleIcon/></Button>}

       {buttonHight!=2 && <Button variant="outlined" style={{borderRadius:'0px',border:'#1876d1 0.09px solid', color:'#1876d1'}} onClick={()=>{
             window.location.href="/community"
            
             
       }}>Community &nbsp; <PeopleIcon/></Button>}
       
        
       
       </div>
<ToastContainer/>

    </div>
  )
}

export default Chat