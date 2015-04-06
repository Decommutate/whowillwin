$(document).ready(function() {
    var timeline = JSON.parse($("#timeline").val());

    var domain = {
        min: {x: -570, y: -420},
        max: {x: 15220, y: 14980}
    };

    var width = 512;
    var height = 512;
    var bg = "https://s3-us-west-1.amazonaws.com/riot-api/img/minimap-mh.png";

    var xScale = d3.scale.linear()
        .domain([domain.min.x, domain.max.x])
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([domain.min.y, domain.max.y])
        .range([height, 0]);

    var svg = d3.select("#map").append("svg:svg")
        .attr("width", width)
        .attr("height", height);

    svg.append('image')
        .attr('xlink:href', bg)
        .attr('x', '0')
        .attr('y', '0')
        .attr('width', width)
        .attr('height', height);

    var data = [];
    for (var i = 0; i < timeline.timeline.frames.length; i++) {
        var frame = timeline.timeline.frames[i];
        for (var j = 0; j < frame.events.length; j++) {
            var event = frame.events[j];
            if (event.eventType === "CHAMPION_KILL") {
                data.push([parseInt(event.position.x), parseInt(event.position.y)]);
            }
        }
    }

    svg.append('svg:g').selectAll("circle")
        .data(data)
        .enter().append("svg:circle")
        .attr('cx', function(d) { return xScale(d[0]) })
        .attr('cy', function(d) { return yScale(d[1]) })
        .attr('r', 5)
        .attr('class', 'kills');
});