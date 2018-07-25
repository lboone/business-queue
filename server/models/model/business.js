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
                console.log('has user');
                user.businesses.push({id: business._id});
                user.save().then(() => {
                    console.log('saved');
                    next();
                },(e) => {
                    console.log(e);
                    next();
                })                
            } else {
                next();
            }
        },(e) => {
            console.log(e);
            next();
        });
    } else {
        console.log('owner length !== 0');
        next();
    }
});


module.exports = mongoose.model('Business',BusinessSchema);
