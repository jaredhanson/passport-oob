/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util');


/**
 * `Strategy` constructor.
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, gateway, fetch) {
  if (typeof options.verify == 'function') {
    fetch = gateway;
    gateway = options;
    options = {};
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
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var ticket = req.body[this._ticketField] || req.query[this._ticketField];
  
  if (!ticket) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  }
  
  var self = this;
  
  function fetched(err, user, authnr) {
    console.log('OK, NOW WE VERIFY???');
    console.log(user)
    console.log(authnr);
    self._gateway.verify(authnr, ticket, function(err, ok) {
      console.log('VERIFIED!');
      console.log(err);
      console.log(ok);
      
      if (err) { return self.error(err); }
      if (ok === undefined) {
        return self.pass();
      }
      if (!ok) {
        return self.fail();
      }
      
      var info = { method: 'oob' };
      
      // TODO: setup authInfo
      return self.success(user, info);
    })
    
    return;
    
    if (err) { return self.error(err); }
    if (ok === false) {
      return self.fail(info);
    }
    if (ok === undefined) {
      // TODO: make an option to re-render the page
      return self.redirect('/todo');
    }
    
    info = info || {};
    info.method = info.method || 'oob';
    self.success(req.user, info);
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
