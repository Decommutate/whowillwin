var https = require('https');
var querystring = require('querystring');
var apikey = require('../modules/apikey');
var matches = require('../modules/matches');
var matchFilter = require('../modules/matchFilter');

var cachedMatch = null;

var refreshMatch = function() {
    var matchArray = matches.getMatches();

    //console.log("Getting new match");
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
                try {
                    cachedMatch = matchFilter.filterMatch(JSON.parse(fullBody));
                }
                catch(ex) {
                    console.log("Could not parse JSON: " + fullBody);
                    console.log(ex);
                }
            });
        }).on("error", function(error) {
            console.log("An error has occurred getting a recent match");
            console.log(error);
        }).end();

        console.log("Now serving match id: " + matchId);
    } else {
        //console.log("Could not get new match: no matches available");
    }
};

setInterval(refreshMatch, 10000);

var getMatch = function() {
    return cachedMatch;
};

module.exports.getMatch = getMatch;