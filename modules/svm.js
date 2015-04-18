/**
 * This class focuses on the Support Vector Machine (SVM) that will be used
 * to generate predictions. It will both load up the SVM model and
 * make predictions.
 *
 * @author Chris Zonca
 */

var champions = require("../modules/champions");
var svm = require("node-svm");
var fs = require("fs");

// A cached array of champions used to help convert a match
// into a format suitable for the SVM
var championMap = null;

// The number of champions in the champion map
var championCount;

// The predictor used to guess match outcomes
var predictor;

/**
 * Generates a map of champions that will be used to help convert
 * match data into a format that can be ingested by the SVM
 */
function generateChampionMap() {
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
    }
}

/**
 * Converts the provided match into the format the SVM will process. The format consists
 * of an array 2 * (number of champions) large, with the first half representing the
 * blue team and the second half representing the purple team. Each champion is assigned
 * an index on the array, and a 1 is set if that champion appears on the respective team.
 *
 * @param match The match to process
 * @returns {Array} A numerical array that can be fed into the SVM
 */
function convertToSvmInput(match) {
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
}

/**
 * Loads the predictor from the model JSON file
 */
function createPredictor() {
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
}

/**
 * Predicts the outcome of the provided match
 *
 * @param match The match to predict
 * @returns {string} "Blue" if blue won the match, or "Purple"
 * if purple won the match
 */
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

/**
 * Appends the provided match to a local text file. This text file
 * can be used to train a new SVM. This function is currently unused
 * in the code base now that training of the SVM is finished.
 *
 * @param match The match to add to the training set
 */
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
