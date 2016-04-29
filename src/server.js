var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var config = require('config');

var log = require('saga-logger')
  .create({ module: 'server' });

var webhooks = require('./routes/webhooks');
var healthcheck = require('./routes/healthcheck');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', webhooks);
app.use('/healthcheck', healthcheck);

app.listen(config.appPort, function () {
  log.info('server-started', { port: config.appPort });
});
