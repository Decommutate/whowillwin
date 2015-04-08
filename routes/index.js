var express = require('express');
var match = require('../modules/match');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
  var recentMatch = match.getRecentMatch();

  if (recentMatch) {
    res.render('index', {
      title: "Who will win?",
      participants: recentMatch.participants,
      timeline: JSON.stringify(recentMatch.timeline)
    });
  }
  else {
    res.render('index', { title: "No match is available, please try again"});
  }
});

module.exports = router;
