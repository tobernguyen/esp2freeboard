var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'ESP To Freeboard', message: 'Create new device now to control it with freeboard for free!'});
});

module.exports = router;
