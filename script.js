const width = 1200;
const height = 1000;

var rowConverter = (d) => {
    return {
        area: d["Countries and areas"],
        coordinates: [parseFloat(d.Longitude), parseFloat(d.Latitude)],
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
    ];

    d3.json(
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    )
        .then(function (world) {
            const filteredFeatures = world.features.filter((feature) =>
                selectedCountries.includes(feature.properties.name)
            );

            const projection = d3
                .geoMercator()
                .fitSize([width, height], {
                    type: "FeatureCollection",
                    features: filteredFeatures,
                });

            const path = d3.geoPath().projection(projection);

            svg.selectAll("path")
                .data(filteredFeatures)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", "lightgray")
                .attr("stroke", "white");

            d3.csv(
                "https://gist.githubusercontent.com/Tuanne2108/f49e31cda7defac3cde2d142ac2ffa34/raw/0deefccaa6e1e68004cd6636000998688cb207f2/project_data",
                rowConverter
            )
                .then(function (data) {
                    // Plot points on the map
                    // Plot points on the map
                    svg.selectAll("circle")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d) {
                            const projected = projection(d.coordinates);
                            console.log("Projected X:", projected[0]);
                            return projected[0];
                        })
                        .attr("cy", function (d) {
                            const projected = projection(d.coordinates);
                            console.log("Projected Y:", projected[1]);
                            return projected[1];
                        })
                        .attr("r", 5)
                        .attr("fill", "steelblue");
                })
                .catch(function (error) {
                    console.error("Error loading CSV data:", error);
                });
        })
        .catch(function (error) {
            console.error("Error loading GeoJSON data:", error);
        });
}
