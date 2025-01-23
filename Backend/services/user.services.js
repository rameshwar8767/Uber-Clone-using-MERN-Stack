const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');

module.exports.createUser = async ({
    firstname, lastname, email, password, phoneNumber
}) => {
    // Check if all required fields are provided
    if (!firstname || !password || !email || !phoneNumber) {
        throw new Error("All fields are required");
    }

    // Check if the user already exists with the same email or phoneNumber
    const existingUser = await User.findOne({
        $or: [{ email }, { phoneNumber }]
    });
    if (existingUser) {
        throw new Error("User already exists with the given email or phone number");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        phoneNumber,
        password: hashedPassword
    });

    return user;
};
