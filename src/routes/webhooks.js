var express = require('express');
var router = express.Router();

var auth = require('../components/auth');

router.use(function (req, res, next) {
  var service = req.params[0];

  if (!service) {
    return next();
  }

  return auth.validate(req.query.api_key)
    .then(function () {
      next();
      return null;
    }).catch(function (error) {
      res.status(403).send(error.message);
    });
});

router.post('/*', function (req, res) {
  var service = req.params[0].split('/')[0];
  var method = require('../resources/' + service + '/webhook');
  return method(req.body, req.params)
    .then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.status(500).send(error.message);
    });
});

module.exports = router;
