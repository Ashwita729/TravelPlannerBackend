<<<<<<< HEAD
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

// Test route to create a trip without auth
app.post('/api/debug/create-trip', async (req, res) => {
  try {
    const Trip = require('./models/Trip');
    const User = require('./models/User');
    
    // Find the test user
    const user = await User.findOne({ email: 'hari@test.com' });
    if (!user) {
      return res.status(400).json({ error: 'Test user not found. Create user first.' });
    }
    
    const testTrip = await Trip.create({
      user: user._id,
      destination: 'Paris, France',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-07'),
      description: 'Test trip to Paris'
    });
    
    console.log('✅ Test trip created:', testTrip._id);
    res.json({ 
      message: 'Test trip created successfully',
      trip: testTrip
    });
  } catch (error) {
    console.error('❌ Test trip creation failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug route to create a budget without auth
app.post('/api/debug/create-budget', async (req, res) => {
  try {
    const Budget = require('./models/Budget');
    const User = require('./models/User');
    
    // Find any user for testing
    const user = await User.findOne();
    if (!user) {
      return res.status(400).json({ error: 'No users found. Create a user first.' });
    }
    
    const { name, amount, category, trip } = req.body;
    
    const budget = await Budget.create({
      user: user._id,
      trip: trip || null,
      name: name || 'Sample Expense',
      amount: amount || 1000,
      category: category || 'General'
    });
    
    console.log('✅ Debug budget created:', budget._id);
    res.status(201).json({ 
      message: 'Debug budget created successfully',
      budget: budget
    });
  } catch (error) {
    console.error('❌ Debug budget creation failed:', error);
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

// Simple trip route without auth for testing
app.post('/api/trips/simple', async (req, res) => {
  try {
    const Trip = require('./models/Trip');
    const User = require('./models/User');
    
    console.log('📝 Simple trip creation:', req.body);
    
    // Find any user for testing
    const user = await User.findOne();
    if (!user) {
      return res.status(400).json({ error: 'No users found. Create a user first.' });
    }
    
    const { destination, startDate, endDate, description } = req.body;
    
    const trip = await Trip.create({
      user: user._id,
      destination: destination || 'Test Destination',
      startDate: startDate || new Date(),
      endDate: endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      description: description || 'Test trip'
    });
    
    console.log('✅ Simple trip created:', trip._id);
    res.status(201).json({
      message: 'Trip saved successfully',
      trip: trip
    });
  } catch (error) {
    console.error('❌ Simple trip creation failed:', error);
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



=======
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
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
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

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



>>>>>>> edc444351689a023e24478713c5f645222377be1
