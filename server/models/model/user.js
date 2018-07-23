const mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    userType: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        default: 'Customer'
    },
    password: {
        type: String,
        requuired: true,
        minlength: 10,
        trim: true
    },
    addedAt: {
        type: Date,
        default: new Date()
    }
});