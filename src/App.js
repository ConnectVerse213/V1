import logo from './logo.svg';
import './App.css';
import AdminCreate from './Components/AdminCreate';
import EventPage from './Components/EventPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
  

    <Router>
    <Routes>
    
      <Route path="/creator" element={<AdminCreate />} />
      <Route path="/event/:event_id" element={<EventPage />} />
     
      
   
    </Routes>
  </Router>
    </div>
  );
}

export default App;

