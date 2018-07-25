const express = require('express');
const {authenticate, isOwner, isStaff, isCustomer} = require('./../../middleware');
const _ = require('lodash');
const {ObjectID, Business} = require('./../../models');

module.exports = (function(){
    'use strict'
    var apiBusiness = express();

    // Route: {api/v?}/businesses
    // Parameters:
    // name: required
    // header: x-auth - user token
    apiBusiness.post('/',authenticate,isOwner,(req,res)=>{
        var business = new Business({
            name: req.body.name,
            _creator: req.user._id
        });
        business.save().then((business) => {
            res.send({business});
        }, (e) => {
            
            res.status(400).send(e);
        });        
    });

    // Route: {api/v?}/businesses
    // Parameters:
    // none
    apiBusiness.get('/',(req,res)=>{
        Business.find().then((businesses)=>{
            res.send({businesses});
        },(err)=>{
            res.status(400).send(err);
        });
    });

    // Route: {api/v?}/businesses/:id
    // Parameters:
    // id: required
    apiBusiness.get('/:id',(req,res)=>{
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

    // Route: {api/v?}/businesses/:id
    // Parameters:
    // id: required
    apiBusiness.delete('/:id',authenticate,isOwner,(req,res)=>{
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

    // Route: {api/v?}/businesses/:id
    // Parameters:
    // id: required
    // name: required
    apiBusiness.patch('/:id',authenticate,isOwner,(req,res)=>{
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

    return apiBusiness;
})();