const User = require('../models/user.model.js');
const user = require('../models/user.model.js');
const userService = require('../services/user.services.js')
const {validationResult}= require('express-validator')
const authMidaleware = require('../middlewares/auth.middleware.js')
const BlacklistToken = require('../models/blacklistToken.model.js')


module.exports.registerUser = async(req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {fullname, lastname, email, password, phonenumber} = req.body
    console.log(req.body);
    

    const hashPassword = await User.hashPassword(password)
    const user = await userService.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password: hashPassword
    })
    const token = user.generateAuthToken()

    res.status(201).json({token, user})
}

module.exports.loginUser = async(req, res, next)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = await User.findOne({email}).select('+password');
        if(!user){
            res.status(401).json({message: "Invalid email or password"})
        }
        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            res.status(401).json({message: "Invalid email or password"})
        }

        const token = user.generateAuthToken()
        res.cookie('token', token);
        res.status(200).json({token, user})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
    
    
}

module.exports.getUserProfile= async (req, res, next)=>{
    res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
        await BlacklistToken.create({token});

        res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}



