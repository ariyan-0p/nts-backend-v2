require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 

const app = express();

/**
 * 1. FIXED BODY LIMITS
 * Increased to 200mb to match Nginx and handle 160MB+ videos.
 */
app.use(express.json({ limit: '200mb' })); 
app.use(express.urlencoded({ limit: '200mb', extended: true })); 

// Middleware - Production CORS
app.use(cors({
  origin: ['https://ntswithankit.com', 'https://www.ntswithankit.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})); 

/**
 * 2. MEDIA SERVING
 * Directs /media requests to the professional storage folder.
 */
app.use('/media', express.static('/var/www/media'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Database'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.json({ message: 'NTS Backend Server is running!' });
});

// API Routes
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/testimonials', require('./routes/testimonials')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});