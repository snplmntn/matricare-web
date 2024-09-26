const express = require('express');
const router = express.Router();
const User = require('../model/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup route
router.post('/signup', async (req, res) => {
    try {
      const { fullName, email, username, password, phoneNumber } = req.body;
  
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      user = new User({
        fullName,
        email,
        username,
        password,
        phoneNumber
      });
  
      user.password = await bcrypt.hash(password, 10);
    await user.save();
    console.log('User created:', user); // Log user creation
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  });

module.exports = router;
