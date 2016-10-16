var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');

/* GET users listing. */
router.get('/create', function(req, res, next) {
  res.render('devices/create', {uuid: uuid.v4()});
});

module.exports = router;
