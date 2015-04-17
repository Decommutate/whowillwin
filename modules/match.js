/**
 * This module focuses on getting fully information about an individual
 * match from the Riot servers
 *
 * @author Chris Zonca
 */
var https = require('https');
var querystring = require('querystring');
var apikey = require('../modules/apikey');
var matches = require('../modules/matches');
var matchFilter = require('../modules/matchFilter');

var callbacks = [];

/**
 * Gets a random match from the list of known matches and caches
 * information about it from the Riot servers
 */
function refreshMatch() {
    var matchArray = matches.getMatches();

    if (matchArray && matchArray.length > 0) {

        var matchId = matchArray[Math.floor(Math.random() * matchArray.length)];

        var parameters = {
            api_key: apikey.getApiKey(),
            includeTimeline: "true"
        };
        var options = {
            host: 'na.api.pvp.net',
            path: '/api/lol/na/v2.2/match/' + matchId + '?' + querystring.stringify(parameters),
            method: 'GET'
        };

        https.request(options, function(res) {
            var fullBody = "";
            res.on("data", function(chunk) {
                fullBody += chunk;
            }).on("end", function() {

                var match;
                try {
                    match = matchFilter.filterMatch(JSON.parse(fullBody));
                }
                catch(ex) {
                    console.log("Could not parse JSON: " + fullBody);
                    console.log(ex);
                }

                for (var i in callbacks) {
                    callbacks[i](match);
                }
            });
        }).on("error", function(error) {
            console.log("An error has occurred getting a recent match");
            console.log(error);
        }).end();

        console.log("Now serving match id: " + matchId);
    } else {
        console.log("Could not get new match: no matches available");
    }
}

// Get a new match every 10 seconds to keep things fresh
setInterval(refreshMatch, 10000);

/**
 * Adds a function that will be called when a new
 * match is retrieved. The function will be passed
 * a JSON object containing match information
 *
 * @returns {function} The callback to add
 */
var addMatchListener = function (callback) {
    callbacks.push(callback);
};

module.exports.addMatchListener = addMatchListener;