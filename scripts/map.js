const width = 1200;
const height = 1000;
const padding = 300;

var rowConverter = (d) => {
    return {
        area: d["Countries and areas"],
        unemployment_rate: d["Unemployment_Rate"],
        birth_rate: d["Birth_Rate"],
    };
};

function mapChart() {
    const svg = d3
        .select(".map-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    function zoomed(event) {
        svg.selectAll("path").attr("transform", event.transform);
    }
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

    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const zoom = d3.zoom().scaleExtent([1, 5]).on("zoom", zoomed);
    svg.call(zoom);
    // Load GeoJSON data
    d3.json(
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    ).then(function (world) {
        const filteredFeatures = world.features.filter((feature) =>
            selectedCountries.includes(feature.properties.name)
        );
        const projection = d3.geoNaturalEarth1().fitSize([width, height], {
            type: "FeatureCollection",
            features: filteredFeatures,
        });

        const path = d3.geoPath().projection(projection);

        svg.selectAll("path")
            .data(filteredFeatures)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .on("mouseover", function (event, d) {
                d3.select(this).style("fill-opacity", 0.7);
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip
                    .html(d.properties.name) // Display country name
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY - 28 + "px");
            })
            .on("mouseout", function () {
                d3.select(this).style("fill-opacity", 1);
                tooltip.transition().duration(200).style("opacity", 0);
            })
            .on("click", function (event, d) {
                // Handle click event to display data for the clicked country
                const clickedCountry = d.properties.name;
                displayCountryData(clickedCountry);
            });
        // Load CSV data
        d3.csv(
            "https://gist.githubusercontent.com/Tuanne2108/f3e20d4752299d6f408e199bea274ddb/raw/ee1cb3caa5102f5ed4e134f10a4bcfcd4475675a/education",
            rowConverter
        ).then(function (data) {
            processData(data);
            mapOpacity(processedData);
        });
        function mapOpacity(data) {
            // Use a color scale to easily distinguish
            let colorScale = d3
                .scaleQuantile()
                .domain(data.map((item) => item.birth_rate))
                .range(["#ffefa5", "#febf5b", "#fd9d43", "#fc7034", "#f23d26"]);

            svg.selectAll("path")
                .data(filteredFeatures)
                .style("fill", function (d) {
                    const countryData = getDataForCountry(d.properties.name);
                    return colorScale(countryData.birth_rate);
                });
            // Add legend
            svg.append("text")
                .text("Unemployment Rate of each country")
                .attr("class", "axis-label")
                .attr("text-anchor", "middle")
                .attr("x", width / 1.9)
                .attr("y", height - padding * 0.4)
                .attr("fill", "black")
                .attr("font-size", 24);
        }
        function displayCountryData(country) {
            const countryData = getDataForCountry(country);

            // Update modal content using Bootstrap modal
            const modalTitle = document.getElementById("modal-title");
            const modalBody = document.getElementById("modal-body");

            modalTitle.innerHTML = countryData.area;
            modalBody.innerHTML = `Unemployment Rate: ${countryData.unemployment_rate}%`;

            // Show the modal
            const myModal = new bootstrap.Modal(
                document.getElementById("country-modal")
            );
            myModal.show();
        }
        let processedData;

        function processData(data) {
            processedData = data;
        }

        function getDataForCountry(country) {
            return processedData.find((d) => d.area === country);
        }
    });
}
