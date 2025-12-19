const Trip = require('../models/Trip');

const createTrip = async (req, res) => {
  try {
    console.log('✈️ Creating trip, user:', req.user ? req.user._id : 'No user');
    console.log('✈️ Trip data:', req.body);
    
    // If no user from auth, find any user for testing
    let userId = req.user ? req.user._id : null;
    if (!userId) {
      const User = require('../models/User');
      const testUser = await User.findOne();
      if (!testUser) {
        return res.status(400).json({ message: 'No users found' });
      }
      userId = testUser._id;
      console.log('ℹ️ Using test user:', testUser.email);
    }
    
    const { destination, startDate, endDate, description } = req.body;
    const trip = await Trip.create({ 
      user: userId, 
      destination, 
      startDate, 
      endDate, 
      description 
    });
    
    console.log('✅ Trip created successfully:', trip._id);
    res.status(201).json(trip);
  } catch (error) {
    console.error('❌ Trip creation failed:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getTrips = async (req, res) => {
  try {
    let userId = req.user ? req.user._id : null;
    if (!userId) {
      const User = require('../models/User');
      const testUser = await User.findOne();
      if (!testUser) {
        return res.json([]);
      }
      userId = testUser._id;
    }
    
    const trips = await Trip.find({ user: userId });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    Object.assign(trip, req.body);
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Trip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trip removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createTrip, getTrips, updateTrip, deleteTrip };