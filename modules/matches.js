var pg = require('pg');

var cachedMatches = [];
var start = 1428892200;

var retrieveMatches = function () {
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
};

retrieveMatches();

var getMatches = function () {
    return cachedMatches;
};

module.exports.getMatches = getMatches;