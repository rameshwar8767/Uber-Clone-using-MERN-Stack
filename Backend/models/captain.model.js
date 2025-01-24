const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: [3, 'firstname must be at least 3 characters'],
      },
      lastname: {
        type: String,
        minlength: [3, 'lastname must be at least 3 characters'],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [5, 'email must be at least 5 characters'],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Password is not returned in queries by default
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    vehicle: {
      color: {
        type: String,
        required: true,
        minlength: [3, 'color must be at least 3 characters'],
      },
      plate: {
        type: String,
        required: true,
        minlength: [3, 'plate must be at least 3 characters'],
      },
      capacity: {
        type: String,
        required: true,
        minlength: [1, 'capacity must be at least 1'],
      },
      vehicleType: {
        type: String,
        required: true,
        enum: ['car', 'auto'],
      },
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalTrips: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password before saving
captainSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);  // Hash the password
  }
  next();  // Continue with save
});

// Generate authentication token
captainSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

// Compare password with the hashed password
captainSchema.methods.comparePassword = async function (password) {
  try {
    if (!password || !this.password) {
      throw new Error('Password or hash is missing');
    }
    return await bcrypt.compare(password, this.password);  // Compare plain password with hashed password
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const Captain = mongoose.model('Captain', captainSchema);

module.exports = Captain;
