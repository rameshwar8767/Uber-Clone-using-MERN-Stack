const Captain = require('../models/captain.model.js');
const jwt = require('jsonwebtoken');
const captainService = require('../services/captain.service.js');
const { validationResult } = require('express-validator');
const BlacklistToken = require('../models/blacklistToken.model.js');

// Create new captain account
module.exports.registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, phoneNumber, password, vehicle } = req.body;
        // Fixing `req.bo` typo to `req.body`
        console.log(req.body);

        // Check if captain already exists
        const existingCaptain = await Captain.findOne({
            $or: [{ email }, { phoneNumber }]
        });
        if (existingCaptain) {
            return res.status(400).json({ message: 'Captain already exists' });
        }

        // Hash password
        const hashedPassword = await Captain.hashPassword(password);

        // Create new captain
        const captain = await captainService.createCaptain({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            phoneNumber,
            password: hashedPassword,
            vehicle: {
                color: vehicle.color,
                plate: vehicle.plate,
                capacity: vehicle.capacity,
                vehicleType: vehicle.vehicleType,
            },
        });

        // Generate token
        const token = await captain.generateAuthToken();

        res.status(201).json({
            message: 'Captain registered successfully',
            token,
            captain: {
                id: captain._id,
                fullname: captain.fullname,
                email: captain.email,
                phoneNumber: captain.phoneNumber,
            },
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: error.message });
    }
};

// Login captain
module.exports.loginCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // Find captain and explicitly select the password field
        const captain = await Captain.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify the password
        const isValid = await captain.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = await captain.generateAuthToken();

        // Set token in cookies and send response
        res.cookie('token', token, { httpOnly: true });
        res.json({
            message: 'Login successful',
            token,
            captain: {
                id: captain._id,
                fullname: captain.fullname,
                email: captain.email,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get captain profile
module.exports.getCaptainProfile = async (req, res, next) => {
    try {
        res.status(200).json({ captain: req.captain });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: error.message });
    }
};

// Logout captain
module.exports.logoutCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        // Add token to blacklist
        await BlacklistToken.create({ token });
        
        // Clear the token cookie
        res.clearCookie('token');
        
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: error.message });
    }
};
