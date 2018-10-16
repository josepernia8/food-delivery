const chai     = require('chai');
const chaiHttp = require('chai-http');
const server   = require('../app');
const should   = chai.should();

chai.use(chaiHttp);
let JWT = '';

describe('Users', function() {
  it('should list ALL users on /user GET', function(done) {
    chai.request(server)
      .get('/user')
      .end(function(err, res){
        res.should.have.status(200);
        done();
      });
  });
  it('should get authorizated token on /user/login POST', function(done) {
    chai.request(server)
      .post('/user/login')
      .send({
        "username": "jdoe",
	      "password": "123456"
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.status.should.be.a('string');
        res.body.status.should.equal('success');
        res.body.should.have.property('data');
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('Token');
        res.body.data.Token.should.be.a('string');
        JWT = res.body.data.Token;
        done();
      });
  });
});

describe('Restaurants', function() {
  it('should list ALL restaurants on /restaurants GET', function(done) {
    chai.request(server)
      .get('/restaurants')
      .set('Authorization', `Bearer ${JWT}`)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        done();
      });
  });
  it('should list a SINGLE restaurant on /restaurants/<id> GET', function(done) {
    chai.request(server)
      .get('/restaurants/1')
      .set('Authorization', `Bearer ${JWT}`)
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        done();
      });
  });
  it('should add a SINGLE restaurant on /restaurants POST', function(done) {
    chai.request(server)
      .post('/restaurants')
      .set('Authorization', `Bearer ${JWT}`)
      .send({
        "logo": "https://static.tacdn.com/img2/branding/rebrand/TA_logo_secondary.svg",
        "commercialname": "Mariella Pizza",
        "legalname": "Mariella Pizza",
        "commercialemail": "mariellapizza@gmail.com",
        "adminnumber": "+1 212-757-5278",
        "address": "935 8th Ave At the rear of The Bread Factory New York City, NY 10019-4256",
        "latitude": 40.7657566,
        "longitude": -73.9861177
      })
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.status.should.be.a('string');
        res.body.status.should.equal('success');
        done();
      });
  });
});