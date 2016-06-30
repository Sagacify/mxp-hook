'use strict';

var Promise = require('bluebird');
var _ = require('lodash');

var githubApi = require('../github/api');

var log = require('saga-logger')
  .create({ module: 'jira/webhook' });

var handleWebhook = function (body, params) {
  return new Promise(function (resolve, reject) {
    var changes = body.data.changelog.items;

    var statusChange = _.find(changes, { 'field': 'status' });

    if (!statusChange) {
      log.error('webhook-no-status-change', body);

      return reject('This is not a status change');
    }

    var issue = params[0].split('/')[1];

    switch (statusChange.toString) {
      case 'In Progress':
        log.debug('status-in-interest', body, {
          issue: issue,
          status: statusChange.toString
        });
        return githubApi.getMasterHeadSha()
          .then(function (result) {
            if (!result.success) {
              return reject('Sha is invalid');
            }

            return githubApi.createBranch(result.sha, issue);
          });
      default:
        log.error('invalid-action', {}, body);
        return Promise.reject(new Error('invalid-action'));
    }

    log.debug('jira-webhook', body, params);
    resolve({
      success: true
    });
  });
};

module.exports = handleWebhook;
