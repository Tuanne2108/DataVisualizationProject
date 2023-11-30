const width = 600;
const height = 500;
const padding = 120;
const cirWidth = 500;
const cirHeight = 300;
const radius = Math.min(cirWidth, cirHeight) / 2;

var rowConverter = (d) => {
    return {
        country: d["Country/Region"],
        year: parseInt(d["Year"]),
        cases: parseInt(d["Number of confirmed cases"]),
    };
};

function barChart() {
    d3.csv(
        "https://gist.githubusercontent.com/Tuanne2108/d10d78e8e1533927347d3ce2d04c714f/raw/97638632aef8770337415ce610cc7a14ce67e2dc/covid19_confirmed.csv",
        rowConverter
    ).then((data) => {
        let filteredData = data.filter((d) => d.year === 1995);
        let dataset = Array.from(d3.groups(filteredData, (d) => d.country));
        let countries = Object.values(dataset).map((arr) => arr[0]);

        let xScale = d3
            .scaleBand()
            .domain(countries)
            .range([padding, width - padding])
            .padding(0.2);

        const maxValue = d3.max(filteredData, (d) => d.cases);

        let yScale = d3
            .scaleLinear()
            .domain([0, maxValue * 1.2])
            .range([height - padding, padding]);

        let svg = d3
            .select(".bar-chart")
            .append("svg")
            .attr("height", height)
            .attr("width", width);

        svg.selectAll("rect")
            .data(countries)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return xScale(d);
            })
            .attr("y", (d) =>
                yScale(
                    d3.sum(
                        dataset.find((entry) => entry[0] === d)[1],
                        (d) => d.cases
                    )
                )
            )
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return (
                    height -
                    padding -
                    yScale(
                        d3.sum(
                            dataset.find((entry) => entry[0] === d)[1],
                            (d) => d.cases
                        )
                    )
                );
            })
            .attr("fill", function (d) {
                return (
                    "rgb(47, " +
                    yScale(
                        d3.sum(
                            dataset.find((entry) => entry[0] === d)[1],
                            (d) => d.cases
                        )
                    ) +
                    ",120)"
                );
            });

        // Add x-axis
        let xAxis = d3.axisBottom().scale(xScale);
        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .attr("font-size", 16)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-25)")
            .attr("text-anchor", "end")
            .style("font-weight", "bold");

        // Add y-axis
        let yAxis = d3.axisLeft().scale(yScale);
        svg.append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + padding + ",0)")
            .attr("font-size", 16)
            .call(yAxis);

        svg.append("text")
            .text("Case(s)")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", padding / 2)
            .attr("fill", "black")
            .attr("font-size", 20)
            .attr("transform", "rotate(-90)");

        // Add chart title
        svg.append("text")
            .text("Confirmed Cases for Each Country in 1995")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", padding * 0.6)
            .attr("fill", "black")
            .attr("font-size", 24);
    });
}

//Create pie chart
function pieChart() {
    d3.csv(
        "https://gist.githubusercontent.com/Tuanne2108/d10d78e8e1533927347d3ce2d04c714f/raw/97638632aef8770337415ce610cc7a14ce67e2dc/covid19_confirmed.csv",
        rowConverter
    ).then((data) => {
        let yearData = data.filter((d) => d.year === 1995);

        let svg = d3
            .select(".pie-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr(
                "transform",
                "translate(" + width / 2.7 + "," + height / 2 + ")"
            );

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie().value((d) => d.cases);

        const arc = d3.arc().innerRadius(0).outerRadius(radius);

        // Create the pie chart
        const arcs = svg
            .selectAll("arc")
            .data(pie(yearData))
            .enter()
            .append("g");

        arcs.append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc);

        // Optional: Add labels
        arcs.append("text")
            .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
            .attr("text-anchor", "middle")
            .text((d) => d.data.country);

        svg.append("text")
            .text("Ratio of categories")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 100)
            .attr("y", padding * -1.5)
            .attr("fill", "black")
            .attr("font-size", 24);
    });
}
