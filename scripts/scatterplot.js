const height = 700;
const width = 900;
const padding = 50;


var rowConverter = (d) => {
    return {
        area: d["Countries and areas"],
        lat: parseFloat(d.Latitude),
        long: parseFloat(d.Longitude),
        continent: d["Continent"],
        math_proficency_grade_mid: parseFloat(d.Grade_2_Proficiency_Math),
        reading_proficency_grade_mid: parseFloat(
            d.Grade_2_Proficiency_Reading
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

function scatterPlot(data) {
    if (!data || !Array.isArray(data)) {
        console.error("Invalid or empty data");
        return;
    }
    data = data.filter((d) => !isNaN(d.lat) && !isNaN(d.long));
    // Select the existing scatterplot svg and remove it
    d3.select(".scatterplot svg").remove();
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
            }) || 0,
            d3.max(data, function (d) {
                return d.lat;
            }) || 1,
        ])
        .range([padding, width - padding]);

    let yScale = d3
        .scaleLinear()
        .domain([
            d3.min(data, function (d) {
                return d.long;
            }) || 0,
            d3.max(data, function (d) {
                return d.long;
            }) || 1,
        ])
        .range([height - padding, padding]);
    const colorMap = {
        "Grade 2-3": "blue",
        "Primary End": "#ff00ff",
        "Secondary End": "orange",
    };
    function hasBothProficiencies(d, level) {
        const mathKey = `math_proficency_${level.replace(/\s/g, "_").toLowerCase()}`;
        const readingKey = `reading_proficency_${level.replace(/\s/g, "_").toLowerCase()}`;
        return d[mathKey]>0 && d[readingKey]>0;
      }
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
            if (hasBothProficiencies(d, selectedLevel)) {
              return colorMap[selectedLevel]; // Use color based on selected level
            } else {
              return d.area === "Vietnam" ? "red" : "grey"; // Fallback colors
            }
          })
        .attr("data-is-vietnam", function (d) {
            // If it's Vietnam
            return d.area === "Vietnam" ? "true" : "false";
        })
        .on("mouseover", function (event, d) {
            const xPosition = event.pageX;
            const yPosition = event.pageY - 150;

            let mathProficiency, readingProficiency;

            // Assuming selectedLevel is a global variable
            switch (selectedLevel) {
                case "Grade 2-3":
                    mathProficiency = d.math_proficency_grade_mid;
                    readingProficiency = d.reading_proficency_grade_mid;
                    break;
                case "Primary End":
                    mathProficiency = d.math_proficency_primary_end;
                    readingProficiency = d.reading_proficency_primary_end;
                    break;
                case "Secondary End":
                    mathProficiency = d.math_proficency_secondary_end;
                    readingProficiency = d.reading_proficency_secondary_end;
                    break;
                default:
                    mathProficiency = 0; // Default values or handle accordingly
                    readingProficiency = 0;
            }

            d3.select("#scatter-tooltips")
                .html(
                    `<p><strong>${d.area}</strong></p>
                    <p>Math Proficiency (${selectedLevel}): ${mathProficiency} thousands</p>
                    <p>Reading Proficiency (${selectedLevel}): ${readingProficiency} thousands</p>
                    <p>Latitude: ${d.lat}</p>
                    <p>Longitude: ${d.long}</p>`
                )
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")
                .style("opacity", 0.9);
        })
        .on("mouseout", function () {
            const isVietnam =
                d3.select(this).attr("data-is-vietnam") === "true";
            d3.select(this).attr("fill", isVietnam ? "red" : "grey");
            d3.select("#scatter-tooltips").style("opacity", 0);
        });

    // Create xAxis
    let xAxis = d3.axisBottom().scale(xScale);
    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    // Create yAxis
    let yAxis = d3.axisLeft().scale(yScale);
    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
}
document.addEventListener("DOMContentLoaded", function () {
    d3.csv(
        "https://gist.githubusercontent.com/Tuanne2108/f3e20d4752299d6f408e199bea274ddb/raw/467c03104263e20c0d9a0ca3565b86844aee58c7/education",
        rowConverter
    ).then((data) => {
        console.log(data);
        // Filter the data based on the selected level
        let filteredData = data.filter((d) => {
            switch (selectedLevel) {
                case "Grade 2-3":
                    return (
                        !isNaN(d.math_proficency_grade_mid) &&
                        !isNaN(d.reading_proficency_grade_mid)
                    );
                case "Primary End":
                    return (
                        !isNaN(d.math_proficency_primary_end) &&
                        !isNaN(d.reading_proficency_primary_end)
                    );
                case "Secondary End":
                    return (
                        !isNaN(d.math_proficency_secondary_end) &&
                        !isNaN(d.reading_proficency_secondary_end)
                    );
                default:
                    return true; // Default to show all data
            }
        });

        // Initial scatterplot creation
        scatterPlot(filteredData);

        // Add event listener for the change event on the continent select element
        d3.select("#continentSelect").on("change", function () {
            // Get the selected continent value
            const selectedContinent = this.value;

            // Update filteredData based on the selected continent
            let filteredCountries = data.filter(
                (d) => d.continent === selectedContinent
            );

            // Update the scatterplot with the new data
            scatterPlot(filteredCountries);
        });
    });
});
