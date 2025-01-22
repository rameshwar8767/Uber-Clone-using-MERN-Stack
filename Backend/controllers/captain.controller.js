const Captain = require('../models/captain.model');
const jwt = require('jsonwebtoken');
const captainService = require('../services/captain.service.js')
const {validationResult} = require('express-validator')
// Create new captain account
module.exports.registerCaptain = async (req, res, next) => {
    try {
        const { fullname, email, phoneNumber, password,  vehicle, vehicleType, color, plate } = req.body;

        // Check if captain already exists
        const existingCaptain = await Captain.findOne({ 
            $or: [{ email }, { phoneNumber }, { licenseNumber }] 
        });
        if (existingCaptain) {
            return res.status(400).json({ message: 'Captain already exists' });
        }

        // Hash password
        const hashedPassword = await Captain.hashPassword(password);

        // Create new captain
        const captain = new Captain({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            
            vehicle
        });

        await captain.save();
        const token = await captain.generateAuthToken();

        res.status(201).json({
            message: 'Captain registered successfully',
            token,
            captain: {
                id: captain._id,
                fullname: captain.fullname,
                email: captain.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login captain
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find captain
        const captain = await Captain.findOne({ email });
        if (!captain) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await captain.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = await captain.generateAuthToken();

        res.json({
            message: 'Login successful',
            token,
            captain: {
                id: captain._id,
                fullname: captain.fullname,
                email: captain.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update captain location
exports.updateLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;
        const captain = await Captain.findByIdAndUpdate(
            req.captain._id,
            { 
                location: { lat, lng },
                lastUpdated: Date.now()
            },
            { new: true }
        );

        res.json({ message: 'Location updated successfully', location: captain.location });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update captain availability
exports.updateAvailability = async (req, res) => {
    try {
        const { isAvailable } = req.body;
        const captain = await Captain.findByIdAndUpdate(
            req.captain._id,
            { isAvailable },
            { new: true }
        );

        res.json({ 
            message: 'Availability updated successfully', 
            isAvailable: captain.isAvailable 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get captain profile
exports.getProfile = async (req, res) => {
    try {
        const captain = await Captain.findById(req.captain._id).select('-password');
        res.json(captain);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update captain profile
exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password; // Prevent password update through this route

        const captain = await Captain.findByIdAndUpdate(
            req.captain._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ message: 'Profile updated successfully', captain });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update socket ID
exports.updateSocketId = async (req, res) => {
    try {
        const { socketId } = req.body;
        await Captain.findByIdAndUpdate(req.captain._id, { socketId });
        res.json({ message: 'Socket ID updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};