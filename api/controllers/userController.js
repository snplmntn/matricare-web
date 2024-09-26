const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    let { fullName, username, password, confirmPassword, email, phoneNumber, userType } = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
    }
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        user = new User({ fullName, username, password, email, phoneNumber, userType });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.json({ 
            userId: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            userType: user.userType
         });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { fullName, username, password, confirmPassword, email, phoneNumber, userType } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
    }

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        user.fullName = fullName;
        user.username = username;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.userType = userType;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ 
            userId: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            userType: user.userType
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};

exports.login = async (req, res) => {
    const { username, password, userType } = req.body;
    try {
        let user = await User.findOne({ username, userType });
        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, "secret", { expiresIn: 3600 }, async (err, token) => {
            if (err) throw err;
            res.json({ 
                userId: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                userType: user.userType,
                token
             });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send(`Server Error: ${err.message}`);
    }
};
