/**
 * This module is responsible for retrieving a list of champions from
 * the Riot servers.
 *
 * @author Chris Zonca
 */
var https = require('https');
var querystring = require('querystring');
var apikey = require('../modules/apikey');

// A cache for the retrieved champions
var cachedChampions = null;

/**
 * Queries the static Riot API servers for champions and caches an array of them
 */
function retrieveChampions () {
    var parameters = {
        api_key: apikey.getApiKey(),
        champData: "image"
    };
    var options = {
        host: 'na.api.pvp.net',
        path: '/api/lol/static-data/na/v1.2/champion?' + querystring.stringify(parameters),
        method: 'GET'
    };

    https.request(options, function (res) {
        var fullBody = "";
        res.on("data", function (chunk) {
            fullBody += chunk;
        }).on("end", function () {
            cachedChampions = extractChampionData(JSON.parse(fullBody).data);
        });
    }).on("error", function (error) {
        console.log("An error has occurred getting the champions");
        console.log(error);
    }).end();

}

/**
 * Converts the JSON object retrieved from the Riot servers into an
 * array of champions.
 *
 * @param data {Object} The champion data to filter through
 * @returns {Array} The champion data with only the relevant data
 */
function extractChampionData (data) {
    var result = {};
    for (var champion in data) {
        if (data.hasOwnProperty(champion)) {
            result[data[champion].id]  = data[champion];
        }
    }
    return result;
}

retrieveChampions();

/**
 * Gets an array containing each available champion
 *
 * @returns {Array} An array containing each available champion
 */
var getChampions = function () {
    return cachedChampions;
};

module.exports.getChampions = getChampions;