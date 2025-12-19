const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB().then((connected) => {
  if (connected) {
    console.log('✅ Database ready for data storage');
  } else {
    console.log('⚠️  Server running without database - signup/login will not work');
  }
}).catch((error) => {
  console.error('❌ Database connection error:', error);
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://travel-planner-frontend-lake.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Travel Planner Backend API is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

// Test route to create a user
app.post('/api/debug/create-user', async (req, res) => {
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    
    // Create Hari user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const testUser = await User.create({
      name: 'Hari',
      email: 'hari@test.com',
      password: hashedPassword
    });
    
    console.log('✅ Hari user created:', testUser._id);
    res.json({ 
      message: 'Hari user created successfully', 
      credentials: { email: 'hari@test.com', password: 'password123' },
      user: { id: testUser._id, name: testUser.name, email: testUser.email }
    });
  } catch (error) {
    console.error('❌ Test user creation failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug route to view MongoDB data
app.get('/api/debug/data', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const User = require('./models/User');
    const Trip = require('./models/Trip');
    
    console.log('🔍 Checking database connection...');
    console.log('DB State:', mongoose.connection.readyState);
    console.log('DB Name:', mongoose.connection.name);
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const data = {};
    
    // Get all users and trips
    const users = await User.find({});
    const trips = await Trip.find({}).populate('user', 'name email');
    console.log('👥 Users found:', users.length);
    console.log('✈️ Trips found:', trips.length);
    
    for (const collection of collections) {
      const collectionData = await db.collection(collection.name).find({}).toArray();
      data[collection.name] = collectionData;
      console.log(`📊 ${collection.name}: ${collectionData.length} documents`);
    }
    
    res.json({ 
      dbState: mongoose.connection.readyState,
      dbName: mongoose.connection.name,
      collections: collections.map(c => c.name), 
      userCount: users.length,
      tripCount: trips.length,
      data 
    });
  } catch (error) {
    console.error('❌ Debug route error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));