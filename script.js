// Row converter to preprocess data
function rowConverter(row) {
    return {
        category: row.Latitude, // Replace with your category column name
        value: +row.Longitude // Replace with your value column name and convert to number
    };
}

// Load and process CSV data
d3.csv("https://gist.githubusercontent.com/Tuanne2108/f3e20d4752299d6f408e199bea274ddb/raw/467c03104263e20c0d9a0ca3565b86844aee58c7/education", rowConverter).then(function(data) {
    // Set dimensions and margins for the graph
    const margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 800 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // Set the ranges
    const x = d3.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scaleLinear().range([height, 0]);

    // Append the svg object to the div
    const svg = d3.select("#bar-chart").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scale the range of the data in the domains
    x.domain(data.map(d => d.category));
    y.domain([0, d3.max(data, d => d.value)]);

    // Append the rectangles for the bar chart
    svg.selectAll(".bar")
       .data(data)
     .enter().append("rect")
       .attr("class", "bar")
       .attr("x", d => x(d.category))
       .attr("width", x.bandwidth())
       .attr("y", d => y(d.value))
       .attr("height", d => height - y(d.value));

    // Add the x Axis
    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x));

    // Add the y Axis
    svg.append("g")
       .call(d3.axisLeft(y));
});
