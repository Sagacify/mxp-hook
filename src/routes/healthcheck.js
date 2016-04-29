var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.send({
    app: 'mxp-hook'
  });
});

module.exports = router;
