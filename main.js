// Chart dimensions 
const margin = {top: 70, right: 40, bottom: 60, left: 175};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// SVG container
const svg = d3.select("#GroupedBar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load data
d3.csv("https://gist.githubusercontent.com/Tuanne2108/f3e20d4752299d6f408e199bea274ddb/raw/467c03104263e20c0d9a0ca3565b86844aee58c7/education.csv").then(data => {
    data.forEach(d => {
        d.total = +d.total;  // Assuming 'total' is a field in your CSV
    });

    // Sort data by total
    data.sort((a, b) => d3.ascending(a.total, b.total));

    // Set x and y scales
    const x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, d => d.total)]);

    const y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1)
        .domain(data.map(d => d.group)); // Replace 'group' with the appropriate field name

    // Create axis
    const xAxis = d3.axisBottom(x).ticks(5).tickSize(0);
    const yAxis = d3.axisLeft(y).tickSize(0).tickPadding(10);

    // Add x and y axis to the chart
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .call(g => g.select(".domain").remove());

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll('path')
        .style('stroke-width', '1.75px');

    // Create bars for chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.group)) // Replace 'group' with the appropriate field name
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d => x(d.total))
        .style("fill", 'skyblue');

    // Add labels to each bar
    svg.selectAll(".label")
        .data(data)
        .enter().append("text")
        .attr("x", d => x(d.total) + 5)
        .attr("y", d => y(d.group) + y.bandwidth() / 2) // Replace 'group' with the appropriate field name
        .attr("dy", ".35em")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style('fill', '#3c3d28')
        .text(d => d.total);

    // Add chart title
    svg.append("text")
        .attr("x", (width / 2)) 
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Your Chart Title Here");

    // Add the chart data source
    svg.append("text")
        .attr("transform", "translate(" + (width - margin.right) + "," + (height + margin.bottom - 5) + ")")
        .style("text-anchor", "end")
        .style("font-size", "8px")
        .style("fill", "lightgray")
        .text("Source: [Your Data Source Here]");
});

