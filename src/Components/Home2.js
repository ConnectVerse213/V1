import React,{useEffect, useState,useRef} from 'react'
import { useOkto } from "okto-sdk-react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { QRCodeCanvas } from 'qrcode.react';
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
import coinImg from '../assets/images/coinImg.png'
import Alert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';
import './Home2.css'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import Confetti from 'react-confetti'
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CategoryIcon from '@mui/icons-material/Category';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import ResponsiveAppBar from './ResponsiveAppBar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CountUp from 'react-countup';
import coinAnimation from '../assets/images/coinBackground3.gif'
// import { signInWithGoogle } from "../firebase-config";
const usersCollectionRef = collection(db, "user");
const usersCollectionRef2 = collection(db, "ticket");

function Home2() {

    const [randomNumber, setRandomNumber] = useState('');
    const [showQR, setShowQR] = useState(false);
    const qrRef = useRef();
  
    const generateNumber = async(id) => {
      const number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setRandomNumber(number);
      const result=await addDoc(usersCollectionRef2, {TicketId:number+localStorage.getItem('email'),EventId:id});
    
      console.log(result.id)
    
     

      setShowQR(false);
    };
  
 const notify = () => toast("Coming Soon!",{
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
     
      });

      const notifyGift = () => toast("100 coins claimed!",{
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        type:'success'
       
        });
      const notifyClipboard = () => toast("Event link copied to clipboard !",{
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
       
        });
    
    const downloadQRCode = () => {
      const qrCanvas = qrRef.current.querySelector('canvas');
      const originalSize = qrCanvas.width; // typically 200
      const quietZone = 60; // padding around QR
      const totalSize = originalSize + quietZone * 2;
  
      // Create new canvas
      const newCanvas = document.createElement('canvas');
      newCanvas.width = totalSize;
      newCanvas.height = totalSize;
  
      const ctx = newCanvas.getContext('2d');
  
      // Fill background with white
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, totalSize, totalSize);
  
      // Draw original QR canvas onto new one with padding offset
      ctx.drawImage(qrCanvas, quietZone, quietZone);
  
      // Download
      const url = newCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `QRCode_${randomNumber}.png`;
      link.click();
    };
  
    // 🧠 Update canvas class after render
    useEffect(() => {
      const canvas = qrRef.current?.querySelector('canvas');
      if (canvas) {
        canvas.style.transition = 'filter 0.5s ease';
        canvas.style.filter = showQR ? 'blur(0px)' : 'blur(8px)';
      }
    }, [showQR, randomNumber]);

    const usersCollectionRef = collection(db, "events");
        const usersCollectionRef1 = collection(db, "user");
    const [coins,setCoins]=useState(localStorage.getItem('coins')?localStorage.getItem('coins'):0)
    const { showWidgetModal, closeModal } = useOkto();
    const { createWallet, getUserDetails, getPortfolio } = useOkto();
    const [createdEvents,setCreatedEvents]=useState([])
    const [allEvents,setAllEvents]=useState([])
    const [registeredEvents,setRegisteredEvents]=useState([])
    const [userApprovedArray,setUserApprovedArray]=useState([])
    const [showConfetti,setShowConfetti]=useState(localStorage.getItem('count')?false:true)
    const [showDiv,setShowDiv]=useState(localStorage.getItem('count')?false:true)
    const [buttonHight,setButtonHighlight]=useState(1)
    const [trendingEvents,setTrendingEvents]=useState([])


    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };
    const createUser = async (email) => {

            try{
                await addDoc(usersCollectionRef, { Email:email, Coins: 100, EventsCreated: [], EventsRegistered: [], EventsAttended: []});
            }
            catch{
                alert('Problem Creating User')
            }
          
           
          };

          const DrawerList = (
            <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
              <List>
                {['DeFi', 'GameFi',"SocialFi", 'AI Agents', 'L1',"L2","L3","LLM","Other Technologies","Non Tech"].map((text, index) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton>
                     
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
             
            </Box>
          );

    useEffect(()=>{
        getUserDetails()
        .then((result) => {
            if(!localStorage.getItem('email'))
            {
              localStorage.setItem('email',result.email)
             
             
              window.location.reload()
            }
           
            
        })
        .catch((error) => {
            console.error(`error:`, error);
        });
      },[])

      const getUserId=async ()=>{

        let data = await getDocs(usersCollectionRef1);
                                   
                    let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                  
                                   
                    let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))
                    console.log(filteredArray)
        
                    let userRegistrationsFound=filteredArray[0].EventsRegistered
                    let userApprovedFound=filteredArray[0].EventsApproved
                    let userCreationsFound=filteredArray[0].EventsCreated
                    setUserApprovedArray(userApprovedFound)
                    

                    let data1 = await getDocs(usersCollectionRef);
                                   
                    let eventsTemp=await data1.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                    setAllEvents(eventsTemp)

                    const newArray = [...eventsTemp]; 
                    newArray.sort(() => Math.random() - 0.5); 

                    setTrendingEvents(newArray);
                    console.log("trending events",trendingEvents)
                    

                    let eventsCreatedFound=eventsTemp.filter(obj =>  userCreationsFound.includes(obj.id))
                    let eventsRegistrationsFound=eventsTemp.filter(obj =>  userRegistrationsFound.includes(obj.id))
                    
                    console.log("eventsCreatedFound",eventsCreatedFound)
                    console.log("eventsRegistrationsFound",eventsRegistrationsFound)
                    setCreatedEvents(eventsCreatedFound)
                    setRegisteredEvents(eventsRegistrationsFound)
                   
                  
        
                   

      }
      useEffect(()=>{
        getUserId()
      },[])
    
  return (
    <div>
      <br></br>
           <ResponsiveAppBar/>
    

{showConfetti && <Confetti 
      width={"1500px"}
      height={"800px"}
    />}
{showDiv && (
        <div style={{
          width: '330px', 
          height: '400px',
          padding: '20px', 
          backgroundColor: '#fff', 
          border: '1px solid #ddd', 
          textAlign: 'center', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
          position: 'absolute', 
          top: '20%', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 9999,
          animation: 'popupAnimation 0.5s ease',
        }}>
          <h1>Congratulations!</h1>
          <img  style={{width: '130px', 
    height: '100px', 
    objectFit: 'cover' }}  src={coinImg}></img>
          <br></br>
          <h1>100</h1>
          <p>You just won 100 coins !</p>
          <br></br>
          <center>
          <button class="button-85" onClick={()=>{
            if(localStorage.getItem('coins') && localStorage.getItem('coins')==100 )
            {
             setShowDiv(false)
             setShowConfetti(false)
             localStorage.setItem('count',1)
             notifyGift()
            }
            
           
          }}>Claim</button>
          </center>
        </div>
      )}

      {/* Keyframes for animation */}
      <style>
        {`
          @keyframes popupAnimation {
            0% {
              opacity: 0;
              transform: translateX(-50%) scale(0.5);
            }
            100% {
              opacity: 1;
              transform: translateX(-50%) scale(1);
            }
          }
        `}
      </style>


      {/* <div className="full-width-bar" >
        <div class="logo" >  <img src={logo} style={{width:'3em'}} alt="Logo" /></div>
       

        <div style={{color:'white'}} >

  
      <Button  variant="contained" style={{borderRadius:'0px'}} >Events</Button>
      <Button variant="outlined" style={{color:'#1876d1'}} style={{borderRadius:'0px'}} onClick={notify} >Concerts</Button>
      <Button variant="outlined" style={{color:'#1876d1'}} style={{borderRadius:'0px'}} onClick={notify} >Movies</Button>
      <Button  variant="outlined" style={{color:'#1876d1'}} style={{borderRadius:'0px'}} onClick={notify} >Sports</Button>
    


        </div>
          
            <div className="text" > <Button  onClick={()=>{
              showWidgetModal()
            }}> <AccountBalanceWalletIcon/></Button></div>
          </div> */}


      {/* <hr></hr> */}

  

<div style={{
  background: 'rgba(255, 255, 255, 0)',
  backgroundImage:`url(${coinAnimation})`,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  backdropFilter: 'blur(2.5px)',
  WebkitBackdropFilter: 'blur(2.5px)',

  borderBottom: '0.2px solid white',
  borderTop: '0.2px solid white',
 
  backgroundSize: 'cover', // Ensures the image covers the entire area without distortion
  backgroundPosition: 'center center', // Centers the image within the div
  backgroundRepeat: 'no-repeat', // Prevents repeating of the image

}}>
  

      <div class="coin" style={{marginLeft:'0%',marginTop:'0%'
        }}> 

    
    <img src={coinImg} style={{width: '130px', 
    height: '200px', 
    objectFit: 'cover' }} alt="Logo"  />   <l style={{fontSize:"52px"}}><CountUp start={coins-100} end={coins} /></l></div>
     
<Button variant="contained" style={{border:"green 0.5px solid",backgroundColor:'green'}}>Leaderboard &nbsp; <LeaderboardIcon/></Button>
<br></br><br></br>


</div>

{/* <hr style={{ border: 'none', height: '0.1px', backgroundColor: '#1876d1', margin: '20px 0' }} /> */}
<br></br> 
<br></br>
<div style={{display:'flex',justifyContent:'center', gap:'5px'}}>

  {buttonHight==1 && <Button variant="contained" style={{borderRadius:'0px'}} onClick={()=>{
    
}}>All </Button>}
 {buttonHight!=1 && <Button variant="outlined" style={{borderRadius:'0px',border:'#1876d1 0.09px solid', color:'#1876d1'}} onClick={()=>{
     setButtonHighlight(1)
}}>All </Button>}
{buttonHight==2 && <Button variant="contained" style={{borderRadius:'0px'}} onClick={()=>{
    
}}>Trending &nbsp;<WhatshotIcon style={{color:'red'}}/></Button>}
{buttonHight!=2 && <Button variant="outlined" style={{borderRadius:'0px',border:'#1876d1 0.09px solid', color:'#1876d1'}} onClick={()=>{
      setButtonHighlight(2)
      
}}>Trending &nbsp;<WhatshotIcon style={{color:'red'}}/></Button>}

  {buttonHight==3 && <Button variant="conatined"  style={{borderRadius:'0px',backgroundColor:'#1876d1',color:'white'}} onClick={()=>{
       
  }}>Category &nbsp;<CategoryIcon /></Button>}


    {buttonHight!=3 &&  <Button variant="outlined" style={{borderRadius:'0px', border:'#1876d1 0.09px solid', color:'#1876d1'}} onClick={()=>{
      if(open==false)
      {
        setOpen(true)
      }
      else{
        setOpen(false)
      }
       
       setButtonHighlight(3)
      
      }}>Category &nbsp;<CategoryIcon style={{color:'white'}} /></Button>}

</div>

    
<br></br><br></br>
{trendingEvents.length==0 && buttonHight==2 && <h2 style={{color:'white'}}>Trending</h2>}
{trendingEvents.length!=0 && buttonHight==2 && <h2 style={{color:'white'}}>Trending</h2>}

<div className="events">

{trendingEvents.length!=0 && buttonHight==2 &&  trendingEvents.map((x)=>{
  return(

    <Card sx={{ maxWidth: 345 }} style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
      <CardActionArea>
        <br></br>
        <img style={{width:'20em'}} src={x.Image}></img>
       
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
          {x.Name}
          </Typography>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'left'}}>
       
        </Typography>

          <br></br>
          <Button variant="outlined" onClick={()=>{
            window.location.href=`/manageevent/${x.id}`
          }}>Manage  </Button>
            
          <Button variant="outlined" onClick={()=>{
            navigator.clipboard.writeText(`https://v1-six-liart.vercel.app/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button>
        
        </CardContent>
      </CardActionArea>
    </Card>
   
  )
})}
</div>

<br></br>
{allEvents.length==0 && <h2 style={{color:'white'}}>All</h2>}
{allEvents.length!=0 && <h2 style={{color:'white'}}>All</h2>}

<div className="events">

{allEvents.length!=0 && allEvents.map((x)=>{
  return(

    <Card sx={{ maxWidth: 345 }} style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
      <CardActionArea>
        <br></br>
        <img style={{width:'20em'}} src={x.Image}></img>
       
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
          {x.Name}
          </Typography>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'left'}}>
       
        </Typography>

          <br></br>
          <Button variant="outlined" onClick={()=>{
            window.location.href=`/manageevent/${x.id}`
          }}>Manage  </Button>
            
          <Button variant="outlined" onClick={()=>{
            navigator.clipboard.writeText(`https://v1-six-liart.vercel.app/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button>
        
        </CardContent>
      </CardActionArea>
    </Card>
   
  )
})}
</div>
<br></br>
<hr></hr>
<br></br>
{createdEvents.length==0 && <h2 style={{color:'white'}}>Created(0)</h2>}
{createdEvents.length!=0 && <h2 style={{color:'white'}}>Created({createdEvents.length})</h2>}

<div className="events">

{createdEvents.length!=0 && createdEvents.map((x)=>{
  return(

    <Card sx={{ maxWidth: 345 }} style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
      <CardActionArea>
        <br></br>
        <img style={{width:'20em'}} src={x.Image}></img>
       
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
          {x.Name}
          </Typography>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'left'}}>
       
        </Typography>

          <br></br>
          <Button variant="outlined" onClick={()=>{
            window.location.href=`/manageevent/${x.id}`
          }}>Manage  </Button>
            
          <Button variant="outlined" onClick={()=>{
            navigator.clipboard.writeText(`https://v1-six-liart.vercel.app/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button>
        
        </CardContent>
      </CardActionArea>
    </Card>
   
  )
})}
</div>
<br></br>
<hr></hr>
<br></br>

{registeredEvents.length==0 && <h2 style={{color:'white'}}>Registered(0)</h2>}
{registeredEvents.length!=0 && <h2 style={{color:'white'}}>Registered({registeredEvents.length})</h2>}
<div className="events">
{registeredEvents.length!=0 && registeredEvents.map((x)=>{
  return(
    <div style={{border:'2px solid black',color:'white'}}>
      
      <Card sx={{ maxWidth: 345 }} style={{marginTop:'10%', background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
      <CardActionArea>
        <br></br>
        <img style={{width:'20em'}} src={x.Image}></img>
       
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
          {x.Name}
          </Typography>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'left'}}>
       
        </Typography>

          <br></br>
          {userApprovedArray.includes(x.id) ? <div>{randomNumber && (
              <>
 
      
                <div ref={qrRef}>
                  <QRCodeCanvas value={randomNumber+localStorage.getItem('email')} size={200}  
            quietZone={30}  />
                </div>
      
                {!showQR && (
                  <button
                    onClick={() => setShowQR(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
                  >
                    Show QR Code
                  </button>
                )}
      
                {showQR && (
                  <button
                    onClick={downloadQRCode}
                    className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                  >
                    Download QR Code
                  </button>
                )}
              </>
            )}
            <br></br>
           {randomNumber=='' &&  <Button variant='outlined' color="success"
        onClick={()=>{

         window.location.href=`/qr/${x.id}`

        }}
        className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition"
      >
       Get Ticket
      </Button>} 

            
            </div>:<Button variant="outlined">Approval Pending</Button>}
            <Button variant="outlined" onClick={()=>{
            navigator.clipboard.writeText(`http://localhost:3000/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button>
        </CardContent>
      </CardActionArea>
    </Card>
     
    
      </div>
  )
})}
</div>

<ToastContainer/>
<Box
  sx={{
    position: 'fixed',   // Fixes it relative to the viewport
    bottom: 30,          // 16px from the bottom
    right: 16,           // 16px from the right
    zIndex: 1000,        // Ensure it stays above other elements
    '& > :not(style)': { m: 1 },
  }}

  onClick={()=>{
    window.location.href="/creator"
  }}
>
  <Fab color="primary" aria-label="add"  size="large">
    <AddIcon />
  </Fab>
</Box>
<Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>

    </div>
  )
}

export default Home2
