/**
 * This module gets manages the pool of matches that will eventually be drawn from
 *
 * @author Chris Zonca
 */
var pg = require('pg');

// The currently cached pool of match ids
var cachedMatches = [];

/**
 * Gets and caches a list of known match ids from the database.
 */
function retrieveMatches() {
    pg.connect(process.env.DATABASE_URL, function (err, client) {
        if (!err) {
            var query = client.query("SELECT * FROM match_ids", null, function(err) {
                if (err) {
                    console.log("Could not retrieve match list");
                    console.log(err);
                }
                client.end();
            });
            query.on('row', function(row) {
                cachedMatches.push(row.match_id);
            })
        } else {
            console.log("An error occurred connecting to the database. No matches available!");
            console.log(err);
        }
    });
}

retrieveMatches();

/**
 * Gets an array of match ids from URF games
 *
 * @returns {Array} The array of match ids
 */
var getMatches = function () {
    return cachedMatches;
};

module.exports.getMatches = getMatches;