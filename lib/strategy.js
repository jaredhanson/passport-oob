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
function Strategy(options, gateway, fetch) {
  if (!options || typeof options.verify == 'function') {
    fetch = gateway;
    gateway = options;
    options = {};
  }
  if (typeof options == 'function') {
    fetch = gateway;
    gateway = options;
  }
  if (typeof gateway == 'function') {
    fetch = gateway;
    gateway = undefined;
  }
  
  if (!gateway) { throw new TypeError('OOBStrategy requires a gateway'); }
  if (!fetch) { throw new TypeError('OOBStrategy requires a fetch callback'); }
  
  this._ticketField = options.ticketField || 'ticket';
  
  passport.Strategy.call(this);
  this.name = 'oob';
  this._gateway = gateway;
  this._fetch = fetch;
  this._passReqToCallback = options.passReqToCallback;
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
  var ticket = (req.body && req.body[this._ticketField]) || (req.query && req.query[this._ticketField]);
  
  if (!ticket) {
    return this.fail({ message: options.badRequestMessage || 'Missing ticket' }, 400);
  }
  
  var self = this;
  
  function fetched(err, user, authnr) {
    if (err) { return self.error(err); }
    
    function verified(err, ok) {
      if (err) { return self.error(err); }
      if (ok === undefined) {
        return self.pass();
      }
      if (!ok) {
        return self.fail();
      }
      
      var info = { method: 'oob' };
      return self.success(user, info);
    }
    
    self._gateway.verify(authnr, ticket, verified);
  }
  
  try {
    if (self._passReqToCallback) {
      this._fetch(req, ticket, fetched);
    } else {
      this._fetch(ticket, fetched);
    }
  } catch (ex) {
    return self.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
