var SQAURE_SIZE = 10;
var CIRCLE_RADIUS = 5;

var svg, xScale, yScale;
var timeline, data, currentTime = 0;
var frameIndex = 0, eventIndex = 0;
var killPlotInterval;
var blueColor;
var purpleColor;

$(document).ready(function() {
    if ($("#timeline").val() === null) {
        $("#map").append("No map data available. " +
            "Please wait a few seconds and refresh the page");
    } else {
        $("#blueButton").click(function() {
            $("#purpleButton").addClass("greyscale").unbind();
            startMapTimer();
        });
        $("#purpleButton").click(function() {
            $("#blueButton").addClass("greyscale").unbind();
            startMapTimer();
        });
        generateMap();
    }

    blueColor = d3.rgb(0, 0, 204);
    purpleColor = d3.rgb(75, 0, 130);

    //$("#timer").knob({
    //    'min' : 0,
    //    'max' : 123
    //
    //})
});

var hasStarted = false;

function startMapTimer() {
    if (!hasStarted) {
        hasStarted = true;
        timeline = JSON.parse($("#timeline").val());
        if (timeline !== null) {
            killPlotInterval = setInterval(passTime, 100);
        }
    }
}

function passTime() {
    currentTime += 10000;

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

    console.log("Done plotting kills!");
    clearInterval(killPlotInterval);
}

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
            svg.append('svg:g').selectAll('circle')
                .data(data)
                .enter().append('rect')
                    .attr('x', function (d) { return xScale(d[0]) })
                    .attr('y', function (d) { return yScale(d[1]) })
                    .attr('fill', function () { return color; })
                    .attr('width', SQAURE_SIZE)
                    .attr('height', SQAURE_SIZE)
                    .attr('class', 'kills');
        }
    }
}