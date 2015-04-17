/**
 * This module retrieves the API key that should be used for making
 * REST requests against the Riot API
 *
 * @author Chris Zonca
 */

var fs = require("fs");

// Use environment variable API_KEY if it exists. Otherwise read .apikey
var apiKey = process.env.API_KEY ?
    process.env.API_KEY : fs.readFileSync("./.apikey").toString();

/**
 * Gets the API key that should be used to make REST requests
 *
 * @returns {String} The API key
 */
var getApiKey = function() {
    return apiKey;
};

module.exports.getApiKey = getApiKey;