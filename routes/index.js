/**
 * The router for the index page of the web site. This
 * will cache the web page rendered for the currently
 * active match to speed up subsequent requests to the web
 * site. Once a new match is active, the cache will be
 * invalidated and a new page will be rendered.
 */

var express = require('express');
var match = require('../modules/match');
var svm = require('../modules/svm');
var router = express.Router();

// Cache the latest rendered match so that we can use it again
// for future incoming requests.
var cachedHtml;

// The latest match retrieved from the Riot servers
var cachedMatch;

// Listen for new matches so that we can invalidate the
// cache and render the web page for the new match
match.addMatchListener(function(match) {
    cachedHtml = null;
    cachedMatch = match;
});

router.get('/', function (req, res) {

    if (cachedHtml) {
        console.log("Shortcut!");
        res.send(cachedHtml);
    } else if (cachedMatch) {
        var winner;
        // Figure out the winner
        if (cachedMatch.teams[0].teamId === 100) {
            winner = cachedMatch.teams[0].winner ? "Blue" : "Purple";
        } else {
            winner = cachedMatch.teams[0].winner ? "Purple" : "Blue";
        }

        res.render('index', {
            title: "Who will win?",
            participants: cachedMatch.participants,
            timeline: JSON.stringify(cachedMatch.timeline),
            prediction: svm.predictMatch(cachedMatch),
            winner: winner
        }, function(error, html) {
            if (!error) {
                cachedHtml = html;
                res.send(html);
            } else {
                console.log("Could not render the site index");
                req.next(error);
            }
        });
    } else {
        res.render('nomatches', {title: "No match is available, please try again"});
    }
});

module.exports = router;
