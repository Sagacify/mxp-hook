'use strict';

var env = process.env;

module.exports = {
  appPort: env.APP_PORT,
  mxp: {
    apiKey: env.MXP_API_KEY
  },
  jiraApi: {
    endpoint: env.JIRA_API_ENDPOINT,
    port: env.JIRA_API_PORT,
    basicAuth: env.JIRA_API_BASIC_AUTH
  },
  slack: {
    webhook: env.SLACK_WEBHOOK
  },
  github: {
    api: {
      token: env.GITHUB_API_TOKEN
    }
  }
};
