import React, { useState,useEffect } from 'react'
import { useOkto } from "okto-sdk-react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import ResponsiveAppBar from './ResponsiveAppBar'
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';



function Channel() {

    const usersCollectionRef1 = collection(db, "user");
    const usersCollectionRef = collection(db, "events");

    const [users,setUsers]=useState([])

    const [events,setEvents]=useState([])

    const [myProfile,setMyProfile]=useState({})

    const [isFollow,setIsFollow]=useState(false)
   
    const { userName } = useParams();


    const handleFollow = async () => {
        try {
            const currentUserName = localStorage.getItem('userName');
            const userDoc1 = doc(db, "user", users[0].id);
            const existingFollowers = users[0].Followers || [];
    
            // Avoid duplicate followers
            const updatedFollowers = existingFollowers.includes(currentUserName)
                ? existingFollowers
                : [...existingFollowers, currentUserName];
    
            await updateDoc(userDoc1, { Followers: updatedFollowers });
    
            // Fetch current user data
            const data = await getDocs(usersCollectionRef1);
            const usersTemp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            const filteredArray = usersTemp.filter(obj => obj.UserName === currentUserName);
    
            if (filteredArray.length === 0) {
                notifyCustom("User not found", "error");
                return;
            }
    
            const currentUser = filteredArray[0];
            const userDoc2 = doc(db, "user", currentUser.id);
    
            const existingFollowing = currentUser.Following || [];
    
            // Avoid duplicate following
            const updatedFollowing = existingFollowing.includes(userName)
                ? existingFollowing
                : [...existingFollowing, userName];
    
            await updateDoc(userDoc2, { Following: updatedFollowing });
    
            notifyCustom(`Followed ${userName}`, "success");
    
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error("Error in handleFollow:", error);
            notifyCustom("Something went wrong", "error");
        }
    };
    
    const handleUnFollow = async () => {
        try {
            const currentUserName = localStorage.getItem('userName');
            const userDoc1 = doc(db, "user", users[0].id);
    
            const updatedFollowers = (users[0].Followers || []).filter(
                item => item !== currentUserName
            );
    
            await updateDoc(userDoc1, { Followers: updatedFollowers });
    
            const data = await getDocs(usersCollectionRef1);
            const usersTemp = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            const filteredArray = usersTemp.filter(obj => obj.UserName === currentUserName);
    
            if (filteredArray.length === 0) {
                notifyCustom("User not found", "error");
                return;
            }
    
            const currentUser = filteredArray[0];
            const userDoc2 = doc(db, "user", currentUser.id);
    
            const updatedFollowing = (currentUser.Following || []).filter(
                item => item !== userName
            );
    
            await updateDoc(userDoc2, { Following: updatedFollowing });
    
            notifyCustom(`Unfollowed ${userName}`, "success");
    
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("Error in handleUnFollow:", error);
            notifyCustom("Something went wrong", "error");
        }
    };
    


    const getUsers=async()=>{



         let data = await getDocs(usersCollectionRef1);
                                           
          let usersTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))                
                                           
          let filteredArray=usersTemp.filter(obj => obj.UserName==userName)

          setUsers(filteredArray)

          if(filteredArray.length!=0)

            {
                data = await getDocs(usersCollectionRef);

                let eventsTemp=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))                
                                                
                let filteredArrayEvents=eventsTemp.filter(obj => filteredArray[0].EventsCreated.includes(obj.id))

                setEvents(filteredArrayEvents)

                if(filteredArray[0].Followers && filteredArray[0].Followers.length!=0 && filteredArray[0].Followers.includes(localStorage.getItem('userName')))
                {
                    setIsFollow(true)
                }


            }   

            


     }

    useEffect(()=>{

        if(!localStorage.getItem('email'))
        {
            notifyCustom("User not logged in","error")

            setTimeout(() => {
                window.location.href="/oktologin"
            }, 1500);
        }

        else if((!localStorage.getItem('userName') || !localStorage.getItem('profileImg')))
            {
                notifyCustom("Set up your profile to continue","error")
    
                setTimeout(() => {
                    window.location.href="/profilesettings"
                }, 1500);
            }

        getUsers()

       

    },[])

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
    <div>
        <br></br>
      <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" dashboardButtonStyle="outlined" />
      <hr></hr>
      <br></br><br></br><br></br>
      <br></br>  

<center>
    <div style={{display:'flex',flexDirection:'column',color:'white',alignItems:'center',width:'20em',gap:'10px'}}>

    <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'20px'}}>

        <img style={{height:'5em',width:'5em',borderRadius:'50%',objectFit:'cover'}} src={users.length!=0 && users[0].ProfileImage}></img>

        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'20px'}}>

        <l style={{color:'white'}}><b>{users.length!=0 && users[0].UserName}</b></l>

        <div style={{display:'flex',gap:'15px'}}>

            <div>
            
            <l><b>{users.length!=0 && users[0].EventsCreated.length}</b></l>
            <br></br>

            Events

            </div>

            <div>
            
            <l>{users.length!=0 && users[0].Followers!=null && users[0].Followers.length!=0 ? users[0].Followers.length:0}</l>
            <br></br>

            Followers

            </div>

            <div>
            
            <l><b>{users.length!=0 && users[0].Following!=null && users[0].Following.length!=0 ? users[0].Following.length:0}</b></l>
            <br></br>

            Following

            </div>




        <div>

           
        </div>

        </div>

        </div>




    </div>
    <div style={{width:'100%',textAlign:'left'}}>

<l> {users.length!=0 && users[0].Bio}</l>

</div>

<div style={{width:'100%',textAlign:'left',display:'flex',justifyContent:'space-between'}}>

<Button variant="contained" style={{width:'48%',height:'2em'}} onClick={()=>{

if(isFollow)
{
    handleUnFollow()
}

else
    {
        handleFollow()
    }


}}>{isFollow ? "Unfollow":"Follow"}</Button>  <Button variant="outlined" style={{width:'48%',height:'2em'}}onClick={()=>{

localStorage.setItem('getChat',JSON.stringify(users[0]))

                        window.location.href="/chat"


}}> Message</Button>

</div>




 

    </div>



    </center>

    <center>
        <br></br>

    <h3 style={{color:'white'}}>Created Events {events.length!=0 && `(${events.length})`}</h3>

<div style={{display:'flex',flexWrap:'wrap',justifyContent:'center'}}>

{

    events.length!=0 && events.map((x)=>{

        return(

            <div style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' ,display:'flex',flexDirection:'column'}} >


            <img src={x.Image} style={{width:'300px',height:'300px'}}></img>



           

            </div>
        
        )
    })


}

</div>



    </center>

 <ToastContainer style={{zIndex:'99999999999'}}/>
   
    </div>
  )
}

export default Channel
