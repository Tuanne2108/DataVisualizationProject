var dateParse = d3.timeParse("%Y-%m-%m");
var fileName = 'https://gist.githubusercontent.com/radhika-sivarajan/d78e4444edf3816fb0c3d939da9bc3ed/raw/6ecaa93312d3c629d89f416343867fbb7f7108e4/datasrc.csv';

var margin = { top: 30, right: 50, bottom: 30, left: 50 };
var svgWidth = 700 - margin.left - margin.right;
var svgHeight = 500 - margin.top - margin.bottom;
var padding = 0.25;

// Canvas for the graph
var canvas = d3.select('.bar-diagram')
    .append('svg')
    .attr('width', svgWidth + margin.left + margin.right)
    .attr('height', svgHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read csv file
d3.csv(fileName).then(function(data) {
    makeOptions(data);
    // makeVisChart(data);
});

function makeOptions(csvData) {
    // Get platform names
    var allPlatform = [];
    var uniquePlatform = [];
    csvData.forEach(function(d) {
        allPlatform.push(d.Platform);
    });
    uniquePlatform = [...new Set(allPlatform)];

    // Create check bock for platform
    d3.select('#selectPlatform')
        .selectAll('.checkboxPlatform')
        .data(uniquePlatform)
        .enter()
        .append('div')
        .attr('class', 'checkboxPlatform')
        .append('label')
        .html(function(d) {
            var checkboxPlatform = '<input id="' + d + '" type="checkbox" class="platform">';
            return checkboxPlatform + ' ' + d;
        });

    // When check box selected generate checkbox for product
    d3.select('#selectPlatform')
        .selectAll('.checkboxPlatform')
        .on('change', function() {
            var checkedBox = d3.select('#selectPlatform')
                .selectAll('.platform:checked');

            var selectedPlatforms = checkedBox._groups.map(function(platform) {
                var idList = [];
                for (i = 0; i < platform.length; i++) {
                    idList.push(platform[i].id);
                }
                return idList;
            });

            // Get selected platform data from csv
            var selectedPlatformsData = csvData.filter(function(d) {
                return selectedPlatforms[0].indexOf(d.Platform) >= 0;
            });
            // console.log(selectedPlatforms[0]);

            // Get product name with platform
            var allPlatformProduct = [];
            var uniquePlatformProduct = [];
            selectedPlatformsData.forEach(function(d) {
                allPlatformProduct.push(d.Platform + '-' + d.ProductType);
            });
            uniquePlatformProduct = [...new Set(allPlatformProduct)];
            // console.log(uniquePlatformProduct);

            d3.select('#selectProduct')
                .selectAll('.checkboxProduct')
                .data(uniquePlatformProduct)
                .enter()
                .append('div')
                .attr('class', 'checkboxProduct')
                .append('label')
                .html(function(d, index) {
                    var checkboxProduct = '<input id="' + uniquePlatformProduct[index] + '" type="checkbox" class="product">';
                    return checkboxProduct + ' ' + uniquePlatformProduct[index];
                });

            d3.select('#selectProduct')
                .selectAll('.checkboxProduct')
                .on('change', function() {
                    var checkedBoxProduct = d3.select('#selectProduct')
                        .selectAll('.product:checked');
                    var selectedProducts = checkedBoxProduct._groups.map(function(product) {
                        var itemList = [];
                        for (i = 0; i < product.length; i++) {
                            itemList.push(product[i].id);
                        }
                        return itemList;
                    });
                    getCSVOfSelected(csvData, selectedProducts[0])
                });
        });
}

function getCSVOfSelected(allCSVData, selectedArray) {
    selectedArray.forEach(function(d) {
        var data = d.split("-");
        var selectedData = allCSVData.filter(function(d) {
            return (data[0].indexOf(d.Platform) >= 0 && data[1].indexOf(d.ProductType) >= 0);
        });
        makeVisChart(selectedData);
    });
}

function makeVisChart(data) {
    // Scale the range of the data
    var xScale = d3.scaleBand()
        .range([0, svgWidth], .1)
        .domain(d3.range(0, data.length + 1));

    var yScale = d3.scaleLinear()
        .range([svgHeight, 0])
        .domain([d3.min(data, function(d) { return d.Value; }), d3.max(data, function(d) { return d.Value; })]);

    canvas.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('data', function(d) {
            return parseInt(d.Value);
        })
        .attr('width', xScale.bandwidth())
        .attr('height', function(d) {
            return (yScale(0) - yScale(parseInt(d.Value)));
        })
        .attr('x', function(d, i) {
            return xScale(i);
        })
        .attr('y', function(d) {
            return yScale(parseInt(d.Value));
        })
        .attr('fill', 'green');

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Add the X Axis
    canvas.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + svgHeight + ")")
        .call(xAxis);

    // Add the Y Axis
    canvas.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}