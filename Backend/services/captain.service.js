const Captain = require('../models/captain.model.js');
const bcrypt = require('bcrypt');

module.exports.createCaptain = async ({
    fullname,
    email,
    password,
    phoneNumber,
    licenseNumber,
    vehicle,
}) => {
    // Debug input to verify structure
    console.log("Input received:", { fullname, email, password, phoneNumber, licenseNumber, vehicle });

    // Validate `fullname` structure
    if (!fullname || typeof fullname !== 'object') {
        throw new Error("Full name object is required");
    }

    const { firstname, lastname } = fullname;

    // Validate fields
    if (!firstname || !lastname) {
        throw new Error("Full name (firstname and lastname) is required");
    }
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    if (!phoneNumber) throw new Error("Phone number is required");
    if (!licenseNumber) throw new Error("License number is required");

    // Validate `vehicle` structure
    if (!vehicle || typeof vehicle !== 'object') {
        throw new Error("Vehicle object is required");
    }

    const { color, plate, capacity, vehicleType } = vehicle;

    if (!color || !plate || !capacity || !vehicleType) {
        throw new Error("Vehicle details (color, plate, capacity, and vehicle type) are required");
    }

    // Check if captain already exists
    const existingCaptain = await Captain.findOne({
        $or: [{ email }, { phoneNumber }, { licenseNumber }]
    });
    if (existingCaptain) {
        throw new Error("Captain with the given email, phone number, or license number already exists");
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
        licenseNumber,
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
