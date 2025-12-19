<<<<<<< HEAD
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { 
  timestamps: true,
  collection: 'users'
});

=======
const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
}, { timestamps: true });


>>>>>>> edc444351689a023e24478713c5f645222377be1
module.exports = mongoose.model('User', userSchema);