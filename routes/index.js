var express = require('express');
var match = require('../modules/match');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: "Who will win?", timeline: match.getRecentMatch() });
});

module.exports = router;
