import React from 'react'
import ResponsiveAppBar from './ResponsiveAppBar'

function Chat() {
  return (
    <div>
        <br></br>
         <ResponsiveAppBar homeButtonStyle="outlined" earnButtonStyle="outlined" createButtonStyle="outlined" chatButtonStyle="contained" dashboardButtonStyle="outlined"/>
         <hr></hr>
      <h1 style={{color:'white'}}>Chats</h1>
    </div>
  )
}

export default Chat
