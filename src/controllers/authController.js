 HEAD
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const mongoose = require('mongoose');

// Check if MongoDB is connected
const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};


const registerUser = async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body);
    
    if (!isDBConnected()) {
      console.log('❌ DB not connected');
      return res.status(503).json({ 
        message: 'Database not connected. Please check MongoDB connection.' 
      });
    }
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      console.log('⚠️  User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({ name, email, password: hashedPassword });
    console.log('✅ User created successfully:', user._id, user.email);
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('❌ Registration error:', error.message);
    res.status(500).json({ message: error.message });
  }
};


const authUser = async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    console.log('🔐 Password provided:', req.body.password ? 'Yes' : 'No');
    
    if (!isDBConnected()) {
      console.log('❌ DB not connected');
      return res.status(503).json({ 
        message: 'Database not connected. Please check MongoDB connection.' 
      });
    }
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const user = await User.findOne({ email });
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('👤 User details:', { id: user._id, name: user.name, email: user.email });
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log('🔑 Password match:', passwordMatch);
      
      if (passwordMatch) {
        console.log('✅ Login successful:', email);
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        console.log('❌ Password mismatch');
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      console.log('❌ User not found with email:', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: error.message });
  }
};



const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const mongoose = require('mongoose');

// Check if MongoDB is connected
const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};


const registerUser = async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ 
        message: 'Database not connected. Please check MongoDB connection.' 
      });
    }
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({ name, email, password: hashedPassword });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const authUser = async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ 
        message: 'Database not connected. Please check MongoDB connection.' 
      });
    }
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


>>>>>>> edc444351689a023e24478713c5f645222377be1
module.exports = { registerUser, authUser };