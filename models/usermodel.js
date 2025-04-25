const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        
    },
    otpExpiry: {
        type: Date,
       
    },
    isVerified: {
        type: Boolean,
        
    },  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
// This is a placeholder for the user model. You can add fields to the user schema as needed.