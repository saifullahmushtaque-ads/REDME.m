const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactNumber: { type: String },
    email: { type: String, required: true, unique: true },
    appointments: [{
        date: { type: Date, required: true },
        reason: { type: String },
        reminded: { type: Boolean, default: false }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', PatientSchema);