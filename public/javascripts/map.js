var NEXUS_SIZE = 15;
var SQUARE_SIZE = 10;
var CIRCLE_RADIUS = 5;
var blueColor;
var purpleColor;

var svg, xScale, yScale;
var data, currentTime = 0;
var frameIndex = 0, eventIndex = 0;
var killPlotInterval;
var hasStarted = false;

/**
 * Initializes the map and UI of the web page
 */
$(document).ready(function() {
    if (timeline === null) {
        $("#map").append("No map data available. " +
            "Please wait a few seconds and refresh the page");
    } else {
        $("#blueButton").click(function() {
            $("#purpleButton").addClass("greyscale").unbind();
            startMapTimer();
            showPrediction();

        });
        $("#purpleButton").click(function() {
            $("#blueButton").addClass("greyscale").unbind();
            startMapTimer();
            showPrediction();
        });
        generateMap();

        blueColor = d3.rgb(0, 0, 255);
        purpleColor = d3.rgb(75, 0, 130);
    }
});

/**
 * Starts the map timer, which will cause the match to begin playing
 */
function startMapTimer() {
    if (!hasStarted) {
        hasStarted = true;
        if (timeline !== null) {

            // Keep track of this interval so we can stop it later
            killPlotInterval = setInterval(passTime, 10);
        }
    }
}

/**
 * Pass a small amount of time, updating the map with the events that
 * occurred during that time
 */
function passTime() {
    currentTime += 1000;
    $("#timer").text(timeToString(currentTime));

    for (; frameIndex < timeline.frames.length; frameIndex++) {
        var frame = timeline.frames[frameIndex];
        for (; eventIndex < frame.events.length; eventIndex++) {
            var event = frame.events[eventIndex];
            if (event.timestamp <= currentTime) {
                var point = [[parseInt(event.position.x), parseInt(event.position.y)]];

                if (event.victimTeamId === 100 || event.teamId === 100) {
                    plotKills(point, blueColor, event.eventType);
                } else {
                    plotKills(point, purpleColor, event.eventType);
                }
            } else {
                return;
            }
        }
        eventIndex = 0;
    }

    plotNexusKill();
    clearInterval(killPlotInterval);

    $("#outcome").css('visibility','visible').hide().fadeIn(1000, function() {
        var buttonColor = matchWinner === "Blue" ? "blue" : "purple";
        $("#playAgainButton").css('visibility','visible').hide()
            .addClass(buttonColor).fadeIn(1000, function() {
                $("#playAgainButton").click(function() {
                    location.reload();
                })
            });
    });
}

/**
 * Initializes the map on the center of the web page
 */
function generateMap() {

    var domain = {
        min: {x: -570, y: -420},
        max: {x: 15220, y: 14980}
    };

    var width = 512;
    var height = 512;
    var bg = "https://s3-us-west-1.amazonaws.com/riot-api/img/minimap-mh.png";

    xScale = d3.scale.linear()
        .domain([domain.min.x, domain.max.x])
        .range([0, width]);

    yScale = d3.scale.linear()
        .domain([domain.min.y, domain.max.y])
        .range([height, 0]);

    svg = d3.select("#map").append("svg:svg")
        .attr("width", width)
        .attr("height", height);

    svg.append('image')
        .attr('xlink:href', bg)
        .attr('x', '0')
        .attr('y', '0')
        .attr('width', width)
        .attr('height', height);
}

/**
 * Plots a kill on the map
 *
 * @param data {Array} A 2 element array containing the x and y
 *    position of the kill
 * @param color The color to draw the kill icon
 * @param eventType The type of kill that occurred
 */
function plotKills(data, color, eventType) {
    if (svg && xScale && yScale) {
        if (eventType === "CHAMPION_KILL") {
            svg.append('svg:g').selectAll('circle')
                .data(data)
                .enter().append('svg:circle')
                    .attr('cx', function (d) { return xScale(d[0]) })
                    .attr('cy', function (d) { return yScale(d[1]) })
                    .attr('fill', function () { return color; })
                    .attr('r', CIRCLE_RADIUS)
                    .attr('class', 'kills');
        } else {
            svg.append('svg:g').selectAll('rect')
                .data(data)
                .enter().append('rect')
                    .attr('x', function (d) { return xScale(d[0]) })
                    .attr('y', function (d) { return yScale(d[1]) })
                    .attr('fill', function () { return color; })
                    .attr('width', SQUARE_SIZE)
                    .attr('height', SQUARE_SIZE)
                    .attr('class', 'kills');
        }
    }
}

/**
 * Plots the nexus that was destroyed during this match
 */
function plotNexusKill() {
    var nexusPosition;
    var color;

    if (matchWinner === "Blue") {
        nexusPosition = [[12980, 13590]];
        color = purpleColor;
    } else {
        nexusPosition = [[1500, 1735]];
        color = blueColor;
    }

    svg.append('svg:g').selectAll('rect')
        .data(nexusPosition)
        .enter().append('rect')
        .attr('x', function (d) { return xScale(d[0]) })
        .attr('y', function (d) { return yScale(d[1]) })
        .attr('fill', function () { return color; })
        .attr('width', NEXUS_SIZE)
        .attr('height', NEXUS_SIZE)
        .attr('class', 'kills');
}

/**
 * Displays the prediction provided by the server
 */
function showPrediction() {
    if (prediction === "Blue") {
        $("#bluePrediction").fadeIn("500");
    } else {
        $("#purplePrediction").fadeIn("500");
    }
}

/**
 * Formats the clock on the top of the map
 *
 * @param time {number} The number of milliseconds since the match began
 * @returns {string} A string representation of the provided time
 */
function timeToString(time) {
    var date = new Date(time);
    return formatNumber(date.getMinutes()) + ":" + formatNumber(date.getSeconds());
}

/**
 * Pads the provided 1 or 2 digit number with zeroes, if necessary,
 * to be two characters long
 *
 * @param number {number} The number to format
 * @returns {string} The formatted number
 */
function formatNumber(number) {
    if (number < 10) {
        return "0" + number;
    }
    return number.toString();
}