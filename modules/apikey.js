var fs = require("fs");

var apiKey = fs.readFileSync("./.apikey").toString();

var getApiKey = function() {
    return apiKey;
};

module.exports.getApiKey = getApiKey;