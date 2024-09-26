const express = require('express');
const router = express.Router();
const { register, updateUser, login } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.put('/:userId', updateUser);

module.exports = router;
