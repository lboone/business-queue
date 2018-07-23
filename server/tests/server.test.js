const expect = require('expect');
const request = require('supertest');

var {app} = require('./../index');
const {Business} = require('./../models');

const businesses = [
    {
        name: 'First test business'
    },{
        name: 'Second test business'
    }
];

beforeEach((done) => {
    Business.remove({}).then(() => {
        return Business.insertMany(businesses);
    }).then(() => done());
});

describe('Test - Businesses', () => {

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
});