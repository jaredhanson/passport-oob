/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , uri = require('url')
  , util = require('util')
  , merge = require('utils-merge');


/**
 * `Strategy` constructor.
 *
 * @param {Object} options
 * @param {Gateway} gateway
 * @param {Function} fetch
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('OOBStrategy requires a verify callback'); }
  
  this._addressField = options.addressField || 'address';
  this._transportField = options.transportField || 'transport';
  this._codeField = options.ticketField || 'code';
  
  passport.Strategy.call(this);
  this.name = 'oob';
  this._verify = verify;
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
  
  // TODO: Validate state exists
  
  var code = (req.body && req.body[this._codeField]) || (req.query && req.query[this._codeField])
    , address = req.state.address
    , transport = req.state.transport;
  
  //if (!address || !code) {
  //  return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  //}
  
  var self = this;

  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }

  try {
    if (self._passReqToCallback) {
      var arity = self._verify.length;
      if (arity == 6) {
        this._verify(req, address, transport, req.state, code, verified);
      } else if (arity == 5) {
        this._verify(req, address, transport, code, verified);
      } else { // arity == 4
        this._verify(req, address, code, verified);
      }
    } else {
      var arity = self._verify.length;
      if (arity == 5) {
        this._verify(address, transport, req.state, code, verified);
      } else if (arity == 4) {
        this._verify(address, transport, code, verified);
      } else { // arity == 3
        this._verify(address, code, verified);
      }
    }
  } catch (ex) {
    return self.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
