const mongoose = require('mongoose');
const User = require('./user');
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
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    owners: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }],
    staff: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }],
    customers: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }],
    queues: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }]
});

BusinessSchema.pre('save',function(next){
    var business = this;
    if(business.owners.length === 0) {
        business.owners.push({id: business._creator});   
        User.findById(business._creator).then((user) => {
            if(user){
                user.businesses.push({id: business._id});
                user.save().then(() => {
                    next();
                },(e) => {
                    next();
                })                
            } else {
                next();
            }
        },(e) => {
            next();
        });
    } else {
        next();
    }
});

module.exports = mongoose.model('Business',BusinessSchema);
