const Captain = require('../models/captain.model.js')

module.exports.createCaptain = async({
    firstname, lastname, email, password,phonenumber,color,plate,capacity,vehicleType
})=>{
    if(!firstname || !password || !email || !phonenumber || !color || !plate || !capacity || !vehicleType){
        throw new Error("all fields are required ");
    }
    
    const captain = Captain.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        phonenumber,
        password
    })

    return captain;
}