const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Patient = require('./models/Patient'); // Patient Model Import

const app = express();
const PORT = process.env.PORT || 5000;

// ******************************************************************************
// ** MongoDB Atlas Connection String - Yahan apni link daalein **
// ******************************************************************************
const DB_URL = 'mongodb+srv://YOUR_ATLAS_USERNAME:YOUR_ATLAS_PASSWORD@cluster0.abcde.mongodb.net/PatientDB?retryWrites=true&w=majority';

// === MIDDLEWARE ===
app.use(express.json()); 

// *Frontend Files Serve Karna*
// Yeh client/ folder ke files ko serve karega
app.use(express.static(path.join(__dirname, '..', 'client'))); 

// === DATABASE CONNECTION ===
mongoose.connect(DB_URL)
    .then(() => console.log('✅ MongoDB Atlas se jud chuke hain!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// === API ROUTES ===

// 1. Naya Patient Record Add Karein (POST /api/patients)
app.post('/api/patients', async (req, res) => {
    try {
        const { name, email, contactNumber, appointments } = req.body;
        if (!name || !email) { return res.status(400).json({ message: 'Naam aur Email lazmi hai.' }); }
        
        const newPatient = new Patient({ name, email, contactNumber, appointments: appointments || [] });
        const savedPatient = await newPatient.save();
        
        res.status(201).json(savedPatient); 
    } catch (error) {
        res.status(500).json({ message: 'Patient record add nahi ho saka.', error: error.message });
    }
});

// 2. Saare Patient Records Nikaalein (GET /api/patients)
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find({}); 
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Records nikalne mein kharabi.' });
    }
});

// 3. Catch-all Route (Frontend files serve karne ke liye)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});


// === Server Ko Start Karein ===
app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});