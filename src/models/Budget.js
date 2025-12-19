<<<<<<< HEAD
const mongoose = require('mongoose');


const budgetSchema = mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
name: { type: String, required: true },
amount: { type: Number, required: true },
category: { type: String, default: 'General' },
}, { timestamps: true });


=======
const mongoose = require('mongoose');


const budgetSchema = mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
amount: { type: Number, required: true },
}, { timestamps: true });


>>>>>>> edc444351689a023e24478713c5f645222377be1
module.exports = mongoose.model('Budget', budgetSchema);