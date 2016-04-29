'use strict';

var config = require('config');
var Promise = require('bluebird');

var log = require('saga-logger')
  .create({ module: 'auth' });

var apiKey = config.mxp.apiKey;

var validate = function (requestApiKey) {
  return new Promise(function (resolve, reject) {
    if (requestApiKey !== apiKey) {
      log.info('login-failed', requestApiKey);

      reject(new Error('invalid-auth'));
    }

    log.info('login-succeed', requestApiKey);
    resolve();
  });
};

module.exports = {
  validate: validate
};
