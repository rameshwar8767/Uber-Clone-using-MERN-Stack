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



