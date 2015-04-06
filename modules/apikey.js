var fs = require("fs");

// Use environment variable API_KEY if it exists. Otherwise read .apikey
var apiKey = process.env.API_KEY ?
    process.env.API_KEY : fs.readFileSync("./.apikey").toString();

var getApiKey = function() {
    return apiKey;
};

module.exports.getApiKey = getApiKey;