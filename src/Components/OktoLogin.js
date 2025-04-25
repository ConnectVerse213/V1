import React,{useState,useRef} from 'react'
import { useOkto } from "okto-sdk-react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';
import logo from '../assets/images/logo.png'

import './OktoLogin.css'

function OktoLogin() {


    const { createWallet, getUserDetails, getPortfolio } = useOkto();
    const { authenticate } = useOkto();
    const [authToken, setAuthToken] = useState(null);
    const navigate=useNavigate()

    const buttonBRef = useRef(null);

    const handleButtonClickA = () => {
      // Programmatically click Button B
      if (buttonBRef.current) {
        buttonBRef.current.click();
      }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        const idToken = credentialResponse.credential;
       
         authenticate(idToken, (authResponse, error) => {
             if (authResponse) {
              
              console.log(authResponse)
               setAuthToken(authResponse.auth_token);
               console.log("Authenticated successfully, auth token:", authResponse.auth_token);
               navigate('/home')
             
              
             } else if (error) {
                   console.error("Authentication error:", error);
               }
           });
        };
  return (
    <div>

<div className="full-width-bar" >
  <div class="logo" >  <img src={logo} style={{width:'3em'}} alt="Logo" /> &nbsp; ConnectVerse</div>
    
      <div className="text"> <Button variant="outlined" onClick={()=>{
        window.location.reload()
      }}>Sign In</Button></div>
    </div>
      <h1>Okto Login</h1>
   

      {!authToken ? (
          
        <center>

<Card sx={{ maxWidth: 345 }} style={{marginTop:'10%', background: 'rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', backdropFilter: 'blur(17.5px)', WebkitBackdropFilter: 'blur(17.5px)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.18)' }}>
      <CardActionArea>
        <br></br>
        <PersonAddIcon fontSize='large' style={{color:'white'}}/>
       
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ color: 'white', textAlign: 'left' }}>
            Welcome to ConnectVerse
          </Typography>
          <Typography gutterBottom sx={{  fontSize: 14 }} style={{color:'white', textAlign: 'left'}}>
         Please Sign In below to continue.
        </Typography>

          <br></br>
          <GoogleLogin 
      onSuccess={handleGoogleLogin}
      onError={(error) => console.error("Login Failed", error)}
      render={(renderProps) => (
        <button ref={buttonBRef}
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4285F4", // Button color
            color: "#fff", // Text color
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      )}
    />
        
        </CardContent>
      </CardActionArea>
    </Card>
       



  


  </center>
) : (
  <p>Authenticated</p>
)}
    </div>
  )
}

export default OktoLogin
