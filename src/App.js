import logo from './logo.svg';
import './App.css';
import AdminCreate from './Components/AdminCreate';
import EventPage from './Components/EventPage';
import EventManage from './Components/EventManage';
import EditEvent from './Components/EditEvent';
import EventManageB from './Components/EventManageB';
import ErrorPage from './Components/ErrorPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
  

    <Router>
    <Routes>
    
      <Route path="/creator" element={<AdminCreate />} />
      <Route path="/event/:event_id" element={<EventPage />} />
      <Route path="/manage/" element={<EventManage />} />
      <Route path="/editevent/:event_id" element={<EditEvent />} />
      <Route path="/manageevent/:event_id" element={<EventManageB />} />
      <Route path="/error/:error_message" element={<ErrorPage />} />
     
     
      
   
    </Routes>
  </Router>
    </div>
  );
}

export default App;

