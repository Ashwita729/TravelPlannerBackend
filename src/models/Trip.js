<<<<<<< HEAD
const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
}, { 
  timestamps: true,
  collection: 'trips'
});

=======
const mongoose = require('mongoose');


const tripSchema = mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
destination: { type: String, required: true },
startDate: { type: Date, required: true },
endDate: { type: Date, required: true },
description: { type: String },
}, { timestamps: true });


>>>>>>> edc444351689a023e24478713c5f645222377be1
module.exports = mongoose.model('Trip', tripSchema);