// Chart dimensions
const margin = { top: 70, right: 40, bottom: 60, left: 175 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// SVG container
const svg = d3
  .select("#GroupedBarChart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/Tuanne2108/DataVisualizationProject/main/Global_Education.csv").then(data => {
  // Assuming your CSV file contains appropriate data columns, you can proceed to create the grouped bar chart.

  // Create a list of all unique Groupedbar_body_type values
  const groupNames = [...new Set(data.map(d => d.Groupedbar_body_type))];

  // Create color scale for the bars
  const colorScale = d3.scaleOrdinal()
    .domain(groupNames)
    .range(d3.schemeCategory10);

  // Stack the data for grouped bars
  const stackedData = d3.stack()
    .keys(groupNames)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone)(data);

  // Set x and y scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.Country)) // Change 'xAxisLabel' to the actual data column you want on the x-axis
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])]) // Adjust the domain as needed
    .nice()
    .range([height, 0]);

  // Create x and y axes
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y);

  // Add x and y axes to the chart
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  // Create groups for the bars
  const groups = svg.selectAll(".group")
    .data(stackedData)
    .enter().append("g")
    .attr("class", "group")
    .style("fill", d => colorScale(d.key));

  // Create bars within each group
  groups.selectAll("rect")
    .data(d => d)
    .enter().append("rect")
    .attr("x", d => x(d.data.xAxisLabel))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth());

  // Add legend
  const legend = svg.selectAll(".legend")
    .data(groupNames.reverse()) // Reverse to match the order of bars
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", colorScale);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(d => d);

  // Add chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Your Chart Title");

  // Add the chart data source
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .style("fill", "lightgray")
    .html("Data Source: <a href='https://raw.githubusercontent.com/Tuanne2108/DataVisualizationProject/main/Global_Education.csv' target='_blank'>https://raw.githubusercontent.com/Tuanne2108/DataVisualizationProject/main/Global_Education.csv</a>");
});
