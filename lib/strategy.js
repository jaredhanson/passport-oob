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
function Strategy(options, verify) {
  if (typeof options == 'function') {
    verify = options;
    options = {};
  }
  if (!verify) { throw new TypeError('MFAOOBStrategy requires a verify callback'); }
  
  this._ticketField = options.ticketField || 'ticket';
  
  passport.Strategy.call(this);
  this.name = 'mfa-oob';
  this._verify = verify;
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
  
  function verified(err, ok, info) {
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
      this._verify(req, req.user, ticket, verified);
    } else {
      this._verify(req.user, ticket, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
