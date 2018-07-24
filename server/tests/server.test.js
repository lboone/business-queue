const expect = require('expect');
const request = require('supertest');

var {app} = require('./../index');
const {ObjectID,Business, User} = require('./../models');
const {businesses, populateBusinesses, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateBusinesses);


describe('TEST - BUSINESSES', () => {

    describe('GET /api/v1/businesses', () => {
        it('should get all businesses',(done) => {
            request(app)
                .get('/api/v1/businesses')
                .expect(200)
                .expect((res)=>{
                    expect(res.body.businesses.length).toBe(2);
                })
                .end(done);
        })
    });

    describe('POST /api/v1/businesses', ()=>{
        it('should create a new business',(done) => {
            var name = 'Test business name';
            request(app)
                .post('/api/v1/businesses')
                .send({name})
                .expect(200)
                .expect((res) => {
                    expect(res.body.business.name).toBe(name);
                    expect(typeof res.body.business.addedAt).toBe('number');
                })
                .end((err, res) => {
                    if(err){
                        return done(err);
                    }
    
                    Business.find({name}).then((businesses) => {
                        expect(businesses.length).toBe(1);
                        expect(businesses[0].name).toBe(name);
                        done();
                    }).catch((err)=> done(err));
                });
        });
    
        it('should not create business with invalid body data',(done) => {
            request(app)
            .post('/api/v1/businesses')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
    
                Business.find().then((businesses) => {
                    expect(businesses.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            })
        });
    });

    describe('GET /api/v1/businesses/:id',()=>{
        it('should return business doc',(done) => {
            request(app)
                .get(`/api/v1/businesses/${businesses[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.business.name).toBe(businesses[0].name);
                })
                .end(done);
    
        });

        it('should return 404 if business not found',(done) => {
            var id = new ObjectID();
            request(app)
                .get(`/api/v1/businesses/${id.toHexString()}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non object ids',(done) => {
            request(app)
                .get('/api/v1/businesses/123')
                .expect(404)
                .end(done);
        });
    });

    describe('DELETE /api/v1/businesses/:id',()=>{
        it('should delete and return business doc',(done) => {
            var hexId = businesses[0]._id.toHexString();
            request(app)
                .delete(`/api/v1/businesses/${hexId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.business._id).toBe(hexId);
                })
                .end((err,res)=> {
                    if(err){
                        return done(err);
                    }
                    Business.findById(hexId).then((business) => {
                        expect(business).toBeFalsy();
                        done();
                    }).catch((err) => done(err));
                });
    
        });
        
        it('should return 404 if todo not found',(done) => {
            var id = new ObjectID();
            request(app)
                .delete(`/api/v1/businesses/${id.toHexString()}`)
                .expect(404)
                .end(done);
        });
    
        it('should return 404 for non object ids',(done) => {
            request(app)
                .delete('/api/v1/businesses/123')
                .expect(404)
                .end(done);
        });
    });

    describe('PATCH /api/v1/businesses/:id',() => {
        it('should update the business',(done) => {
            var id = businesses[0]._id.toHexString();
            var newName = 'A new name for this business';
            request(app)
                .patch(`/api/v1/businesses/${id}`)
                .send({
                    name: newName,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.business.name).toBe(newName);
                })
                .end(done);
        });
    });
});

describe('TEST - USERS', () => {
    describe('GET /api/v1/users/me', () =>{
        it('should return user is authenticated', (done) => {
            request(app)
                .get('/api/v1/users/me')
                .set('x-auth',users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    expect(res.body.user._id).toBe(users[0]._id.toHexString());
                    expect(res.body.user.email).toBe(users[0].email);
                })
                .end(done);
        });
    
        it('should return 401 if not authenticated', (done) => {
            request(app)
                .get('/api/v1/users/me')
                .expect(401)
                .expect((res) => {
                    expect(res.body).toEqual({"Error":"Authentication error.  Please provide a valid token."});
                })
                .end(done);
        });
    });

    describe('POST /api/v1/users',() => {
        it('should create a user',(done) => {
            var email = 'example@example.com';
            var password = '123mnb!1234';
            var firstName = 'Example';
            var lastName = 'Example';
            request(app)
                .post('/api/v1/users')
                .send({email,password,firstName,lastName})
                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toBeTruthy();
                    expect(res.body.user._id).toBeTruthy();
                    expect(res.body.user.email).toBe(email);
                    expect(res.body.user.userType).toBe('Customer');
                })
                .end((err) => {
                    if(err){
                        return done(err);
                    }
                    User.findOne({email}).then((user) => {
                        expect(user).toBeTruthy();
                        expect(user.password === password).toBeFalsy();
                        done();
                    });
                });
        });
        it('should return validation errors if request invalid', (done) => {
            var email = 'example';
            var password = '123mnb!';
            request(app)
                .post('/api/v1/users')
                .send({email,password})
                .expect(400)
                .expect((res) => {
                    expect(res.body['errors']['email']).toBeTruthy();
                    expect(res.body['errors']['password']).toBeTruthy();
                    expect(res.body['errors']['firstName']).toBeTruthy();
                    expect(res.body['errors']['lastName']).toBeTruthy();
                })
                .end(done);
        });
        it('should not create user if email in use', (done) => {
            var email = users[0].email;
            var password = '123mnb!1234';
            var firstName = 'Example';
            var lastName = 'Example';
            request(app)
                .post('/api/v1/users')
                .send({email,password,firstName,lastName})
                .expect(400)
                .expect((res) => {
                    expect(res.body['name'] == 'MongoError').toBeTruthy();
                })
                .end(done);
        });
    });
});