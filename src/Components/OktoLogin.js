import React,{useState,useRef} from 'react'
import { useOkto } from "okto-sdk-react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';

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
      <h1>Okto Login</h1>
      <hr></hr>

      {!authToken ? (
  <div style={{}}>
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
  </div>
) : (
  <p>Authenticated</p>
)}
    </div>
  )
}

export default OktoLogin
