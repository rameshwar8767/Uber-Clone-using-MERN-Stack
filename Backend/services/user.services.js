const User = require('../models/user.model.js')

module.exports.createUser = async({
    firstname, lastname, email, password
})=>{
    if(!firstname || !password || !email || !phonenumber){
        throw new Error("all fields are required ");
    }
    
    const user = User.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        phonenumber,
        password
    })

    return user;
}