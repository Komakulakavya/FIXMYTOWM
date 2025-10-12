import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUserInfo(res.data);
    }).catch(err => {
      console.error('Failed to fetch user info', err);
    });
  }, []);

  if (!userInfo) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {userInfo.username}!</h2>
      {/* Show other info if you have */}
    </div>
  );
};

export default Dashboard;

