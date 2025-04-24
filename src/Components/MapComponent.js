import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useParams } from 'react-router-dom';

const QrScanner = () => {
  const webcamRef = useRef(null);
  const [qrCode, setQrCode] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const usersCollectionRef = collection(db, "events");
  const usersCollectionRef1 = collection(db, "user");
  const usersCollectionRef2 = collection(db, "ticket");

   const { event_id } = useParams();

  

  useEffect(()=>{

    getEvents()
  },[])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isReady) {
        scanQRCode();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady]);

  const handleLoadedMetadata = () => {
    setIsReady(true);
  };


    const getEvents = async () => {
          const data = await getDocs(usersCollectionRef);
         
          let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
         
          let filteredArray=eventsTemp.filter(obj => obj.Creator === localStorage.getItem('email') && obj.id===event_id)
          
          if(filteredArray.length==0)
          {
            window.location.href = '/error/User Not Authorized';
          }
         
         
        
        };
  const scanQRCode = () => {
    const video = webcamRef.current?.video;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

      const updateUser = async (obj,EventId) => {
    
              
                        const userDoc = doc(db, "user", obj.id);
                        const newFields = { Email: obj.Email, Coins:obj.Coins+1000, EventsCreated:obj.EventsCreated,EventsRegistered:obj.EventsRegistered, EventsApproved:obj.EventsApproved,EventsAttended:[...obj.EventsAttended,EventId]};
                        await updateDoc(userDoc, newFields);
                        window.location.reload();
                      };
    
  const getTickets = async (code) => {
        let data = await getDocs(usersCollectionRef2);
       
        let ticketTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
       
        let filteredArray=ticketTemp.filter(obj => obj.TicketId === code)
        let EventId=filteredArray[0].EventId
        if(filteredArray.length!=0)
        {
          alert('Welcome User!')

          

          data = await getDocs(usersCollectionRef1);
       
          let userTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
       
          filteredArray=userTemp.filter(obj => obj.Email === code.slice(10))
          console.log(code.slice(11))
          if(filteredArray.length!=0)
          {
            updateUser(filteredArray[0],EventId)
          }
        }
        else
          {
            alert('User Not Authorized')
          }
         
       
      
      };
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code && code.data !== qrCode) {
      setQrCode(code.data);
      getTickets(code.data)
    }
  };

  return (
    <div>
      <h2>Scan Your Ticket Here</h2>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
        onLoadedMetadata={handleLoadedMetadata}
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "10px"
        }}
      />
      <div style={{ marginTop: "20px" }}>
        <strong>Scanned QR Code</strong>
        {/* <p>{qrCode || "Waiting for scan..."}</p> */}
      </div>
    </div>
  );
};

export default QrScanner;
