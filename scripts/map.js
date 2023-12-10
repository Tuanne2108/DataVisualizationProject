const width = 1200;
const height = 1000;

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

    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

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
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip
                    .html(d.properties.name) // Display country name
                    .style("left", event.pageX + "px")
                    .style("top", event.pageY - 28 + "px");
            })
            .on("mouseout", function () {
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
            const birthRate = d3.max(data, (d) => parseFloat(d.birth_rate));

            // Use a color scale to easily distinguish
            const colorScale = d3
                .scaleDiverging()
                .interpolator(d3.interpolateRdBu)
                .domain([0, 1500]);

            svg.selectAll("path")
                .data(filteredFeatures)
                .style("fill", function (d) {
                    const countryData = getDataForCountry(d.properties.name);
                    return colorScale(countryData.birth_rate);
                })
                .style("fill-opacity", function (d) {
                    const countryData = getDataForCountry(d.properties.name);
                    const normalizedOpacity =
                        countryData.birth_rate / birthRate;
                    return normalizedOpacity;
                });
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
