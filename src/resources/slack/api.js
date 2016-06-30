'use strict';

var request = require('axios');
var config = require('config');
var Promise = require('bluebird');

var status = require('./status');

var slackWebhook = config.slack.webhook;

var postMessage = function (messageId) {
  var message = status.messages[messageId].message;
  return new Promise(function (resolve, reject) {
    var options = {
      method: 'POST',
      url: slackWebhook,
      data: {
        text: message
      }
    };

    request(options).then(function (response) {
      if (response.status !== 200) {
        reject(new Error(response.statusText));
      }

      resolve(response.status + ' : ' + response.statusText);
    }).catch(function (error) {
      reject(new Error(error.status + ' : ' + error.statusText));
    });
  });
};

module.exports = {
  postMessage: postMessage
};
