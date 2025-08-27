import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Demo from './components/Demo';
import RegisterComponent from './components/Register';
import LoginComponent from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/login" element={<LoginComponent />} />

      </Routes>
    </Router>
  );
}

export default App;
