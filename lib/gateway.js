function Gateway() {
  this._channels = {};
}

Gateway.prototype.use = function(type, channel) {
  this._channels[type] = channel;
};

Gateway.prototype.associate = function(type, user, options, cb) {
  var channel = this._channels[type];
  if (!channel) { return cb(new Error('OOB channel "' + type + '" is not supported')); }
  
  var arity = channel.associate.length;
  switch (arity) {
  case 3:
    return channel.associate(user, options, cb);
  default:
    return channel.associate(user, cb);
  }
};

Gateway.prototype.challenge = function(authnr, cb) {
  var channel = this._channels[authnr.channel];
  if (!channel) { return cb(new Error('OOB channel "' + authnr.channel + '" is not supported')); }
  
  channel.challenge(authnr, cb);
};

Gateway.prototype.verify = function(authnr, ticket, options, cb) {
  if (typeof options == 'function') {
    cb = options;
    options = undefined;
  }
  options = options || {};
  
  var channel = this._channels[authnr.channel];
  if (!channel) { return cb(new Error('OOB channel "' + authnr.channel + '" is not supported')); }
  
  var arity = channel.verify.length;
  switch (arity) {
  case 4:
    return channel.verify(authnr, ticket, options, cb);
  default:
    return channel.verify(authnr, ticket, cb);
  }
};


module.exports = Gateway;
