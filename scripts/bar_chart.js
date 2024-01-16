const width = 1200;
const height = 1280;
const padding = 100;

var rowConverter = function (d) {
  return {
    area: d["Countries and areas"],
    PrimaryMale: parseFloat(d["OOSR_Primary_Age_Male"]),
    PrimaryFemale: parseFloat(d["OOSR_Primary_Age_Female"]),
    UpperSecondaryMale: parseFloat(d["OOSR_Upper_Secondary_Age_Male"]),
    UpperSecondaryFemale: parseFloat(d["OOSR_Upper_Secondary_Age_Female"]),
    // RatePrimaryMale: parseFloat(d["Completion_Rate_Primary_Male"]),
    // RatePrimaryFemale: parseFloat(d["Completion_Rate_Primary_Female"]),
    // RateUpperSecondaryMale: parseFloat(d["Completion_Rate_Upper_Secondary_Male"]),
    // RateUpperSecondaryFemale: parseFloat(d["Completion_Rate_Upper_Secondary_Female"])
  };
};

function Barchart(dataset) {
  d3.select(".Barchart").selectAll("*").remove();

  var svg1 = d3
      .select(".Barchart")
      .append("svg")
      .attr("height", height)
      .attr("width", width);
  
  d3.csv("https://gist.githubusercontent.com/Tuanne2108/f3e20d4752299d6f408e199bea274ddb/raw/467c03104263e20c0d9a0ca3565b86844aee58c7/education", rowConverter)
    .then(function(data) {
    // Barchart('primary');
    // Barchart('upperSecondary');
    // Filter data
    // var currentData = data.filter(d => d.PrimaryMale > 20 && d.PrimaryFemale > 20)
    
    var currentData = dataset === 'primary' ? 
    data.filter(d => d.PrimaryMale > 30 && d.PrimaryFemale > 30) : 
    data.filter(d => d.UpperSecondaryMale > 65 && d.UpperSecondaryFemale > 65);
    
    d3.select("#datasetSelect").on("change", function() {
      var selectedDataset = d3.select(this).property("value");
      Barchart(selectedDataset);
    });

    var xScale = d3
      .scaleLinear()
      .domain([0, d3.max(currentData, (d) => d.PrimaryMale && d.PrimaryFemale && d.UpperSecondaryMale && d.UpperSecondaryFemale)])
      .range([padding, width - padding])
        

    var yScale = d3
      .scaleBand()
      .domain(currentData.map((d) => d.area))
      .range([padding, height - padding])
      .paddingInner(0.2);

    var subgroupScale = d3.scaleBand()
      .domain(['PrimaryMale', 'PrimaryFemale'])
      .range([0, yScale.bandwidth()])
      .padding([0.2]);

    svg1
      .selectAll(".bar-primary-male")
      .data(currentData)
      .enter().append("rect")
      .attr("class", "bar-primary-male")
      .attr("x", d => padding *2  )
      .attr("y", d => padding/1000  + subgroupScale('PrimaryMale')+ yScale(d.area))
      .attr("width", 0)
      .attr("height", subgroupScale.bandwidth())
      .attr("fill", "#00c7ff")
      .transition()
      .duration(500) 
      .attr("width", d => height - padding - xScale(d.PrimaryMale)); 


    svg1
      .selectAll(".bar-primary-female")
      .data(currentData)
      .enter().append("rect")
      .attr("class", "bar-primary-female")
      .attr("x", d => padding *2  )
      .attr("y", d => padding /1000 + subgroupScale('PrimaryFemale')+ yScale(d.area))
      .attr("width", 0)
      .attr("height", subgroupScale.bandwidth())
      .attr("fill", "pink")
      .transition()
      .duration(500)
      .attr("width", d => height - padding - xScale(d.PrimaryFemale));


    svg1
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(" + padding + "," + (height - padding) + ")")
      .call(d3.axisBottom(xScale));

    // Select text labels of the x-axis and increase font size
    svg1
      .selectAll(".xAxis text")  
      .attr("font-size", "17px");

    svg1
      .append("text")
      .text("%")
      .attr("class", "xAxis-label")
      .attr("text-anchor", "middle")
      .attr("x", width /1.01)
      .attr("y", height - padding *0.8)
      .attr("font-size", 17);

    // Add Countries and areas label
    svg1
      .selectAll("text.area")
      .data(currentData)
      .enter()
      .append("text")
      .text(function (d) {
        return d.area;
    })
      .attr("class", "area")
      .attr("text-anchor", "end")
      .attr("x", padding *1.6)
      .attr("y", function (d) {
        return yScale(d.area) + yScale.bandwidth() / 2 + 4; // Adjust for vertical centering
    })
      .attr("font-size", "20px")
      .attr("fill", "black");

    // Define legend data
    var legendData = [
      {label: "Male", color: "#00c7ff"},
      {label: "Female", color: "pink"}
    ];

    // Create legend group
    var legend = svg1.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (padding *11) + ", 0)");

    // Add legend rectangles
    legend.selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("x", -15)
      .attr("y", function(d, i) { return i * 40; })
      .attr("width", 30)
      .attr("height", 30)
      .style("fill", function(d) { return d.color; });

    // Add legend text
    legend.selectAll("text")
      .data(legendData)
      .enter()
      .append("text")
      .attr("x", 30)
      .attr("y", function(d, i) { return (i * 40) + 1; })
      .attr("dy", "20px")
      .text(function(d) { return d.label; })
      .attr("font-size", "17px")
      .attr("fill", "black");
  })
}
// Barchart('upperSecondary');