'use strict';

var Promise = require('bluebird');

var log = require('saga-logger')
  .create({ module: 'jira/webhook' });

var handleWebhook = function (body, params) {
  return new Promise(function (resolve, reject) {
    log.info('jira-webhook', body, params);
    resolve({
      success: true
    });
  });
};

module.exports = handleWebhook;
