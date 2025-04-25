import logo from './logo.svg';
import './App.css';
import AdminCreate from './Components/AdminCreate';
import EventPage from './Components/EventPage';
import EventManage from './Components/EventManage';
import EditEvent from './Components/EditEvent';
import EventManageB from './Components/EventManageB';
import ErrorPage from './Components/ErrorPage';
import OktoLogin from './Components/OktoLogin';
import Home from './Components/Home';
import Home2 from './Components/Home2';
import MapComponent from './Components/MapComponent';
import QR from './Components/QR';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OktoProvider, BuildType } from 'okto-sdk-react';
function App() {
  const OKTO_CLIENT_API_KEY = "f144c56d-f768-426c-b123-f7ee71f8cee8";
  return (
    <div className="App">
  

    <Router>
    <Routes>
    
      <Route path="/creator" element={ <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}><AdminCreate/></OktoProvider>} />
      <Route path="/event/:event_id" element={<EventPage />} />
      <Route path="/manage/" element={<EventManage />} />
      <Route path="/editevent/:event_id" element={<EditEvent />} />
      <Route path="/manageevent/:event_id" element={<EventManageB />} />
      <Route path="/error/:error_message" element={<ErrorPage />} />
      <Route path="/oktologin" element={ <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
         <OktoLogin/>
    </OktoProvider>} />
    <Route path="/Home" element={
        
        <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
         <Home />
    </OktoProvider>} />
    <Route path="/Home2" element={
        
        <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
         <Home2 />
    </OktoProvider>} />
     
    <Route path="/map/:event_id" element={ <MapComponent/>} />
    <Route path="/qr/:event_id" element={ <QR/>} />
      
      
   
    </Routes>
  </Router>
    </div>
  );
}

export default App;

