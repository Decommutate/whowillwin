var https = require('https');
var querystring = require('querystring');
var apikey = require('../modules/apikey');

var parameters = {
    beginDate: '1428007200',
    api_key: apikey.getApiKey()
};

console.log(parameters.api_key);

var getRecentMatchesOptions = {
    host: 'na.api.pvp.net',
    path: '/api/lol/na/v4.1/game/ids?' + querystring.stringify(parameters),
    method: 'GET'
};

var cachedMatches = null;

var retrieveMatches = function() {

    https.request(getRecentMatchesOptions, function(res) {
        var fullBody = "";
        res.on("data", function(chunk) {
            fullBody += chunk;
        }).on("end", function() {
            console.log("ending: " + fullBody);
            cachedMatches = JSON.parse(fullBody);
        });
    }).on("error", function(error) {
        console.log("An error has occurred getting recent matches");
        console.log(error);
    }).end();
};

// Update our retrieved matches every 5 minutes
retrieveMatches();
setInterval(retrieveMatches, 5 * 60 * 1000);

var getRecentMatches = function() {
    return cachedMatches;
};

module.exports.getRecentMatches = getRecentMatches;