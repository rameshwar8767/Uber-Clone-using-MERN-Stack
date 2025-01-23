const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters']
        },
        lastname:{
            type:String,
            minlength: [3, 'Last name must be at least 3 characters']
        },
        

    },
    email:{
        type: String,
        required:true,
        unique:true,
        toLowercase:true,
        trim:true,
        minlength: [5, 'email must be at least 5 characters']
    },
    phonenumber: {
        type: Number,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required:true,
        minlength: [6, 'password must be at least 5 characters'],
        select: false
    },
    socketId: {
        type: String,
    }
},{timestamps:true})

userSchema.methods.generateAuthToken = ()=>{
    const token = jwt.sign({ _id : this._id}, process.env.JWT_SECRET, { expiresIn: '24h' })
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    if (!password || !this.password) {
      throw new Error("Password or hash is missing");
    }
    return await bcrypt.compare(password, this.password);
  };

userSchema.statics.hashPassword = async(password)=>{
    return await bcrypt.hash(password, 10)
}

const User = mongoose.model('User', userSchema)
module.exports = User;
