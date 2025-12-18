const Trip = require('../models/Trip');

const createTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate, description } = req.body;
    const trip = await Trip.create({ 
      user: req.user._id, 
      destination, 
      startDate, 
      endDate, 
      description 
    });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id });
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