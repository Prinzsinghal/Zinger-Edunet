// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected...'))
  .catch((err) => console.log(err));

// Register API
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.json({ message: 'User Registered..' });
    console.log('User Registration completed...');
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login API
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    res.json({ message: 'Login Successful', username: user.username });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// New API to fetch user data
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: user.username, email: user.email });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Connecting Server
app.listen(PORT, () => console.log('Server running on port 5000'));