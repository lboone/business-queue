const express = require('express');
const bodyParser = require('body-parser');

var {ObjectID,User, Business} = require('./models');

var app = express();

// Configure bodyParser middleware
app.use(bodyParser.json());


// Add a Business
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

// Get all Businesses
app.get('/api/v1/businesses',(req,res)=>{
    Business.find().then((businesses)=>{
        res.send({businesses});
    },(err)=>{
        res.status(400).send(err);
    });
})

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


app.listen(3001,() => {
    console.log('Started on port 3001');
});

module.exports = {app};