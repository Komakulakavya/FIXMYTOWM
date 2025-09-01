import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = ({ onLogin }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
        credentials: 'include', // ADD THIS LINE
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ username: data.username, role: data.role }));
        onLogin(data.token, data.role);
        alert('Login successful!');

        switch (data.role) {
          case 'general_user':
            navigate('/dashboard/general');
            break;
          case 'authority':
            navigate('/dashboard/authority');
            break;
          case 'volunteer':
            navigate('/dashboard/volunteer');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('⚠️ Error connecting to server');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gray-100 px-4 py-10">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h2 style={{ color: '#124E66' }} className="text-3xl font-bold text-center mb-6">
            Login to CivicTrack
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button
              type="submit"
              style={{ backgroundColor: '#124E66' }}
              className="w-full hover:brightness-110 text-white py-3 rounded-lg font-medium transition"
            >
              Login
            </button>
          </form>
          {error && (
            <p className="mt-4 text-center text-sm text-red-600">{error}</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
