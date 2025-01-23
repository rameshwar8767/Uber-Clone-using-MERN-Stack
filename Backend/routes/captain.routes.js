const express = require('express')
const router = express.Router();
const {body} = require('express-validator')
const captainController = require('../controllers/captain.controller.js')

router.post('/register',[
    body('fullname.firstname').notEmpty().withMessage('First name is required'),
    body('fullname.lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('vehicle.color').notEmpty().withMessage('Vehicle color is required'),
    body('vehicle.plate').notEmpty().withMessage('Vehicle plate is required'),
    body('vehicle.capacity').notEmpty().withMessage('Vehicle capacity is required'),
    body('vehicle.vehicleType').notEmpty().withMessage('Vehicle type is required'),
],captainController.registerCaptain)

module.exports = router;