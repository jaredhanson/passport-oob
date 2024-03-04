/* global describe, it, expect */

var chai = require('chai');
var Strategy = require('../lib/strategy');


describe('Strategy', function() {
  
  /*
  it('should be named oob', function() {
    var strategy = new Strategy(new Gateway(), function(){});
    expect(strategy.name).to.equal('oob');
  });
  
  it('should throw if constructed with no arguments', function() {
    expect(function() {
      var s = new Strategy();
    }).to.throw(TypeError, 'OOBStrategy requires a gateway');
  });
  
  it('should throw if constructed without a gateway', function() {
    expect(function() {
      var s = new Strategy(function(){});
    }).to.throw(TypeError, 'OOBStrategy requires a gateway');
  });
  
  it('should throw if constructed without a fetch callback', function() {
    expect(function() {
      var s = new Strategy(new Gateway());
    }).to.throw(TypeError, 'OOBStrategy requires a fetch callback');
  });
  */
  
  it('should verify address and code', function(done) {
    chai.passport.use(new Strategy(function(address, code, cb) {
      expect(address).to.equal('+1-201-555-0123');
      expect(code).to.equal('123456');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
        req.state = {
          address: '+1-201-555-0123',
          secret: '123456'
        };
      })
      .success(function(user, info) {
        expect(user).to.deep.equal({ id: '248289761001' });
        expect(info).to.be.undefined;
        done();
      })
      .error(done)
      .authenticate();
  });
  
  it('should verify address, transport, and code', function(done) {
    chai.passport.use(new Strategy(function(address, transport, code, cb) {
      expect(address).to.equal('+1-201-555-0123');
      expect(transport).to.equal('sms');
      expect(code).to.equal('123456');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
        req.state = {
          address: '+1-201-555-0123',
          transport: 'sms',
          secret: '123456'
        };
      })
      .success(function(user, info) {
        expect(user).to.deep.equal({ id: '248289761001' });
        expect(info).to.be.undefined;
        done();
      })
      .error(done)
      .authenticate();
  });
  
  it('should verify address, transport, context, and code', function(done) {
    chai.passport.use(new Strategy(function(address, transport, ctx, code, cb) {
      expect(address).to.equal('+1-201-555-0123');
      expect(transport).to.equal('sms');
      expect(ctx).to.deep.equal({
        address: '+1-201-555-0123',
        transport: 'sms',
        type: 'tel',
        secret: '123456'
      });
      expect(code).to.equal('123456');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
        req.state = {
          address: '+1-201-555-0123',
          transport: 'sms',
          type: 'tel',
          secret: '123456'
        };
      })
      .success(function(user, info) {
        expect(user).to.deep.equal({ id: '248289761001' });
        expect(info).to.be.undefined;
        done();
      })
      .error(done)
      .authenticate();
  });
  
  it('should verify request, address, and code', function(done) {
    chai.passport.use(new Strategy({ passReqToCallback: true }, function(req, address, code, cb) {
      expect(req.constructor.name).to.equal('Request');
      expect(address).to.equal('+1-201-555-0123');
      expect(code).to.equal('123456');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
        req.state = {
          address: '+1-201-555-0123',
          secret: '123456'
        };
      })
      .success(function(user, info) {
        expect(user).to.deep.equal({ id: '248289761001' });
        expect(info).to.be.undefined;
        done();
      })
      .error(done)
      .authenticate();
  });
  
  it('should verify request, address, transport, and code', function(done) {
    chai.passport.use(new Strategy({ passReqToCallback: true }, function(req, address, transport, code, cb) {
      expect(req.constructor.name).to.equal('Request');
      expect(address).to.equal('+1-201-555-0123');
      expect(transport).to.equal('sms');
      expect(code).to.equal('123456');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
        req.state = {
          address: '+1-201-555-0123',
          transport: 'sms',
          secret: '123456'
        };
      })
      .success(function(user, info) {
        expect(user).to.deep.equal({ id: '248289761001' });
        expect(info).to.be.undefined;
        done();
      })
      .error(done)
      .authenticate();
  });
  
  it('should verify request, address, transport, context, and code', function(done) {
    chai.passport.use(new Strategy({ passReqToCallback: true }, function(req, address, transport, ctx, code, cb) {
      expect(req.constructor.name).to.equal('Request');
      expect(address).to.equal('+1-201-555-0123');
      expect(transport).to.equal('sms');
      expect(ctx).to.deep.equal({
        address: '+1-201-555-0123',
        transport: 'sms',
        type: 'tel',
        secret: '123456'
      });
      expect(code).to.equal('123456');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
        req.state = {
          address: '+1-201-555-0123',
          transport: 'sms',
          type: 'tel',
          secret: '123456'
        };
      })
      .success(function(user, info) {
        expect(user).to.deep.equal({ id: '248289761001' });
        expect(info).to.be.undefined;
        done();
      })
      .error(done)
      .authenticate();
  });
  
  
  /*
  describe('handling an approved request with credentials in body', function() {
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
  */
  
  /*
  describe('handling an approved request with credentials in query', function() {
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
          req.query = { ticket: '2YotnFZFEjr1zCsicMWpAA' };
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
  }); // handling an approved request with credentials in query
  */
  
  /*
  describe('handling an approved request with credentials in body, using request', function() {
    var gateway = new Gateway();
    var channel = {
      verify: function(authnr, ticket, cb) {
        if (authnr.id !== 'dev_324598') { return done(new Error('incorrect authnr argument')); }
        if (ticket !== '2YotnFZFEjr1zCsicMWpAA') { return done(new Error('incorrect ticket argument')); }
        return cb(null, true);
      }
    }
    gateway.use('sms', channel);
    
    var strategy = new Strategy({ passReqToCallback: true }, gateway, function(req, ticket, done) {
      if (req.headers['host'] !== 'acme.example.com') { return done(new Error('incorrect req argument')); }
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
          req.headers['host'] = 'acme.example.com';
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
  }); // handling an approved request with credentials in body, using request
  */
  
  /*
  describe('handling a denied request', function() {
    var gateway = new Gateway();
    var channel = {
      verify: function(authnr, ticket, cb) {
        if (authnr.id !== 'dev_324598') { return done(new Error('incorrect authnr argument')); }
        if (ticket !== '2YotnFZFEjr1zCsicMWpAA') { return done(new Error('incorrect ticket argument')); }
        return cb(null, false);
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
    
    var info;
    
    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i) {
          info = i;
          done();
        })
        .req(function(req) {
          req.body = { ticket: '2YotnFZFEjr1zCsicMWpAA' };
        })
        .authenticate();
    });
    
    it('should not supply info', function() {
      expect(info).to.be.undefined;
    });
  }); // handling a denied request
  */
  
  /*
  describe('handling a pending request', function() {
    var gateway = new Gateway();
    var channel = {
      verify: function(authnr, ticket, cb) {
        if (authnr.id !== 'dev_324598') { return done(new Error('incorrect authnr argument')); }
        if (ticket !== '2YotnFZFEjr1zCsicMWpAA') { return done(new Error('incorrect ticket argument')); }
        return cb(null, undefined);
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
    
    before(function(done) {
      chai.passport.use(strategy)
        .pass(function() {
          done();
        })
        .req(function(req) {
          req.body = { ticket: '2YotnFZFEjr1zCsicMWpAA' };
        })
        .authenticate();
    });
    
    it('should pass', function() {
      expect(true).to.be.true;
    });
  }); // handling a pending request
  */
  
  /*
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
  */
  
  /*
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
  */
  
  /*
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
  */
  
  /*
  describe('encountering an error while fetching user and authenticator', function() {
    var gateway = new Gateway();
    var channel = {
      verify: function(authnr, ticket, cb) {
        return cb(null, true);
      }
    }
    gateway.use('sms', channel);
    
    var strategy = new Strategy(gateway, function(ticket, done) {
      return done(new Error('something went wrong'));
    });
    
    var err;
    
    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.body = { ticket: '2YotnFZFEjr1zCsicMWpAA' };
        })
        .authenticate();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went wrong');
    });
  }); // encountering an error while fetching user and authenticator
  */
  
  /*
  describe('encountering an exception while fetching user and authenticator', function() {
    var gateway = new Gateway();
    var channel = {
      verify: function(authnr, ticket, cb) {
        return cb(null, true);
      }
    }
    gateway.use('sms', channel);
    
    var strategy = new Strategy(gateway, function(ticket, done) {
      throw new Error('something went horribly wrong');
    });
    
    var err;
    
    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.body = { ticket: '2YotnFZFEjr1zCsicMWpAA' };
        })
        .authenticate();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('something went horribly wrong');
    });
  }); // encountering an exception while fetching user and authenticator
  */
  
  /*
  describe('encountering an error while verifying request', function() {
    var gateway = new Gateway();
    var channel = {
      verify: function(authnr, ticket, cb) {
        return cb(new Error('failed to verify request'));
      }
    }
    gateway.use('sms', channel);
    
    var strategy = new Strategy(gateway, function(ticket, done) {
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
    
    var err;
    
    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.body = { ticket: '2YotnFZFEjr1zCsicMWpAA' };
        })
        .authenticate();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('failed to verify request');
    });
  }); // encountering an error while verifying request
  */
  
  /*
  describe('failing due to unsupported channel', function() {
    var gateway = new Gateway();
    var channel = {
      verify: function(authnr, ticket, cb) {
        return cb(null, true);
      }
    }
    gateway.use('sms', channel);
    
    var strategy = new Strategy(gateway, function(ticket, done) {
      var user = {
        id: '501',
        displayName: 'John Doe'
      };
      var authnr = {
        id: 'dev_324598',
        name: "John's Phone",
        channel: 'foo'
      };
      return done(null, user, authnr);
    });
    
    var err;
    
    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.body = { ticket: '2YotnFZFEjr1zCsicMWpAA' };
        })
        .authenticate();
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('OOB channel "foo" is not supported');
    });
  }); // failing due to unsupported channel
  */
  
});
