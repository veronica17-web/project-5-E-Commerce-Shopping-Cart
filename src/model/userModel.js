const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({ 
    fname:  { 
        type: String,
        require: true,
        trim: true,
    },
    lname:  { 
        type: String,
        require: true,
        trim: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    profileImage: { 
        type: String,
        require: true,
        trim: true,
    },
    phone: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    password: { 
        type: String,
        require: true,
        trim: true,
    },
    address : {
      shipping: {
        street: { 
            type: String,
            trim: true,
        },
        city: { 
            type: String,
            trim: true,
        },
        pincode: { 
            type: String,
            trim: true,
        }},
      billing: {
        street: { 
            type: String,
            trim: true,
        },
        city: { 
            type: String,
            trim: true,
        },
        pincode: { 
            type: String,
            trim: true,
        },
    }}},

{timeStamp:true});


module.exports = mongoose.model('User', userSchema)