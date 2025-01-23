const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');
const Captain = require('../models/captain.model.js');
const BlacklistToken = require('../models/blacklistToken.model.js');

// Middleware for authenticating users
module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    // Check if token is blacklisted
    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized - Token is blacklisted' });
    }

    try {
        // Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - User not found' });
        }

        // Attach user to the request object
        req.user = user;
        return next();
    } catch (error) {
       
        return res.status(401).json({ message: 'Unauthorized - Token verification failed' });
    }
};

// Middleware for authenticating captains
module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // Check if token is blacklisted
    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: "Unauthorized - Token is blacklisted" });
    }

    try {
        // Decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        
        const captain = await Captain.findById(decoded._id);
        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized - Captain not found' });
        }

        // Attach captain to the request object
        req.captain = captain;
        return next();
    } catch (error) {
 
        return res.status(401).json({ message: "Unauthorized - Token verification failed" });
    }
};
