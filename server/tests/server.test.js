const expect = require('expect');
const request = require('supertest');

var {app} = require('./../index');
const {ObjectID,Business} = require('./../models');

const businesses = [
    {
         _id: new ObjectID(), 
        name: 'First test business'
    },{
         _id: new ObjectID(), 
        name: 'Second test business'
    }
];

beforeEach((done) => {
    Business.remove({}).then(() => {
        return Business.insertMany(businesses);
    }).then(() => done());
});

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
            request(app)
                .delete(`/api/v1/businesses/${businesses[0]._id.toHexString()}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.business.name).toBe(businesses[0].name);
                })
                .end(done);
    
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

});