 HEAD
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async (req, res, next) => {
  let token;
  
  console.log('🔒 Auth check - Headers:', req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('🎫 Token extracted:', token ? 'Yes' : 'No');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🔓 Token decoded:', decoded.id);
      
      req.user = await User.findById(decoded.id).select('-password');
      console.log('👤 User found:', req.user ? req.user.email : 'No');
      
      if (!req.user) {
        console.log('❌ User not found in database');
        return res.status(401).json({ message: 'User not found' });
      }
      
      console.log('✅ Auth successful for:', req.user.email);
      next();
    } catch (error) {
      console.error('❌ Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('❌ No authorization header or invalid format');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};



const jwt = require('jsonwebtoken');
const User = require('../models/User');


const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};


>>>>>>> edc444351689a023e24478713c5f645222377be1
module.exports = { protect };