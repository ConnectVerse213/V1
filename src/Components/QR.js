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
// import { signInWithGoogle } from "../firebase-config";
const usersCollectionRef = collection(db, "user");
const usersCollectionRef2 = collection(db, "ticket");

function QR() {

    const [randomNumber, setRandomNumber] = useState('');
    const [showQR, setShowQR] = useState(false);
    const qrRef = useRef();
    const { event_id } = useParams();
  
    const generateNumber = async() => {
      const number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setRandomNumber(number);
      const result=await addDoc(usersCollectionRef2, {TicketId:number+localStorage.getItem('email'),EventId:event_id});
    
      console.log(result.id)
    
     

      setShowQR(false);
    };
  

    
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

  

      


    

  
  return (
    <div>
     
    <div style={{border:'2px solid black'}}>
      

 
      
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
      
               
                  <button
                    onClick={downloadQRCode}
                    className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                  >
                    Download QR Code
                  </button>
               
             
             <button
        onClick={()=>{

          generateNumber()

        }}
        className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 transition"
      >
       Get Ticket
      </button>

            
           
      </div>




    </div>
  )
}

export default QR
