/* global describe, it, expect */

var chai = require('chai');
var Strategy = require('../lib/strategy');


describe('Strategy', function() {
  
  it('should be named oob', function() {
    var strategy = new Strategy(function(){});
    expect(strategy.name).to.equal('oob');
  });
  
  it('should throw if constructed without a verify function', function() {
    expect(function() {
      new Strategy();
    }).to.throw(TypeError, 'OOBStrategy requires a verify function');
  });
  
  it('should verify address', function(done) {
    chai.passport.use(new Strategy(function(address, cb) {
      expect(address).to.equal('+1-201-555-0123');
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
  
  it('should verify address and channel', function(done) {
    chai.passport.use(new Strategy(function(address, channel, cb) {
      expect(address).to.equal('+1-201-555-0123');
      expect(channel).to.equal('tel');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
        req.state = {
          address: '+1-201-555-0123',
          channel: 'tel',
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
  
  it('should verify address, transport, and channel', function(done) {
    chai.passport.use(new Strategy(function(address, transport, channel, cb) {
      expect(address).to.equal('+1-201-555-0123');
      expect(transport).to.equal('sms');
      expect(channel).to.equal('tel');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
        req.state = {
          address: '+1-201-555-0123',
          transport: 'sms',
          channel: 'tel',
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
  
  it('should verify request and address', function(done) {
    chai.passport.use(new Strategy({ passReqToCallback: true }, function(req, address, cb) {
      expect(req.constructor.name).to.equal('Request');
      expect(address).to.equal('+1-201-555-0123');
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
  
  it('should verify request, address, and channel', function(done) {
    chai.passport.use(new Strategy({ passReqToCallback: true }, function(req, address, channel, cb) {
      expect(req.constructor.name).to.equal('Request');
      expect(address).to.equal('+1-201-555-0123');
      expect(channel).to.equal('tel');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
        req.state = {
          address: '+1-201-555-0123',
          channel: 'tel',
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
  
  it('should verify request, address, transport, and channel', function(done) {
    chai.passport.use(new Strategy({ passReqToCallback: true }, function(req, address, transport, channel, cb) {
      expect(req.constructor.name).to.equal('Request');
      expect(address).to.equal('+1-201-555-0123');
      expect(transport).to.equal('sms');
      expect(channel).to.equal('tel');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
        req.state = {
          address: '+1-201-555-0123',
          transport: 'sms',
          channel: 'tel',
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
  
  it('should fail when credential is invalid', function(done) {
    chai.passport.use(new Strategy(function(address, cb) {
      expect(address).to.equal('+1-201-555-0123');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '000000'
        };
        req.state = {
          address: '+1-201-555-0123',
          secret: '123456'
        };
      })
      .fail(function(challenge, status) {
        expect(challenge).to.deep.equal({ message: 'Incorrect one-time code.' });
        expect(status).to.be.undefined;
        done();
      })
      .error(done)
      .authenticate();
  });
  
  it('should fail when verify function yields false', function(done) {
    chai.passport.use(new Strategy(function(address, cb) {
      return cb(null, false, { message: 'Address not allowed.' });
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
      .fail(function(challenge, status) {
        expect(challenge).to.deep.equal({ message: 'Address not allowed.' });
        expect(status).to.be.undefined;
        done();
      })
      .error(done)
      .authenticate();
  });
  
  it('should fail when missing credential', function(done) {
    chai.passport.use(new Strategy(function(address, cb) {
      expect(address).to.equal('+1-201-555-0123');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {};
        req.state = {
          address: '+1-201-555-0123',
          secret: '123456'
        };
      })
      .fail(function(challenge, status) {
        expect(challenge).to.deep.equal({ message: 'Missing one-time code.' });
        expect(status).to.equal(400);
        done();
      })
      .error(done)
      .authenticate();
  });
  
  it('should fail when state is missing an address', function(done) {
    chai.passport.use(new Strategy(function(address, cb) {
      expect(address).to.equal('+1-201-555-0123');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
        req.state = {
          secret: '123456'
        };
      })
      .fail(function(challenge, status) {
        expect(challenge).to.deep.equal({ message: 'Invalid out-of-band authentication request state.' });
        expect(status).to.equal(403);
        done();
      })
      .error(done)
      .authenticate();
  });
  
  it('should fail when state is missing a secret', function(done) {
    chai.passport.use(new Strategy(function(address, cb) {
      expect(address).to.equal('+1-201-555-0123');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
        req.state = {
          address: '+1-201-555-0123'
        };
      })
      .fail(function(challenge, status) {
        expect(challenge).to.deep.equal({ message: 'Invalid out-of-band authentication request state.' });
        expect(status).to.equal(403);
        done();
      })
      .error(done)
      .authenticate();
  });
  
  it('should fail when state is missing', function(done) {
    chai.passport.use(new Strategy(function(address, cb) {
      expect(address).to.equal('+1-201-555-0123');
      return cb(null, { id: '248289761001' });
    }))
      .request(function(req) {
        req.body = {
          code: '123456'
        };
      })
      .fail(function(challenge, status) {
        expect(challenge).to.deep.equal({ message: 'Unable to verify one-time code.' });
        expect(status).to.equal(403);
        done();
      })
      .error(done)
      .authenticate();
  });
  
  it('should error when verify function calls callback with an error', function(done) {
    chai.passport.use(new Strategy(function(address, cb) {
      return cb(new Error('something went wrong'));
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
      .error(function(err) {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.equal('something went wrong');
        done();
      })
      .authenticate();
  });
  
  it('should error when verify function throws an error', function(done) {
    chai.passport.use(new Strategy(function(address, cb) {
      throw new Error('something went wrong');
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
      .error(function(err) {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.equal('something went wrong');
        done();
      })
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
