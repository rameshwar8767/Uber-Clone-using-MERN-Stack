const express = require('express')
const router = express.Router();
const {body} = require('express-validator')
const userController = require("../controllers/user.controller.js")
router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min: 3}).withMessage('First name must be at least 3 characters'),
    body('password').isLength({min: 6}).withMessage('password must be at least 6 characters')
], userController.registerUser)

/**
 * @route POST /api/users/login
 * @description Authenticate user & get token
 * @body {string} email - User's email
 * @body {string} password - User's password
 * @returns {object} { token, user }
 * @throws {400} - If email or password is missing/invalid
 * @throws {401} - If credentials are incorrect
 * @throws {500} - If server error occurs
 */
router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min: 6}).withMessage('password must be at least 6 characters')
], userController.loginUser)

module.exports= router;