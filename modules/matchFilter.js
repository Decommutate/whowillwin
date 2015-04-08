// Filter out unwanted match JSON to help reduce network traffic
var champions = require('../modules/champions');

var IMAGE_BASE_URL = "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/";

var filterFrame = function(frame) {
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
                result.events.push(kill);
            }
        }
    }
    return result;
};

var filterParticipant = function(participant) {
    var result = {};

    result.teamId = participant.teamId;
    result.championId = participant.championId;

    var champion = champions.getChampions()[participant.championId];
    result.championName = champion.name;
    result.championImage = IMAGE_BASE_URL + champion.image.full;

    return result;
};

var filterTeam = function(team) {
    var result = {};
    result.winner = team.winner;
    result.teamId = team.teamId;
    return result;
};

var filterMatch = function(match) {
    var result = {};

    result.timeline = {};
    result.timeline.frameInterval = match.timeline.frameInterval;

    var myFrames = [];
    var matchFrames = match.timeline.frames;
    for (var i = 0; i < matchFrames.length; i++) {
        myFrames[i] = filterFrame(matchFrames[i]);
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

module.exports.filterMatch = filterMatch;