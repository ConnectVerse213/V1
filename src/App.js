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
import Dashboard from './Components/Dashboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OktoProvider, BuildType } from 'okto-sdk-react';
import Testing from './Components/Testing'
import Testing2 from './Components/Testing2'
function App() {
  const OKTO_CLIENT_API_KEY = "f144c56d-f768-426c-b123-f7ee71f8cee8";
  return (
    <div className="App">
 

    <Router>
    <Routes>
    
      <Route path="/creator" element={ <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}><AdminCreate/></OktoProvider>} />
      <Route path="/event/:event_id" element={<OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}><EventPage /></OktoProvider>} />
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
    <Route path="/dashboard" element={
        
        <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
        <Dashboard/>
    </OktoProvider>} />
     
    <Route path="/map/:event_id" element={ <MapComponent/>} />
    <Route path="/qr/:event_id" element={   <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
       <QR/>
    </OktoProvider>} />
    <Route path="/testing" element={ <Testing/>} />
    <Route path="/testing2" element={ <Testing2/>} />
      
   
    </Routes>
  </Router>
    </div>
  );
}

export default App;

