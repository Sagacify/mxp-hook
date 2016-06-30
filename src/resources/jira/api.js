'use strict';

var _ = require('lodash');
var request = require('axios');
var config = require('config');
var Promise = require('bluebird');

var log = require('saga-logger')
  .create({ module: 'jira/api' });

var status = require('./status');

var getTransitionId = function (issueId, statusName) {
  var transition = status.transitions[statusName];

  return new Promise(function (resolve, reject) {
    var options = {
      method: 'GET',
      url: 'https://' +
        config.jiraApi.endpoint +
        ':' +
        config.jiraApi.port +
        '/rest/api/latest/issue/' +
        issueId +
        '/transitions?expand=transitions.fields',
      headers: {
        Authorization: 'Basic ' + config.jiraApi.basicAuth,
        Accept: 'application/json'
      },
      json: true
    };

    return request(options).then(function (response) {
      if (response.status !== 200) {
        reject(new Error(response.statusText));
      }

      var result = _.find(response.data.transitions, { 'name': transition.jiraTag });

      if (!result) {
        log.error('get-transaction-id-failed', response, options);

        reject(new Error('That status doesn\'t exists in this context'));
      }

      log.info('post-transaction-succeed', response.data, options);

      resolve({
        success: true,
        id: result.id,
        transition: transition
      });
    }).catch(function (error) {
      log.error('get-transaction-id-failed', error, options);

      reject(new Error(error.data.errorMessages[0]));
    });
  });
};

var postTransition = function (issueId, transitionId, transition) {
  return new Promise(function (resolve, reject) {
    var options = {
      method: 'post',
      url: 'https://' +
        config.jiraApi.endpoint +
        ':' +
        config.jiraApi.port +
        '/rest/api/latest/issue/' +
        issueId +
        '/transitions?expand=transitions.fields',
      data: {
        update: {
          comment: [
            {
              add: {
                body: transition.comment
              }
            }
          ]
        },
        transition: {
          id: transitionId
        }
      },
      headers: {
        Authorization: 'Basic ' + config.jiraApi.basicAuth,
        Accept: 'application/json'
      },
      json: true
    };

    if (transition.fields) {
      transition.fields.forEach(function (field) {
        options.data.update[field] = [
          {
            set: 'true'
          }
        ];
      });
    }

    return request(options).then(function (response) {
      if (response.status !== 204) {
        reject(new Error(response.statusText));
      }

      log.info('post-transaction-succeed', response, options);
      resolve({
        success: true
      });
    }).catch(function (error) {
      log.error('post-transaction-failed', error, options);
      reject(new Error(error.data.errorMessages[0]));
    });
  });
};

var applyTransition = function (issueId, statusName) {
  return getTransitionId(issueId, statusName)
    .then(function (result) {
      return postTransition(issueId, result.id, result.transition);
    });
};

module.exports = {
  applyTransition: applyTransition
};
