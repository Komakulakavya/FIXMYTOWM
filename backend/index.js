const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const issueRoutes = require('./routes/issues');
const authRoutes = require('./routes/auth'); // Import auth routes
// server.js or app.js
const userRoutes = require('./routes/users');

const volunteerRoutes = require('./routes/volunteers');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Mount routes
app.use('/api/issues', issueRoutes);
app.use('/api/auth', authRoutes);  // Add this line to use auth routes
app.use('/uploads', express.static('uploads'));
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/users', userRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.send('API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
