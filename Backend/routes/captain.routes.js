const express = require('express')
const router = express.Router();
const {body} = require('express-validator')
const captainController = require('../controllers/captain.controller.js')

router.post('/register',[
        body('fullname.firstname').trim().isLength({ min: 3 }).withMessage('First name must be at least 3 characters'),
        body('fullname.lastname').trim().isLength({ min: 3 }).withMessage('Last name must be at least 3 characters'),
        body('email').trim().isEmail().normalizeEmail().withMessage('Please enter a valid email'),
        body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
        body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('vehicle.color').trim().isLength({ min: 3 }).withMessage('Vehicle color must be at least 3 characters'),
        body('vehicle.plate').trim().isLength({ min: 3 }).withMessage('Vehicle plate must be at least 3 characters'),
        body('vehicle.capacity').trim().isLength({ min: 1 }).withMessage('Vehicle capacity is required'),
        body('vehicle.vehicleType').trim().isIn(['car', 'auto']).withMessage('Vehicle type must be car or auto')
    ],captainController.registerCaptain)

module.exports = router;