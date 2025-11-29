import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Pages/Landing';
import Demo from './components/Pages/Demo';
import RegisterComponent from './components/Auth/Register';
import LoginComponent from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
