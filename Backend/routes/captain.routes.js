const express = require('express')
const router = express.Router();
const {body} = require('express-validator')
const captainController = require('../controllers/captain.controller.js')
const authMidaleware = require("../middlewares/auth.middleware.js")
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
    body('licenseNumber').notEmpty().withMessage('License number is required'),
],captainController.registerCaptain)


router.post('/login',[
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
],captainController.loginCaptain)

router.get('/profile',authMidaleware.authCaptain, captainController.getCaptainProfile);

router.get('/logout', authMidaleware.authCaptain, captainController.logoutCaptain)

module.exports = router;