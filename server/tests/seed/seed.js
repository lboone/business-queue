const {ObjectID, Business, User} = require('./../../models');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'lloyd@example.com',
    firstName: 'Lloyd',
    lastName: 'Boone',
    userType: 'Owner',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({id: userOneId, access: 'auth'},process.env.JWT_SECRET).toString()
    }]
},{
    _id: userTwoId,
    email: 'melissa@example.com',
    firstName: 'Melissa',
    lastName: 'Boone',
    userType: 'Customer',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({id: userTwoId, access: 'auth'},process.env.JWT_SECRET).toString()
    }]
}];

const businesses = [
    {
         _id: new ObjectID(), 
        name: 'First test business',
        _creator: userOneId
    },{
         _id: new ObjectID(), 
        name: 'Second test business',
        _creator: userTwoId
    }
];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne,userTwo]);
    }).then(() => done());
}

const populateBusinesses = (done) => {
    Business.remove({}).then(() => {
        return Business.insertMany(businesses);
    }).then(() => done());
}

module.exports = {businesses, populateBusinesses, users, populateUsers};