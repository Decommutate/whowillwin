var express = require('express');
var match = require('../modules/match');
var svm = require('../modules/svm');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res) {
    var recentMatch = match.getMatch();

    if (recentMatch) {
        var winner;
        // Figure out the winner
        if (recentMatch.teams[0].teamId === 100) {
            winner = recentMatch.teams[0].winner ? "Blue" : "Purple";
        } else {
            winner = recentMatch.teams[0].winner ? "Purple" : "Blue";
        }

        res.render('index', {
            title: "Who will win?",
            participants: recentMatch.participants,
            timeline: JSON.stringify(recentMatch.timeline),
            prediction: svm.predictMatch(recentMatch),
            winner: winner
        });
    }
    else {
        res.render('index', {title: "No match is available, please try again"});
    }
});

module.exports = router;
