var express = require('express');
var matches = require('../modules/matches');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: matches.getRecentMatches() });
});

module.exports = router;
