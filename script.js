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

function barChart(selectedYear) {
    d3.csv(
        "https://gist.githubusercontent.com/Tuanne2108/22533aee962f55b7e2528547c0928d73/raw/4738816f752ce830a097fc2354d84e7df6f22966/gistfile1.txt",
        rowConverter
    ).then((data) => {
        let filteredData = data.filter((d) => d.year === selectedYear);
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

        let svg = d3.select(".bar-chart svg");
        if (svg.empty()) {
            svg = d3
                .select(".bar-chart")
                .append("svg")
                .attr("height", height)
                .attr("width", width);
        }

        // Update rectangles
        let rects = svg.selectAll("rect").data(countries);
        
        // Remove rectangles that are no longer needed
        rects.exit().remove(); 

        rects
            .enter()
            .append("rect")
            .attr("width", xScale.bandwidth())
            .attr(
                "fill",
                (d) =>
                    "rgb(47, " +
                    yScale(
                        d3.sum(
                            dataset.find((entry) => entry[0] === d)[1],
                            (d) => d.cases
                        )
                    ) +
                    ",120)"
            )
            .merge(rects)
            .transition()
            .duration(500)
            .attr("x", (d) => xScale(d))
            .attr("y", (d) =>
                yScale(
                    d3.sum(
                        dataset.find((entry) => entry[0] === d)[1],
                        (d) => d.cases
                    )
                )
            )
            .attr(
                "height",
                (d) =>
                    height -
                    padding -
                    yScale(
                        d3.sum(
                            dataset.find((entry) => entry[0] === d)[1],
                            (d) => d.cases
                        )
                    )
            );

        // Update x-axis
        let xAxis = svg.select(".xAxis");
        if (xAxis.empty()) {
            xAxis = svg
                .append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(0," + (height - padding) + ")");
        }
        xAxis
            .transition()
            .duration(500)
            .call(d3.axisBottom().scale(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-25)")
            .attr("text-anchor", "end")
            .style("font-weight", "bold");

        // Update y-axis
        let yAxis = svg.select(".yAxis");
        if (yAxis.empty()) {
            yAxis = svg
                .append("g")
                .attr("class", "yAxis")
                .attr("transform", "translate(" + padding + ",0)");
        }
        yAxis.transition().duration(500).call(d3.axisLeft().scale(yScale));

        // Update chart title
        let chartTitle = svg.select(".axis-label");
        if (chartTitle.empty()) {
            chartTitle = svg
                .append("text")
                .attr("class", "axis-label")
                .attr("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", padding * 0.6)
                .attr("fill", "black")
                .attr("font-size", 24);
        }
        chartTitle.text("Confirmed Cases for Each Country in " + selectedYear);
        const totalCases = d3.sum(
            dataset.flatMap((entry) => entry[1]),
            (d) => d.cases
        );
        const formatNumber = d3.format(",")(totalCases);
        document.querySelector(".amount-cases").textContent = formatNumber;
    });
    pieChart(selectedYear);
}

function pieChart(selectedYear) {
    d3.csv(
        "https://gist.githubusercontent.com/Tuanne2108/d10d78e8e1533927347d3ce2d04c714f/raw/97638632aef8770337415ce610cc7a14ce67e2dc/covid19_confirmed.csv",
        rowConverter
    ).then((data) => {
        let yearData = data.filter((d) => d.year === selectedYear);

        // Select existing SVG element if it exists, otherwise create a new one
        let svg = d3.select(".pie-chart svg");
        if (svg.empty()) {
            svg = d3
                .select(".pie-chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr(
                    "transform",
                    "translate(" + width / 2 + "," + height / 2 + ")"
                );
        } else {
            // Clear existing content when updating
            svg.selectAll("*").remove();
            svg = svg
                .append("g")
                .attr(
                    "transform",
                    "translate(" + width / 2.65 + "," + height / 2 + ")"
                );
        }

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

        arcs.append("text")
            .attr("transform", (d) => "translate(" + arc.centroid(d) + ")")
            .attr("text-anchor", "middle")
            .text((d) => d.data.country);

        svg.append("text")
            .text("Ratio of categories")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", -height / 4 - padding / 2)
            .attr("fill", "black")
            .attr("font-size", 24);
    });
}

// Handle data
document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("year");

    // Fetch data and update slider when the page loads
    d3.csv(
        "https://gist.githubusercontent.com/Tuanne2108/d10d78e8e1533927347d3ce2d04c714f/raw/97638632aef8770337415ce610cc7a14ce67e2dc/covid19_confirmed.csv",
        rowConverter
    ).then((data) => {
        const uniqueYears = [...new Set(data.map((d) => d.year))];
        const yearNumber = document.querySelector(".year-number");

        // Set slider attributes
        slider.min = uniqueYears[0];
        slider.max = uniqueYears[uniqueYears.length - 1];
        slider.value = uniqueYears[0];
        yearNumber.textContent = uniqueYears[0];

        // Call the barChart function with the selected year
        barChart(uniqueYears[0]);


        slider.addEventListener("input", function () {
            // Get the current value of the slider
            const sliderValue = +this.value;

            // Call the barChart function with the selected year
            barChart(sliderValue);

            // Update the content of the element with class 'year-number'
            yearNumber.textContent = sliderValue;
        });
    });
});
