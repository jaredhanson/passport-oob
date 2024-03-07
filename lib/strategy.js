/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , crypto = require('crypto')
  , util = require('util');


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
  if (!verify) { throw new TypeError('OOBStrategy requires a verify function'); }
  
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
  
  var code = (req.body && req.body[this._codeField]) || (req.query && req.query[this._codeField])
  if (!code) {
    return this.fail({ message: options.badRequestMessage || 'Missing one-time code.' }, 400);
  }
  
  if (!req.state) {
    return this.fail({ message: 'Unable to verify one-time code.' }, 403);
  }
  var address = req.state.address
    , transport = req.state.transport
    , channel = req.state.channel
    , secret = req.state.secret;
  if (!address || !secret) {
    return this.fail({ message: 'Invalid out-of-band authentication request state.' }, 403);
  }
  
  if (!crypto.timingSafeEqual(Buffer.from(secret, 'utf8'), Buffer.from(code, 'utf8'))) {
    return this.fail({ message: 'Incorrect one-time code.' });
  }
  
  var self = this;

  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }

  try {
    if (self._passReqToCallback) {
      var arity = self._verify.length;
      if (arity == 5) {
        this._verify(req, address, transport, channel, verified);
      } else if (arity == 4) {
        this._verify(req, address, channel, verified);
      } else { // arity == 3
        this._verify(req, address, verified);
      }
    } else {
      var arity = self._verify.length;
      if (arity == 4) {
        this._verify(address, transport, channel, verified);
      } else if (arity == 3) {
        this._verify(address, channel, verified);
      } else { // arity == 2
        this._verify(address, verified);
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
