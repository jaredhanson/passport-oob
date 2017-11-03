/* global describe, it, expect */

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
  
});
