const mongoose = require('mongoose');

var BusinessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    addedAt: {
        type: Number,
        default: new Date()
    },
    owners: [{
        id: {
            type: String,
            required: true
        }
    }],
    staff: [{
        id: {
            type: String,
            required: true
        }
    }],
    customers: [{
        id: {
            type: String,
            required: true
        }
    }],
    queues: [{
        id: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Business',BusinessSchema);
