var champions = require("../modules/champions");
var fs = require("fs");

var championMap = null;
var championCount;

var generateChampionMap = function() {
    var champs = champions.getChampions();
    if (champs) {
        // Sort the keys so that their position in the data array is consistent
        var championIds = [];
        for (var championId in champs) {
            if (champs.hasOwnProperty(championId)) {
                championIds.push(championId);
            }
        }
        championIds.sort();

        // Add a mapping between champion ids and which position in the array they are
        championMap = {};
        championCount = championIds.length;
        for (var i = 0 ; i < championCount; i++) {
            championMap[championIds[i]] = i;
        }
        console.log("Done with champs");
    }
};
var addEntry = function(match) {
    if (!championMap) {
        generateChampionMap();
    }

    if (championMap) {
        var participants = match.participants;

        var data = [];
        data[0] = [];
        // One data point for each champion, for each team
        for (var i = 0; i < championCount * 2; i++) {
            data[0][i] = 0;
        }

        // Set 1 for each champion played
        for (i = 0; i < participants.length; i++) {
            var champIndex = championMap[participants[i].championId];
            if (participants[i].teamId === 100) {
                data[0][champIndex] = 1;
            } else {
                data[0][champIndex * 2] = 1;
            }
        }

        // Figure out the winner, did purple win?
        if (match.teams[0].teamId === 100) {
            data[1] = match.teams[0].winner ? 0 : 1;
        } else {
            data[1] = match.teams[0].winner ? 1 : 0;
        }

        //var stringToWrite = JSON.stringify(data) + ",\n";
        //fs.appendFile("data.txt", stringToWrite, function(err) {
        //    if (err) {
        //        console.log("An error occurred adding file data: " + err);
        //    }
        //});

    } else {
        console.log("Could not add entry, champions unavailable");
    }
};

module.exports.addEntry = addEntry;