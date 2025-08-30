import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GeneralDashboard from './pages/GeneralDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import ReportIssue from './pages/ReportIssue';
import MyIssues from './pages/MyIssues';

function AppWrapper() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (token, role) => {
    setToken(token);
    setRole(role);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    // 🔁 Redirect based on role
    if (role === 'general') navigate('/dashboard/general');
    else if (role === 'authority') navigate('/dashboard/authority');
    else if (role === 'volunteer') navigate('/dashboard/volunteer');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    if (savedToken) {
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

  return (
    <div className="App">
      {/* --- Your New Header --- */}
      <header style={{ padding: '20px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
        <h1>Fix My Town 🛠️</h1>
        <p>Your voice matters. Report issues and help improve our community.</p>
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

      {/* --- Professional Footer --- */}
      <footer style={{ padding: '10px', textAlign: 'center', marginTop: 'auto', backgroundColor: '#333', color: 'white' }}>
        <p>&copy; 2025 Fix My Town. All rights reserved.</p>
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
