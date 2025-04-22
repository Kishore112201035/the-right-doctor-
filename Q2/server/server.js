const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const personRoutes = require('./routes/person.routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb+srv://kishore:mongo%40123@cluster0.7ijgbbb.mongodb.net/";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/person', personRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Person Management API is running');
});

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });