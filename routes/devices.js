'use strict';

var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');

/* GET users listing. */
router.get('/create', function(req, res, next) {
  let newDeviceId = uuid.v4();
  res.render('devices/create', {uuid: newDeviceId});
});

module.exports = router;
