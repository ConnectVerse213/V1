import React,{useEffect, useState,useRef} from 'react'
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
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DownloadIcon from '@mui/icons-material/Download';
import backgroundImage from '../assets/images/coinBackground2.gif'
import ResponsiveAppBar from './ResponsiveAppBar';
import { useOkto } from "okto-sdk-react";
// import { signInWithGoogle } from "../firebase-config";
const usersCollectionRef1 = collection(db, "user");

const usersCollectionRef2 = collection(db, "ticket");

function QR() {

    const [randomNumber, setRandomNumber] = useState('');
    const [showQR, setShowQR] = useState(false);
    const qrRef = useRef();
    const { event_id } = useParams();
    const [isDownload,setIsDownload]=useState(false)
    const [users, setUsers] = useState([]);


     const getUsers = async () => {
            const data = await getDocs(usersCollectionRef1);
           
            let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        
            let filteredArray = usersTemp.filter(obj => 
              obj.Email === localStorage.getItem('email') && 
              obj.EventsApproved.includes(event_id)
            );
            
            return filteredArray
            // if(filteredArray.length==0)
            // {
            //   return false
            // }
            // else{
            //   return true
            // }


     }
  
    const generateNumber = async(download) => {

      if(randomNumber.length==0 )
      {
        const number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        setRandomNumber(number);
        localStorage.setItem(`${event_id}TicketId`,number)
        const result=await addDoc(usersCollectionRef2, {TicketId:number+localStorage.getItem('email'),EventId:event_id});
      
        console.log(result.id)
        console.log(number)

        if(download)
        {
          downloadQRCode()
        }

        return

       
      }
      if(download)
        {
          downloadQRCode()
        }
     
      
    };
  

    
    const downloadQRCode = () => {

      try{
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
      }
      catch(err){
        console.log(err)
      }
    };
  
    // 🧠 Update canvas class after render
    useEffect(() => {

     getUsers().then((data)=>{
        console.log(data.length)
        if(data.length==0)
        {
          window.location.href="/error/User Not Authorized"
        }
      })

      
      
 
      const canvas = qrRef.current?.querySelector('canvas');
      if (canvas) {
        canvas.style.transition = 'filter 0.5s ease';
        canvas.style.filter = showQR ? 'blur(0px)' : 'blur(8px)';
      
        if(randomNumber.length!=0 && isDownload)
        {
          downloadQRCode()
        }


      }
    }, [showQR,randomNumber]);

  

  

      


    

  
  return (
    <div  
    
    style={{ backgroundImage:`url(${backgroundImage})`,color:'black',height:'100%', backgroundSize: 'fit-content', 
    backgroundPosition: 'center center', 
    backgroundRepeat: 'no-repeat'}}
    
   
    >
    
     <ResponsiveAppBar style={{top:'0'}}/>
     <hr></hr>
     <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
    
      

            {!localStorage.getItem(`${event_id}TicketId`) &&   <div >

             
      
            <div
  ref={qrRef}
  style={{
    border: '2em solid white',
    display: 'inline-block',
    backgroundColor: 'white'
  }}
>
  <QRCodeCanvas
    value={randomNumber + localStorage.getItem('email')}
    size={200}
  />
</div>


      <br></br>  <br></br>  

      {!showQR && (
        <Button variant="outlined"
          onClick={() => {
            
            
            setShowQR(true)

            generateNumber(false)

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
         <VisibilityIcon/> &nbsp; Show 
        </Button>
      )}

    {showQR && (
        <Button

          variant="outlined"
          onClick={() => {
            
            
            setShowQR(false)

           

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
          <VisibilityOffIcon/> &nbsp; Hide 
        </Button>
      )}

  {!showQR && (
         <Button

         variant="outlined"
          onClick={() => {
            
            
           

            generateNumber(true)

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
        <DownloadIcon/> &nbsp; Download 
        </Button>
      )}

  {showQR && (
        <Button

        variant="outlined"
          onClick={() => {
            
            
           

          generateNumber(true)

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
           <DownloadIcon/> &nbsp; Download 
        </Button>
      )}
</div>}


{localStorage.getItem(`${event_id}TicketId`) &&   <div >
      
      <div ref={qrRef} style={{border: '2em solid white',
    display: 'inline-block',
    backgroundColor: 'white'}}>
        <QRCodeCanvas value={localStorage.getItem(`${event_id}TicketId`)+localStorage.getItem('email')} size={200}  
  quietZone={30}  />
      </div>


      <br></br>  <br></br>  

      {!showQR && (
       <Button

       variant="outlined"
          onClick={() => {
            
            
            setShowQR(true)

           

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
            <VisibilityIcon/>  &nbsp;  Show 
        </Button>
      )}

    {showQR && (
         <Button

         variant="outlined"
          onClick={() => {
            
            
            setShowQR(false)

           

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
          <VisibilityOffIcon/> &nbsp; Hide 
        </Button>
      )}

  
<Button

variant="outlined"
          onClick={() => {
            
            
           

            downloadQRCode()

          }
          }
          className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600 transition"
        >
          <DownloadIcon/> &nbsp; Download
        </Button>
  


 
</div>}
          




    </div>
  )
}

export default QR
