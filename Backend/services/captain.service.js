const Captain = require('../models/captain.model.js');
const bcrypt = require('bcrypt');

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
    // Check if all required fields are provided
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

    // Check if the email or phoneNumber already exists
    const existingCaptain = await Captain.findOne({ 
        $or: [{ email }, { phoneNumber }] 
    });
    if (existingCaptain) {
        throw new Error("Captain with the given email or phone number already exists");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new captain
    const captain = await Captain.create({
        fullname: {
            firstname,
            lastname,
        },
        email,
        phoneNumber,
        password: hashedPassword,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType,
        },
    });

    return captain;
};
