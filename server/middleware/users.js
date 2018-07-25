var {User} = require('./../models');

var isOwner = (req, res, next) => {
    if(req.user){
        if(req.user.userType == 'Owner'){
            next();
        } else {
            res.status(401).send({'Error':'You must be an owner to perform that action.'});
        }
    } else {
        res.status(401).send({'Error':'You must be an owner to perform that action.'});
    }
}

var isStaff = (req, res, next) => {
    if(req.user){
        if(req.user.userType == 'Owner' || req.user.userType == 'Staff'){
            next();
        } else {
            res.status(401).send({'Error':'You must be signed up to perform that action.'});    
        }
    } else {
        res.status(401).send({'Error':'You must be signed up to perform that action.'});
    }
}

var isCustomer = (req, res, next) => {
    if(req.user){
        if(req.user.userType == 'Owner' || req.user.userType == 'Staff' || req.user.userType == 'Customer'){
            next();
        } else {
            res.status(401).send({'Error':'You must be signed up to perform that action.'});    
        }
    } else {
        res.status(401).send({'Error':'You must be signed up to perform that action.'});
    }
}

module.exports = {isOwner, isStaff, isCustomer};