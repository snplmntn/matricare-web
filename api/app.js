const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/matricare', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
}).catch(err => {
    console.log(err);
});

// Routes
const userRoutes = require('./routes/user');
const appointmentRoutes = require('./routes/appointment');

app.use('/api/user', userRoutes);
app.use('/api/appointment', appointmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
