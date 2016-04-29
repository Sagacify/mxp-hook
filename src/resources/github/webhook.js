'use strict';

var Promise = require('bluebird');

var jiraApi = require('../jira/api');
var slackApi = require('../slack/api');

var log = require('saga-logger')
  .create({ module: 'github/webhook' });

var handleWebhook = function (body) {
  if (!body.pull_request) {
    log.error('invalid-content', body, {});
    return Promise.reject(new Error('invalid-content'));
  }

  var branchName = body.pull_request.head.label.replace('Sagacify:', '');
  var action = body.action;

  switch (action) {
    case 'opened':
      log.info('pull-request-opened', body, { branchName: branchName });
      return Promise.join(
        jiraApi.applyTransition(branchName, 'CODE_REVIEW'),
        slackApi.postMessage('CODE_REVIEW')
      );
    case 'closed':
      log.info('pull-request-closed', body, { branchName: branchName });
      return jiraApi.applyTransition(branchName, 'CODE_REVIEW_OK');
    default:
      log.error('invalid-action', body, {});
      return Promise.reject(new Error('invalid-action'));
  }
};

module.exports = handleWebhook;
