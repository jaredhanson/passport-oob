/* global describe, it, expect */

var chai = require('chai');
var Strategy = require('../lib/strategy');
var Gateway = require('../lib/gateway');


describe('Strategy', function() {
  
  it('should be named oob', function() {
    var strategy = new Strategy(new Gateway(), function(){});
    expect(strategy.name).to.equal('oob');
  });
  
  it('should throw if constructed without a gatway', function() {
    expect(function() {
      var s = new Strategy(function(){});
    }).to.throw(TypeError, 'OOBStrategy requires a gateway');
  });
  
  it('should throw if constructed without a fetch callback', function() {
    expect(function() {
      var s = new Strategy(new Gateway());
    }).to.throw(TypeError, 'OOBStrategy requires a fetch callback');
  });
  
  describe.only('handling an approved request with credentials in body', function() {
    var gateway = new Gateway();
    var channel = {
      verify: function(authnr, ticket, cb) {
        if (authnr.id !== 'dev_324598') { return done(new Error('incorrect authnr argument')); }
        if (ticket !== '2YotnFZFEjr1zCsicMWpAA') { return done(new Error('incorrect ticket argument')); }
        return cb(null, true);
      }
    }
    gateway.use('sms', channel);
    
    var strategy = new Strategy(gateway, function(ticket, done) {
      if (ticket !== '2YotnFZFEjr1zCsicMWpAA') { return done(new Error('incorrect ticket argument')); }
      
      var user = {
        id: '501',
        displayName: 'John Doe'
      };
      var authnr = {
        id: 'dev_324598',
        name: "John's Phone",
        channel: 'sms'
      };
      return done(null, user, authnr);
    });
    
    var user, info;
    
    before(function(done) {
      chai.passport.use(strategy)
        .success(function(u, i) {
          user = u;
          info = i;
          done();
        })
        .req(function(req) {
          req.body = { ticket: '2YotnFZFEjr1zCsicMWpAA' };
        })
        .authenticate();
    });
    
    it('should supply user', function() {
      expect(user).to.be.an.object;
      expect(user.id).to.equal('501');
    });
    
    it('should supply info', function() {
      expect(info).to.be.an.object;
      expect(info.method).to.equal('oob');
    });
  }); // handling an approved request with credentials in body
  
  describe('handling a request without a ticket in body', function() {
    var strategy = new Strategy(new Gateway(), function(){});
    
    var info, status;
    
    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i, s) {
          info = i;
          status = s;
          done();
        })
        .req(function(req) {
          req.body = {};
        })
        .authenticate();
    });
    
    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing ticket');
      expect(status).to.equal(400);
    });
  }); // handling a request without a ticket in body
  
  describe('handling a request without a ticket in query', function() {
    var strategy = new Strategy(new Gateway(), function(){});
    
    var info, status;
    
    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i, s) {
          info = i;
          status = s;
          done();
        })
        .req(function(req) {
          req.query = {};
        })
        .authenticate();
    });
    
    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing ticket');
      expect(status).to.equal(400);
    });
  }); // handling a request without a ticket in query
  
  describe('handling a request without body', function() {
    var strategy = new Strategy(new Gateway(), function(){});
    
    var info, status;
    
    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i, s) {
          info = i;
          status = s;
          done();
        })
        .req(function(req) {
        })
        .authenticate();
    });
    
    it('should fail with info and status', function() {
      expect(info).to.be.an.object;
      expect(info.message).to.equal('Missing ticket');
      expect(status).to.equal(400);
    });
  }); // handling a request without body
  
});