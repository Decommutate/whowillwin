var svg, xScale, yScale;
var timeline, data, currentTime = 0;
var frameIndex = 0, eventIndex = 0;
var killPlotInterval;

$(document).ready(function() {
    if ($("#timeline").val() === null) {
        $("#map").append("No map data available. Please wait a few seconds and refresh the page");
    } else {
        $("#startButton").click(startMapTimer);
        generateMap();
    }
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
    var dataToPlot = [];
    currentTime += 10000;

    for (; frameIndex < timeline.frames.length; frameIndex++) {
        var frame = timeline.frames[frameIndex];
        for (; eventIndex < frame.events.length; eventIndex++) {
            var event = frame.events[eventIndex];
            if (event.timestamp <= currentTime) {
                dataToPlot.push([parseInt(event.position.x), parseInt(event.position.y)]);
            } else {
                plotKills(dataToPlot);
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

function plotKills(data) {
    if (svg && xScale && yScale) {
        svg.append('svg:g').selectAll("circle")
            .data(data)
            .enter().append("svg:circle")
            .attr('cx', function(d) { return xScale(d[0]) })
            .attr('cy', function(d) { return yScale(d[1]) })
            .attr('r', 5)
            .attr('class', 'kills');
    }
}