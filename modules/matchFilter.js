/**
 * This module filters out unwanted match JSON information amd brings it
 * more into a format that the client can render easily.
 *
 * @author Chris Zonca
 */
var champions = require('../modules/champions');

// The base URL for retrieving champion icons
var IMAGE_BASE_URL = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/";

/**
 * Filters out JSON for a particular Match retrieved from Riot's API.
 *
 * @param match {Object} The Match to filter
 * @returns {Object} The filtered Match
 */
var filterMatch = function(match) {
    var result = {};

    result.timeline = {};
    result.timeline.frameInterval = match.timeline.frameInterval;

    var myFrames = [];
    var matchFrames = match.timeline.frames;
    for (var i = 0; i < matchFrames.length; i++) {
        myFrames[i] = filterFrame(matchFrames[i], match.participants);
    }
    result.timeline.frames = myFrames;

    result.participants = [];
    for (i = 0; i < match.participants.length; i++) {
        result.participants.push(filterParticipant(match.participants[i]));
    }

    result.teams = [];
    for (i = 0; i < match.teams.length; i++) {
        result.teams.push(filterTeam(match.teams[i]));
    }

    return result;
};

/**
 * Filters out JSON for a particular Team retrieved from Riot's API.
 *
 * @param team {Object} The Team to filter
 * @returns {Object} The filtered Team
 */
function filterTeam(team) {
    var result = {};
    result.winner = team.winner;
    result.teamId = team.teamId;
    return result;
}

/**
 * Filters out JSON for a particular Participant retrieved from Riot's API.
 *
 * @param participant {Object} The Participant to filter
 * @returns {Object} The filtered Participant
 */
function filterParticipant(participant) {
    var result = {};

    result.teamId = participant.teamId;
    result.championId = participant.championId;
    result.tierImage = getImageForTier(participant.highestAchievedSeasonTier);
    result.tierName = formatTier(participant.highestAchievedSeasonTier);

    var champion = champions.getChampions()[participant.championId];
    result.championName = champion.name;

    // The bard champion icon appears to be missing from Riot's static data
    // endpoint. Until it's fixed, this will use a local image of Bard instead
    if (champion.image.full.match(/bard/i)) {
        result.championImage = "../images/bard.png";
    } else {
        result.championImage = IMAGE_BASE_URL + champion.image.full;
    }

    return result;
}


/**
 * Filters out JSON for a particular Frame retrieved from Riot's API.
 *
 * @param frame {Object} The Frame to filter
 * @param participants {Object} The list of participants in the match
 * @returns {Object} The filtered Frame
 */
function filterFrame(frame, participants) {
    var result = {};
    result.timestamp = frame.timestamp;
    result.events = [];
    if (frame.events) {
        for (var i = 0; i < frame.events.length; i++) {
            var event = frame.events[i];
            if (event.eventType === "CHAMPION_KILL") {
                var kill = {};
                kill.position = event.position;
                kill.eventType = event.eventType;
                kill.timestamp = event.timestamp;
                kill.victimId = event.victimId;
                kill.victimTeamId = participants[kill.victimId - 1].teamId;
                result.events.push(kill);
            } else if (event.eventType === "BUILDING_KILL") {
                kill = {};
                kill.position = event.position;
                kill.timestamp = event.timestamp;
                kill.teamId = event.teamId;
                result.events.push(kill);
            }
        }
    }
    return result;
}

/**
 * Formats the ranked tier string retrieved from the API into a format
 * the a UI may want to display
 *
 * @param tier {string} The tier to format
 * @returns {string}
 */
function formatTier(tier) {
    return tier.charAt(0) + tier.slice(1).toLowerCase();
}

/**
 * Gets the relative image url for the image for the provided
 * ranked tier.
 *
 * @param tier {string} The ranked tier to display
 * @returns {string} The relative url
 */
function getImageForTier(tier) {
    return tier.toLowerCase() + ".png";
}

module.exports.filterMatch = filterMatch;