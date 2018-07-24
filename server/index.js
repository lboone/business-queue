require('./config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {ObjectID,User, Business} = require('./models');
const {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

// Configure bodyParser middleware
app.use(bodyParser.json());


// All Business routes
app.post('/api/v1/businesses',(req,res)=>{
    var business = new Business({
        name: req.body.name
    });
    business.save().then((business) => {
        res.send({business});
    }, (e) => {
        
        res.status(400).send(e);
    });
});
app.get('/api/v1/businesses',(req,res)=>{
    Business.find().then((businesses)=>{
        res.send({businesses});
    },(err)=>{
        res.status(400).send(err);
    });
});
app.get('/api/v1/businesses/:id',(req,res)=>{
    var id = req.params.id;
    if(ObjectID.isValid(id)){
        Business.findById(id).then((business)=>{
            if(!business){
                res.status(404).send({'Error':'Business not found!'});
            } else {
                res.send({business});
            }
        }).catch((error) => res.status(400).send({'Error':error}));
    } else {
        res.status(404).send({'Error':'ID not valid!'});
    }
});
app.delete('/api/v1/businesses/:id',(req,res)=>{
    var id = req.params.id;
    if(ObjectID.isValid(id)){
        Business.findByIdAndDelete(id).then((business)=>{
            if(!business){
                res.status(404).send({'Error':'Business not found!'});
            } else {
                res.send({business});
            }
        }).catch((error) => res.status(400).send({'Error':error}));
    } else {
        res.status(404).send({'Error':'ID not valid!'});
    }
});
app.patch('/api/v1/businesses/:id',(req,res)=>{
    var id = req.params.id;
    if(ObjectID.isValid(id)){
        var body = _.pick(req.body, ['name']);

        Business.findByIdAndUpdate(id,{$set:body},{new: true}).then((business) => {
            if(!business){
                return res.status(404).send({'Error':'Business does not exist'});
            }
            res.send({business});
        }).catch((e) => res.status(400).send());
    } else {
        return res.status(404).send({'Error':'ID not valid!'});
    }
});

// All User routes
// Signup
app.post('/api/v1/users',(req,res)=>{
    var body = _.pick(req.body,['email','password','firstName','lastName','userType']);
    var user = new User(body);
    
    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send({user})
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// Login
app.get('/api/v1/users/me',authenticate, (req,res)=>{
    var user = req.user;
    res.send({user});
});

// Start the server
app.listen(port,() => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};