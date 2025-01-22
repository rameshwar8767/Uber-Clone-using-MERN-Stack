const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const captainSchema = new mongoose.Schema({
    fullname: {
        firstname:{
            type: String,
            required: true,
            minlength: [3, 'firstname must be at least 3 characters']
        },
        lastname:{
            type: String,
            minlength: [3, 'lastname must be at least 3 characters']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        toLowercase:true,
        trim:true,
        minlength: [5, 'email must be at least 5 characters']
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    soketId:{
        type: String,
    },
    // status:{
    //     type: String,
    //     enum: ['active',  'inactive'],
    //     default:"inactive"
    // },

    vehicle: {
        color:{
            type: String,
            required: true,
            minlength: [3, 'color must be at least 3 characters']
        },
        plate:{
            type: String,
            required: true,
            minlength: [3, 'plate must be at least 3 characters']
        },
        capacity:{
            type: String,
            required: true,
            minlength: [1,'capacity must be at least 1']
        },
        vehicleType:{
            type: String,
            required: true,
            enum: ['car', 'auto'],
        }
    },
    location: {
        lat:{
            type: Number,
        },
        lng:{
            type: Number
        }
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    totalTrips: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for geolocation queries
captainSchema.methods.generateAuthToken = async ()=>{
    try {
        const token = await jwt.sign(
            { _id: this._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        return token;
    } catch (error) {
        throw new Error('Token generation failed');
    }
}

captainSchema.methods.comparePassword = async(password)=>{
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
}
captainSchema.statics.hashPassword = async(password)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error('Password hashing failed');
    }
}

const Captain = mongoose.model('Captain', captainSchema);

module.exports = Captain;