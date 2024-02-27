/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util');


/**
 * `Strategy` constructor.
 *
 * @param {Object} options
 * @param {Gateway} gateway
 * @param {Function} fetch
 * @api public
 */
function Strategy(options, verify, transmit) {
  if (typeof options == 'function') {
    transmit = verify;
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('OOBStrategy requires a verify callback'); }
  
  this._addressField = options.addressField || 'address';
  this._codeField = options.ticketField || 'code';
  
  passport.Strategy.call(this);
  this.name = 'oob';
  this._verify = verify;
  this._transmit = transmit;
  this._passReqToCallback = options.passReqToCallback;
  this._verifyURL = options.verifyURL;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on an out-of-band authentication challenge.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var address = (req.body && req.body[this._addressField]) || (req.query && req.query[this._addressField])
    , code = (req.body && req.body[this._codeField]) || (req.query && req.query[this._codeField]);
  
  //if (!address || !code) {
  //  return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  //}
  
  var self = this;
  
  
  if (code) {
  
  
    function verified(err, user, info) {
      if (err) { return self.error(err); }
      if (!user) { return self.fail(info); }
      self.success(user, info);
    }
  
    try {
      if (self._passReqToCallback) {
        this._verify(req, address, code, verified);
      } else {
        this._verify(address, code, verified);
      }
    } catch (ex) {
      return self.error(ex);
    }
  } else {
    console.log('TRANSMIT A CODE, BOUND TO CHANNEL...');
    console.log(req.body)
    console.log(req.state);
    
    this._transmit(address, function(err, state) {
      console.log('TRANSMITTED...');
      console.log(err)
      console.log(state);
      
      var state = state || {};
      state.address = state.address || address;
      
      
      req.pushState(state, self._verifyURL);
      self.redirect(self._verifyURL);
      // FIXME: Why does state param need appending here?  Shouldn't flowstate be doing it?
    });
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
