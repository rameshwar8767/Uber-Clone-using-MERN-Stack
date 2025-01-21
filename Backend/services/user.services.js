const User = require('../models/user.model.js')

module.exports.createUser = async({
    firstname, lastname, email, password
})=>{
    if(!firstname || !password || !email ){
        throw new Error("all fields are required ");
    }
    // const exitedUser = User.findById(_id);

    // if(!existedUser){
    //     throw new Error("user already exists ", error);
    // }
    const user = User.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password
    })

    return user;
}