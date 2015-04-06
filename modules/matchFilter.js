// Filter out unwanted match JSON to help reduce traffic

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

    return result;
};

module.exports.filterMatch = filterMatch;