var https = require('https');
var querystring = require('querystring');
var apikey = require('../modules/apikey');

var cachedChampions = null;

var extractChampionData = function (data) {
    var result = {};
    for (var champion in data) {
        if (data.hasOwnProperty(champion)) {
            result[data[champion].id]  = data[champion];
        }
    }
    return result;
};

var refreshChampions = function () {
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

};

refreshChampions();

var getChampions = function () {
    return cachedChampions;
};

module.exports.getChampions = getChampions;