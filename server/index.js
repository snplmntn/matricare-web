const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// Database Connection
mongoose.connect('mongodb://localhost:27017/matricare', {
    useNewUrlParser: true,   // Ensures compatibility with modern MongoDB connection string
    useUnifiedTopology: true // Provides improved server discovery and monitoring
})
.then(() => console.log('Database is Connected'))
.catch((err) => console.log('Database connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', require('./routes/authRoutes'));

// Server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
