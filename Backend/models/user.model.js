const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength: [3, 'First name must be at least 3 characters'],
      },
      lastname: {
        type: String,
        minlength: [3, 'Last name must be at least 3 characters'],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Corrected typo 'toLowercase' to 'lowercase'
      trim: true,
      minlength: [5, 'Email must be at least 5 characters'],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Ensures password is not returned in queries by default
    },
    socketId: {
      type: String,
    },
  },
  { timestamps: true }
);

// Generate JWT Auth Token
userSchema.methods.generateAuthToken = function () {
  // Use a function expression instead of arrow function to bind `this`
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
};

// Compare Passwords
userSchema.methods.comparePassword = async function (password) {
  if (!password || !this.password) {
    throw new Error('Password or hash is missing');
  }
  return await bcrypt.compare(password, this.password);
};

// Hash Password
userSchema.statics.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Pre-save Hook to Hash Password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Create User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
