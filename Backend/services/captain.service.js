const Captain = require('../models/captain.model.js');

module.exports.createCaptain = async ({
    firstname,
    lastname,
    email,
    password,
    phoneNumber,
    color,
    plate,
    capacity,
    vehicleType,
}) => {
    if (
        !firstname || 
        !lastname || 
        !email || 
        !password || 
        !phoneNumber || 
        !color || 
        !plate || 
        !capacity || 
        !vehicleType
    ) {
        throw new Error("All fields are required");
    }

    const captain = await Captain.create({
        fullname: {
            firstname,
            lastname,
        },
        email,
        phoneNumber,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType,
        },
    });

    return captain;
};
