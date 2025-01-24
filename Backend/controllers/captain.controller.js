const Captain = require('../models/captain.model.js');
const jwt = require('jsonwebtoken');
const captainService = require('../services/captain.service.js');
const { validationResult } = require('express-validator');
const BlacklistToken = require('../models/blacklistToken.model.js');
const bcrypt = require('bcrypt')
// Create new captain account
// module.exports.registerCaptain = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const { fullname, email, phoneNumber, password, vehicle, licenseNumber } = req.body;
//         console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Debug log

//        // Validate required fields
//        if (!fullname || !fullname.firstname || !fullname.lastname) {
//         return res.status(400).json({ message: "Full name (firstname and lastname) is required" });
//     }
//     if (!vehicle || !vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType) {
//         return res.status(400).json({ message: "Vehicle details (color, plate, capacity, and type) are required" });
//     }
//     if (!email || !phoneNumber || !password || !licenseNumber) {
//         return res.status(400).json({ message: "Email, phone number, password, and license number are required" });
//     }

//     // Check if captain already exists
//     const existingCaptain = await Captain.findOne({
//         $or: [{ email }, { phoneNumber }, { licenseNumber }]
//     });
//     if (existingCaptain) {
//         return res.status(400).json({ message: 'Captain already exists' });
//     }


//         // Hash password
//         const hashedPassword = await Captain.hashPassword(password);

//         // Create new captain
//         const captain = await captainService.createCaptain({
//             firstname: fullname.firstname,
//             lastname: fullname.lastname,
//             email,
//             phoneNumber,
//             licenseNumber,
//             password: hashedPassword,
//             vehicle: {
//                 color: vehicle.color,
//                 plate: vehicle.plate,
//                 capacity: vehicle.capacity,
//                 vehicleType: vehicle.vehicleType,
//             },
//         });

//         // Generate token
//         const token = await captain.generateAuthToken();

//         res.status(201).json({
//             message: 'Captain registered successfully',
//             token,
//             captain: {
//                 id: captain._id,
//                 fullname: captain.fullname,
//                 email: captain.email,
//                 licenseNumber: captain.licenseNumber,
//                 phoneNumber: captain.phoneNumber,
//             },
//         });
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ message: error.message });
    
//     }
// };
module.exports.registerCaptain = async (req, res, next) => {
    try {
        // Validate request body using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Log the incoming request body for debugging
        console.log('Request Body:', JSON.stringify(req.body, null, 2));

        const { fullname, email, phoneNumber, password, vehicle, licenseNumber } = req.body;

        // Validate `fullname` and ensure it's an object with required fields
        if (!fullname || typeof fullname !== 'object' || !fullname.firstname || !fullname.lastname) {
            return res.status(400).json({ message: "Full name (firstname and lastname) is required" });
        }

        // Validate `vehicle` and ensure it's an object with required fields
        if (!vehicle || typeof vehicle !== 'object' || !vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType) {
            return res.status(400).json({ message: "Vehicle details (color, plate, capacity, and type) are required" });
        }

        // Validate other required fields
        if (!email || !phoneNumber || !password || !licenseNumber) {
            return res.status(400).json({ message: "Email, phone number, password, and license number are required" });
        }

        // Check if a captain with the same email, phone number, or license number already exists
        const existingCaptain = await Captain.findOne({
            $or: [{ email }, { phoneNumber }, { licenseNumber }]
        });
        if (existingCaptain) {
            return res.status(400).json({ message: 'Captain already exists' });
        }

        // Hash the password
        const hashedPassword = await Captain.hashPassword(password, 10);

        // Call the createCaptain service function
        const captain = await captainService.createCaptain({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname,
            },
            email,
            phoneNumber,
            licenseNumber,
            password: hashedPassword,
            vehicle: {
                color: vehicle.color,
                plate: vehicle.plate,
                capacity: vehicle.capacity,
                vehicleType: vehicle.vehicleType,
            },
        });

        // Generate authentication token (assumes `generateAuthToken` exists on the captain instance)
        const token = await captain.generateAuthToken();

        // Respond with success
        res.status(201).json({
            message: 'Captain registered successfully',
            token,
            captain: {
                id: captain._id,
                fullname: captain.fullname,
                email: captain.email,
                licenseNumber: captain.licenseNumber,
                phoneNumber: captain.phoneNumber,
            },
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: error.message });
    }
};




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
        console.log(captain);
        
        // Verify the password
        const isValid = await captain.comparePassword(password);
        console.log(isValid);
        
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