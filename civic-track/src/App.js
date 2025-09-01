import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GeneralDashboard from './pages/GeneralDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import ReportIssue from './pages/ReportIssue';
import MyIssues from './pages/MyIssues';
import './App.css';

// Add axios configuration at the top
import axios from 'axios';
axios.defaults.withCredentials = true; // For CORS with credentials
axios.defaults.baseURL = 'http://localhost:5000'; // Add base URL

function AppWrapper() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (token, role) => {
    setToken(token);
    setRole(role);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    if (role === 'general_user') navigate('/dashboard/general');
    else if (role === 'authority') navigate('/dashboard/authority');
    else if (role === 'volunteer') navigate('/dashboard/volunteer');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    if (savedToken) {
      setToken(savedToken);
      setRole(savedRole);
      
      // Set axios default header with token
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-container">
          <div className="logo">
            <h1>🏗️ CivicTrack</h1>
          </div>
          
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
            <Link to="/report">Report Issue</Link>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
          </nav>

          <div className="auth-buttons">
            <Link to="/register" className="register-btn">Register</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/dashboard/general" element={<GeneralDashboard />} />
          <Route path="/dashboard/authority" element={<AuthorityDashboard />} />
          <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
          <Route path="/my-issues" element={<MyIssues />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 CivicTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;