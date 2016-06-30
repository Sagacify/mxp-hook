'use strict';

var _ = require('lodash');
var request = require('axios');
var config = require('config');
var Promise = require('bluebird');

var log = require('saga-logger')
  .create({ module: 'github/api' });

var getMasterHeadSha = function () {
  return new Promise(function (resolve, reject) {
    var options = {
      method: 'GET',
      url: 'https://api.github.com/repos/Sagacify/mxp-app/git/refs/heads',
      headers: {
        Authorization: 'token ' + config.github.api.token,
        Accept: 'application/json'
      },
      json: true
    };

    request(options).then(function (response) {
      if (response.status !== 200) {
        reject(response.statusText);
      }

      var result = _.find(response.data, { 'ref': 'refs/heads/master' });

      if (!result) {
        log.error('get-master-head-sha-failed', response);

        return reject('That repo doesn\'t have a master branch');
      }

      log.info('get-master-head-sha', response.data);

      resolve({
        success: true,
        sha: result.object.sha
      });
    }).catch(function (error) {
      log.error('get-master-head-sha-failed', error);

      reject(error.status + ' : ' + error.statusText);
    });
  });
};

var createBranch = function (sha, issueKey) {
  return new Promise(function (resolve, reject) {
    var options = {
      method: 'POST',
      url: 'https://api.github.com/repos/Sagacify/mxp-app/git/refs',
      data: {
        ref: 'refs/heads/' + issueKey,
        sha: sha
      },
      headers: {
        Authorization: 'token ' + config.github.api.token,
        Accept: 'application/json'
      },
      json: true
    };

    request(options).then(function (response) {
      if (response.status !== 201) {
        reject(response.statusText);
      }

      log.info('create-branch', response.data, { sha: sha, issueKey: issueKey });

      resolve({
        success: true
      });
    }).catch(function (error) {
      log.info('create-branch-failed', error, { sha: sha, issueKey: issueKey });

      resolve({
        success: false
      });
    });
  });
};

module.exports = {
  getMasterHeadSha: getMasterHeadSha,
  createBranch: createBranch
};
