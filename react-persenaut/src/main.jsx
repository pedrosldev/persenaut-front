import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Landing from './components/Landing';
// import './assets/css/styles.css'; // Tu CSS original

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <Landing/>
  </StrictMode>,
)
