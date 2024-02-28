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
function Strategy(options, verify, transmit) {
  if (typeof options == 'function') {
    transmit = verify;
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
  var code = (req.body && req.body[this._codeField]) || (req.query && req.query[this._codeField])
    , address, transport;
  
  //if (!address || !code) {
  //  return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  //}
  
  var self = this;
  
  
  if (code) {
    address = req.state.address;
    transport = req.state.transport;
  
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
  } else {
    address = (req.body && req.body[this._addressField]) || (req.query && req.query[this._addressField])
    transport = (req.body && req.body[this._transportField]) || (req.query && req.query[this._transportField])
    
    function transmitted(err, ctx) {
      if (err) { return self.error(err); }
  
      var state = ctx || {};
      state.address = state.address || address;
      state.transport = state.transport || transport;
      req.pushState(state, self._verifyURL, function(err, h) {
        if (err) { return cb(err); }
        
        var url = uri.parse(self._verifyURL, true);
        merge(url.query, { state: h });
        delete url.search;
        var location = uri.format(url);
        self.redirect(location);
      });
    }
    
    if (self._passReqToCallback) {
      var arity = self._transmit.length;
      if (arity == 4) {
        this._transmit(req, address, transport, transmitted);
      } else { // arity == 3
        this._transmit(req, address, transmitted);
      }
    } else {
      var arity = self._transmit.length;
      if (arity == 3) {
        this._transmit(address, transport, transmitted);
      } else { // arity == 2
        this._transmit(address, transmitted);
      }
    }
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
