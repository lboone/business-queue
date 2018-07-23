const mongoose = require('mongoose');

module.exports = mongoose.model('Business',{
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    addedAt: {
        type: Number,
        default: new Date()
    }
});
