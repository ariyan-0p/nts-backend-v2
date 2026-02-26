require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 

// Initialize Express App
const app = express();

/**
 * 1. INCREASED BODY LIMITS
 * Default is 1MB. We must match your Nginx 'client_max_body_size 100M' 
 * so large video files aren't rejected here.
 */
app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true })); 

// Middleware - Updated CORS for Production Security
app.use(cors({
  origin: ['https://ntswithankit.com', 'https://www.ntswithankit.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})); 

/**
 * 2. STATIC FOLDER CONFIGURATION
 * This makes the 'uploads' folder public. 
 * Ensure the path aligns with your Nginx 'alias /var/www/nts-backend/uploads/;' config.
 */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Database'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Basic Route to check if server is alive
app.get('/', (req, res) => {
  res.json({ message: 'NTS Backend Server is running!' });
});

// API Routes
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/testimonials', require('./routes/testimonials')); 

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});