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
import EventIcon from '@mui/icons-material/Event';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/Comment';
import axios from 'axios';
import { getCode } from 'country-list';
// import { signInWithGoogle } from "../firebase-config";
const usersCollectionRef = collection(db, "user");
const usersCollectionRef2 = collection(db, "ticket");

const getEmojiFlag = (address) =>
{

  let countryName=address.slice(address.lastIndexOf(",") + 2)
  console.log(countryName.length)
  
  if(countryName.toLowerCase()=="united states")
  {
    countryName="United States of America"
  }
  
  const code = getCode(countryName);
  if (!code) return '🏳️'; // fallback for unknown countries

  return String.fromCodePoint(
    ...[...code.toUpperCase()].map(char => 127397 + char.charCodeAt()))

}
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

      const notifyGift = (value) => toast(`You just claimed ${value} coins`,{
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
    
        const apiKey = "pk.55c533ac3f7777ffcef9fb76448b8fd2"; 

  // Function to get the city
  
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
  
  

    const usersCollectionRef = collection(db, "events");
        const usersCollectionRef1 = collection(db, "user");
    const [coins,setCoins]=useState(localStorage.getItem('coins')?localStorage.getItem('coins'):0)
    const [prevCoins,setPrevCoins]=useState(0)
    const { showWidgetModal, closeModal } = useOkto();
    const { createWallet, getUserDetails, getPortfolio } = useOkto();
    const [createdEvents,setCreatedEvents]=useState([])
    const [allEvents,setAllEvents]=useState([])
    const [registeredEvents,setRegisteredEvents]=useState([])
    const [userApprovedArray,setUserApprovedArray]=useState([])
    const [showConfetti,setShowConfetti]=useState(false)
    const [showDiv,setShowDiv]=useState(false)
    const [buttonHight,setButtonHighlight]=useState(1)
    const [trendingEvents,setTrendingEvents]=useState([])
    const [city,setCity]=useState('')

    async function getCityFromAddress(address) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(address)}`;
  
      const response = await fetch(url, {
          headers: {
              'User-Agent': 'YourAppName/1.0 (your@email.com)'
          }
      });
  
      const data = await response.json();
  
      if (data.length > 0) {
          const address = data[0].address;
          return address.city || address.town || address.village || address.county || null;
      } else {
          return null;
      }
  }
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen) => () => {
      setOpen(newOpen);
    };

    function formatDate(dateStr) {
      const date = new Date(dateStr);
    
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' }); // e.g., "Feb"
      const year = date.getFullYear();
    
      // Get ordinal suffix for day
      const getOrdinal = (n) => {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
    
      return `${day}${getOrdinal(day)} ${month}, ${year}`;
    }
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

   

      const isUserExist=async ()=>{

        let data = await getDocs(usersCollectionRef1);

        let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                  
                                   
        let filteredArray=usersTemp.filter(obj => obj.Email === localStorage.getItem('email'))

        return filteredArray
      }


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

        if(!localStorage.getItem('email'))
           {

            window.location.href="/oktologin"
            
        }

       
       

        isUserExist().then((data)=>{

         
          {
            
            getUserId()

            if(localStorage.getItem('coins') && localStorage.getItem('coins')<data[0].Coins)
              {
                
               
                console.log("prevCoins",prevCoins)
                console.log("coins",coins)
                
               
                setShowConfetti(true)
                setShowDiv(true)
                
                localStorage.setItem('coins',data[0].Coins)
               

              }
          
          }
        })
      },[])


    
  return (
    <div>
      <br></br>
           <ResponsiveAppBar homeButtonStyle="contained" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="outlined"/>
    

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
          <h1>{localStorage.getItem('coins')}</h1>
          <p>You just won {parseInt(localStorage.getItem('coins'))-parseInt(coins)} coins !</p>
          <br></br>
          <center>
          <button class="button-85" onClick={()=>{
            if(localStorage.getItem('coins') && localStorage.getItem('coins')>=1 )
            {
             setShowDiv(false)
             setShowConfetti(false)
             localStorage.setItem('count',1)
             notifyGift(parseInt(localStorage.getItem('coins'))-coins)
             setCoins(parseInt(localStorage.getItem('coins')))
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


     
     
<input style={{fontSize:'30px',background: "transparent", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", backdropFilter: "blur(0px)", WebkitBackdropFilter: "blur(0px)", borderTop: "none",borderLeft:'none',borderRight:'none',borderBottom:'0.2px solid white', width:'100%',color:'white',maxWidth:'12em'}} onChange={(e)=>{
  setCity(e.target.value)
}} placeholder="&nbsp; &nbsp;🔍 Search by location"></input>

<br></br>

<br></br> <br></br>
<div className="events">

{allEvents.length!=0 && city.length!=0 && allEvents.map((x)=>{
   const input=city.toLowerCase().replace(/[^\w\s]/g, '').trim();

   
   if (x.Address.toLowerCase().replace(/[^\w\s]/g, '').includes(input))
  return(

    <Card sx={{ maxWidth: 345,minWidth:300  }} style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' }} >
      <CardActionArea>
        <br></br>
        <img style={{width:'20em'}} src={x.Image} onClick={()=>{
          window.location.href=`/event/${x.id}`
        }}></img>
       
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
          {x.Name}
          </Typography>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
          <CalendarMonthIcon fontSize='small'/><l>{x.StartDateTime && formatDate(x.StartDateTime.substring(0,10))}</l>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
        <LocationPinIcon fontSize='small'/>
        <l>{x.Address && x.Address.slice(x.Address.lastIndexOf(",") + 1)}</l>
        </Typography>
        </Typography>

        

        {/* const countryName = 'united arab emirates'; // 🔥 Manually set this
    const code = getCode(countryName);
    const emoji = code ? getEmojiFlag(code) : '🏳️' */}
          <br></br>

          <Button variant="outlined" onClick={()=>{
            window.location.href=`/event/${x.id}`
          }}><LaunchIcon/>  </Button>

          <Button variant="outlined" onClick={()=>{
            window.location.href=`/event/${x.id}`
          }}><CommentIcon/>  </Button>

          <Button variant="outlined" onClick={()=>{
            navigator.clipboard.writeText(`https://v1-six-liart.vercel.app/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button>

          {localStorage.getItem('email') && x.Creator==localStorage.getItem('email') && 
          <Button variant="outlined" style={{color:'green'}} onClick={()=>{
            window.location.href=`/manageevent/${x.id}`
          }}><EditIcon/>  </Button>
          }
         
            
         
        
        </CardContent>
      </CardActionArea>
    </Card>
   
  )
})}

</div>
    

{trendingEvents.length==0 && buttonHight==2 && <h2 style={{color:'white'}}>Trending</h2>}
{trendingEvents.length!=0 && buttonHight==2 && <h2 style={{color:'white'}}>Trending</h2>}

<div className="events">

{trendingEvents.length!=0 && buttonHight==2 &&  trendingEvents.map((x)=>{
  return(

    <Card sx={{ maxWidth: 345,minWidth:300  }} style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' }} >
      <CardActionArea>
        <br></br>
        <img style={{width:'20em'}} src={x.Image} onClick={()=>{
          window.location.href=`/event/${x.id}`
        }}></img>
       
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
          {x.Name}
          </Typography>


          
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
          <CalendarMonthIcon fontSize='small'/><l>{x.StartDateTime && formatDate(x.StartDateTime.substring(0,10))}</l>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
        <LocationPinIcon fontSize='small'/>
        <l>{x.Address && x.Address.slice(x.Address.lastIndexOf(",") + 1)}</l>
        </Typography>
        </Typography>
        
          <br></br>
          <Button variant="outlined" onClick={()=>{
            window.location.href=`/event/${x.id}`
          }}><LaunchIcon/>  </Button>

          <Button variant="outlined" onClick={()=>{
            window.location.href=`/event/${x.id}`
          }}><CommentIcon/>  </Button>

          <Button variant="outlined" onClick={()=>{
            navigator.clipboard.writeText(`https://v1-six-liart.vercel.app/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button>

          {localStorage.getItem('email') && x.Creator==localStorage.getItem('email') && 
          <Button variant="outlined" style={{color:'green'}} onClick={()=>{
            window.location.href=`/manage/${x.id}`
          }}><EditIcon/>  </Button>
        }
        </CardContent>
      </CardActionArea>
    </Card>
   
  )
})}
</div>





{allEvents.length==0 && <h2 style={{color:'white'}}>All</h2>}
{allEvents.length!=0 && <h2 style={{color:'white'}}>All</h2>}

<div className="events">

{allEvents.length!=0 && allEvents.map((x)=>{
  return(

    <Card sx={{ maxWidth: 345,minWidth:300  }} style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
      <CardActionArea>
        <br></br>
        <img style={{width:'20em'}} src={x.Image} onClick={()=>{
          window.location.href=`/event/${x.id}`
        }}></img>
       
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
          {x.Name}
          </Typography>

          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
          <CalendarMonthIcon fontSize='small'/><l>{x.StartDateTime && formatDate(x.StartDateTime.substring(0,10))}</l>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
        <LocationPinIcon fontSize='small'/>
        <l>{x.Address && x.Address.slice(x.Address.lastIndexOf(",") + 1)}</l>
        </Typography>
        </Typography>

          <br></br>

          <Button variant="outlined" onClick={()=>{
            window.location.href=`/event/${x.id}`
          }}><LaunchIcon/>  </Button>

          <Button variant="outlined" onClick={()=>{
            window.location.href=`/event/${x.id}`
          }}><CommentIcon/>  </Button>

          <Button variant="outlined" onClick={()=>{
            navigator.clipboard.writeText(`https://v1-six-liart.vercel.app/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button>

          {localStorage.getItem('email') && x.Creator==localStorage.getItem('email') && 
          <Button variant="outlined" style={{color:'green'}} onClick={()=>{
            window.location.href=`/manage/${x.id}`
          }}><EditIcon/>  </Button>
        }
        
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

    <Card sx={{ maxWidth: 345,minWidth:300 }} style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
      <CardActionArea>
        <br></br>
        <img style={{width:'20em'}} src={x.Image} onClick={()=>{
          window.location.href=`/event/${x.id}`
        }}></img>
       
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
          {x.Name}
          </Typography>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
          <CalendarMonthIcon fontSize='small'/><l>{x.StartDateTime && formatDate(x.StartDateTime.substring(0,10))}</l>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
        <LocationPinIcon fontSize='small'/>
        <l>{x.Address && x.Address.slice(x.Address.lastIndexOf(",") + 1)}</l>
        </Typography>
        </Typography>

          <br></br>
          
          <Button variant="outlined" onClick={()=>{
            window.location.href=`/event/${x.id}`
          }}><LaunchIcon/>  </Button>

          <Button variant="outlined" onClick={()=>{
            window.location.href=`/event/${x.id}`
          }}><CommentIcon/>  </Button>

          <Button variant="outlined" onClick={()=>{
            navigator.clipboard.writeText(`https://v1-six-liart.vercel.app/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button>

          {localStorage.getItem('email') && x.Creator==localStorage.getItem('email') && 
          <Button variant="outlined" style={{color:'green'}} onClick={()=>{
            window.location.href=`/manage/${x.id}`
          }}><EditIcon/>  </Button>
        }
        
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
      
      <Card sx={{ maxWidth:345,minWidth:300  }} style={{marginTop:'10%', background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
      <CardActionArea>
        <br></br>
        <img style={{width:'20em'}} src={x.Image} onClick={()=>{
          window.location.href=`/event/${x.id}`
        }}></img>
       
        <CardContent>


          <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'center' }}>
          {x.Name}
          </Typography>

          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
          <CalendarMonthIcon fontSize='small'/><l>{x.StartDateTime && formatDate(x.StartDateTime.substring(0,10))}</l>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'center',display:'flex',alignItems:'center',justifyContent:'center',gap:'3px'}}>
        <LocationPinIcon fontSize='small'/>
        <l>{x.Address && x.Address.slice(x.Address.lastIndexOf(",") + 1)}</l>
        </Typography>
        </Typography>

        

          <br></br>
          {userApprovedArray.includes(x.id) ? <div>
          <div> <Button variant='outlined' color="success"
        onClick={()=>{

         window.location.href=`/qr/${x.id}`

        }}
        className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition"
      >
       Get Ticket
      </Button>
      
      <Button variant="outlined" onClick={()=>{
            navigator.clipboard.writeText(`http://localhost:3000/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button></div> }

            
            </div>:<div><Button variant="outlined">Approval Pending</Button><Button variant="outlined" onClick={()=>{
            navigator.clipboard.writeText(`http://localhost:3000/event/${x.id}`)
            notifyClipboard()
          }}><ShareIcon/>  </Button></div>}

            
            
        </CardContent>
      </CardActionArea>
    </Card>
     
    
      </div>
  )
})}
</div>
<br></br><br></br><br></br><br></br><br></br>

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
  <Fab color="primary" aria-label="add"  size="large" style={{bottom:'40%'}}>
    <AddIcon />
  </Fab>
</Box>
<Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>

      <div style={{position:'fixed',bottom:'0',width:'100%'}}>
     

      <div className="full-width-bar" style={{height:'3em',borderTop:'1px solid white'}} >
                
                  
           
                   <div style={{color:'white'}} >
           
                   
                   <Button variant="contained" style={{borderRadius:'0'}}><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><EventIcon fontSize='small'/> <l>Events</l></div></Button>
                   <Button><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><LocalMoviesIcon fontSize='small'/> <l>Movies</l></div></Button>
                   <Button><div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:'3px'}}><CelebrationIcon fontSize='small'/> <l>Concerts</l></div></Button>
                
           
           
                   </div>
                 
                    
                     </div>
      </div>

    </div>
  )
}

export default Home2


