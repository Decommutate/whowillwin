var champions = require("../modules/champions");
var svm = require("node-svm");
var fs = require("fs");

var championMap = null;
var championCount;
var predictor;

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

var convertToSvmInput = function(match) {
    var data = [];
    var participants = match.participants;

    // One data point for each champion, for each team
    for (var i = 0; i < championCount * 2; i++) {
        data[i] = 0;
    }

    // Set 1 for each champion played
    for (i = 0; i < participants.length; i++) {
        var champIndex = championMap[participants[i].championId];
        if (participants[i].teamId === 100) {
            data[champIndex] = 1;
        } else {
            data[champIndex + championCount] = 1;
        }
    }

    return data;
};

var createPredictor = function() {
    fs.readFile('model.json', function(err, data) {
        if (data) {
            try {
                var model = JSON.parse(data);
                predictor = svm.restore(model);
            } catch(ex) {
                console.log("Failed to parse model json: " + ex);
            }
        } else {
            console.log("Could not read predictor model file. Predictor will be unavailable.");
            console.log(err);
        }
    });
};

var predictMatch = function(match) {

    if (!championMap) {
        generateChampionMap();
    }

    if (championMap) {
        var data = convertToSvmInput(match);
        return predictor.predictSync(data) === 1 ? "Purple" : "Blue";
    } else {
        console.log("Could not return map, champions unavailable");
    }

    return null;
};

var addEntry = function(match) {
    if (!championMap) {
        generateChampionMap();
    }

    if (championMap) {

        var data = [];
        data[0] = convertToSvmInput(match);

        // Figure out the winner, did purple win?
        if (match.teams[0].teamId === 100) {
            data[1] = match.teams[0].winner ? 0 : 1;
        } else {
            data[1] = match.teams[0].winner ? 1 : 0;
        }

        var stringToWrite = JSON.stringify(data) + ",\n";
        fs.appendFile("data.txt", stringToWrite, function(err) {
            if (err) {
                console.log("An error occurred adding file data: " + err);
            }
        });

    } else {
        console.log("Could not add entry, champions unavailable");
    }
};

createPredictor();

module.exports.addEntry = addEntry;
module.exports.predictMatch = predictMatch;