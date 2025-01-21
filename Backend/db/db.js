const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

const connectDb = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to DB'); // Logging after successful connection
    } catch (error) {
        console.error("Error occurred while connecting to the database", error);
    }
};

module.exports = connectDb;
