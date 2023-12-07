const height = 700;
const width = 900;
const padding = 50;

var rowConverter = (d) => {
    return {
        area: d["Countries and areas"],
        lat: parseFloat(d["Latitude "]),
        long: parseFloat(d.Longitude),
        math_proficency_grade_2_3: parseFloat(d.Grade_2_3_Proficiency_Math),
        reading_proficency_grade_2_3: parseFloat(
            d.Grade_2_3_Proficiency_Reading
        ),
        math_proficency_primary_end: parseFloat(d.Primary_End_Proficiency_Math),
        reading_proficency_primary_end: parseFloat(
            d.Primary_End_Proficiency_Reading
        ),
        math_proficency_secondary_end: parseFloat(
            d.Lower_Secondary_End_Proficiency_Math
        ),
        reading_proficency_secondary_end: parseFloat(
            d.Lower_Secondary_End_Proficiency_Reading
        ),
    };
};

function scatterPlot() {
    d3.csv(
        "https://gist.githubusercontent.com/Tuanne2108/f3e20d4752299d6f408e199bea274ddb/raw/ee1cb3caa5102f5ed4e134f10a4bcfcd4475675a/education",
        rowConverter
    ).then((data) => {
        console.log(data);
        data = data.filter((d) => !isNaN(d.lat) && !isNaN(d.long) > 0);
        const selectedCountries = [
            "Nigeria",
            "South Africa",
            "Kenya",
            "China",
            "India",
            "Vietnam",
            "Saudi Arabia",
            "Germany",
            "Russia",
            "Italy",
            "United States",
            "Canada",
            "Mexico",
            "Brazil",
            "Argentina",
            "Peru",
            "Australia",
            "New Zealand",
            "Papua New Guinea",
            "Japan",
            "South Korea",
            "United Kingdom",
            "France",
            "Egypt",
            "Ghana",
            "Brazil",
            "Chile",
            "Thailand",
            "Singapore",
            "Philippines",
            "Myanmar",
            "Malaysia",
            "Laos",
            "Indonesia",
            "Brunei",
            "Cambodia",
            "East Timor",
        ];
        data = data.filter((d) => selectedCountries.includes(d.area));
        let svg = d3
            .select(".scatterplot")
            .append("svg")
            .attr("height", height)
            .attr("width", width);
        let xScale = d3
            .scaleLinear()
            .domain([
                d3.min(data, function (d) {
                    return d.lat;
                }),
                d3.max(data, function (d) {
                    return d.lat;
                }),
            ])
            .range([padding, width - padding]);
        let yScale = d3
            .scaleLinear()
            .domain([
                d3.min(data, function (d) {
                    return d.long;
                }),
                d3.max(data, function (d) {
                    return d.long;
                }),
            ])
            .range([height - padding, padding]);
        svg.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return xScale(d.lat);
            })
            .attr("cy", function (d) {
                return yScale(d.long);
            })
            .attr("r", 5)
            .attr("fill", function (d) {
                return d.area === "Vietnam" ? "red" : "green";
            })
            .attr("data-is-vietnam", function (d) {
                //If it's Vietnam
                return d.area === "Vietnam" ? "true" : "false";
            })
            .on("mouseover", function (event, d) {
                const xPosition = event.pageX;
                const yPosition = event.pageY - 150;
                d3.select("#scatter-tooltips")
                    .html(
                        `<p><strong>${d.area}</strong></p>
                           <p>Math Proficiency (Grade 2-3): ${d.math_proficency_grade_2_3} thousands</p>
                           <p>Reading Proficiency (Grade 2-3): ${d.reading_proficency_grade_2_3} thousands</p>
                           <p>Latitude: ${d.lat}</p>
                           <p>Longitude: ${d.long}</p>`
                    )
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px")
                    .style("opacity", 0.9);
            })
            .on("mouseout", function () {
                const isVietnam = d3.select(this).attr("data-is-vietnam") === "true";
                d3.select(this).attr("fill", isVietnam ? "red" : "green");
                d3.select("#scatter-tooltips").style("opacity", 0);
            });
        //Create xAxis
        let xAxis = d3.axisBottom().scale(xScale);
        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(xAxis);
        svg.append("text")
            .text("Latitude")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height - padding * 0.2)
            .attr("fill", "black")
            .attr("font-size", 14);
        //Create yAxis
        let yAxis = d3.axisLeft().scale(yScale);
        svg.append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);
        svg.append("text")
            .text("Longitude")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", padding / 3)
            .attr("font-size", 14)
            .attr("fill", "black")
            .attr("transform", "rotate(-90)");
    });
}
