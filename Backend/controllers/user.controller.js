const User = require('../models/user.model.js');
const user = require('../models/user.model.js');
const userService = require('../services/user.services.js')
const {validationResult}= require('express-validator')
module.exports.registerUser = async(req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {fullname, lastname, email, password} = req.body
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

        res.status(200).json({token, user})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
   
    
}



