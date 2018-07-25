const authenticate = require('./authenticate').authenticate;
const {isOwner, isStaff, isCustomer} = require('./users');


module.exports = {authenticate, isOwner, isStaff, isCustomer};