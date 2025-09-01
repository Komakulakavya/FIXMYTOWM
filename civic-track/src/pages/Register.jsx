import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'general_user',
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateEmail(formData.email)) {
      setMessage('❌ Please enter a valid email address.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setMessage('❌ Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // ADD THIS LINE
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Registration successful! Please login.');
      } else {
        if (data.message?.toLowerCase().includes('exists')) {
          setMessage('❗ Username or email already exists. Please choose another.');
        } else {
          setMessage(data.message || '❌ Registration failed.');
        }
      }
    } catch (error) {
      setMessage('⚠️ Error connecting to server.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gray-100 px-4 py-10">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h2 style={{ color: '#124E66' }} className="text-3xl font-bold text-center mb-6">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
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

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general_user">General User</option>
              <option value="authority">Authority</option>
              <option value="volunteer">Volunteer</option>
            </select>
            <button
              style={{ backgroundColor: '#124E66' }}
              type="submit"
              className="w-full hover:brightness-110 text-white py-3 rounded-lg font-medium transition"
            >
              Register
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
