import React, { useEffect, useState } from "react";
import { collection, getDocs,updateDoc, doc, deleteDoc,addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../firebase-config.js";

import dayjs from "dayjs";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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

//   const sendMessage = async () => {
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
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto", color:'white' }}>
      <h2>Real-time Chat</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          height: "300px",
          overflowY: "auto",
          marginBottom: "1rem",
        }}
      >
        {messages && messages.length!=0 && messages.Chats.map((msg) => (
          <div key={msg.id} style={{ marginBottom: "0.5rem" }}>
            {msg.Message}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Enter message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
