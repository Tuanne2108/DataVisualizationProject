var svg = d3.select("svg"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

// Replace ".csv" with the actual path to your CSV data file
d3.csv("https://raw.githubusercontent.com/Tuanne2108/DataVisualizationProject/main/Global_Education.csv", function (d, i, columns) {
    for (var i = 1, n = columns.length; i < n; ++i)
        d[columns[i]] = +d[columns[i]];
    return d;
}, function (error, data) {
    if (error) throw error;

    var keys = data.columns.slice(1);
    x0.domain(data.map(function (d) { return d.Gender; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function (d) { return d3.max(keys, function (key) { return d[key]; }); })]).nice();

    // ... Rest of the code for creating the grouped bar chart

});