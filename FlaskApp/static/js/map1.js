var margin = {top: 50, left: 50, right: 50, bottom: 50},
	height = 1000- margin.top - margin.bottom,
	width = 1000 - margin.left - margin.right;

console.log("Start")




// var gBackground = svg.append("g"); // appended first

var projection = d3.geoEquirectangular()
										.scale(150)
										.translate([450, 250]);
var path = d3.geoPath(projection);


// define color scale
var color = function scale(d) {
  return d < 1 ? '#ffeaf0':
           d < 12 ? '#FF6666':
             d < 24 ? '#CB1010':
               d < 36 ? '#7d051f' :
                 d < 50 ? '#330000' :
                          '#000000'
                  };


var colorScale = [0,1,12, 24, 36, 50];
var legendText = ["0","0-1","1-12","12-24","24-36","36-50"];

// Append Div for tooltip to SVG
var toolTip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function buildMap(year) {
    console.log("Creating map!!!!!!!!!!!!");
    // Remove older SVG
//    d3.select("#map svg").remove();
//    d3.select(".legend").remove();

    //Create SVG element and append map to the SVG
    var svg = d3.select("#map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Load in country data
    d3.json("/metadata/year/2000")
        .then(function (data) {
            console.log('YEAR Data');
            console.log(data)
            var suicide_rates = data.suicide_rates;
            var countries = data.countries;

            /// Load GeoJSON data and merge with data
            var map_url = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
            d3.json(map_url, function (json) {
                    console.log('json country', json);
                    //loop through each country in csv
                    for (var i = 0; i < data.countries.length; i++) {

                    // country name
                        var country_data = data.countries[i];

                        // rate value
                        var rate_value = data.suicide_rates[i];

                        for (var j = 0; j < json.features.length; j++) {
                            var json_country = json.features[j].id;
                            //console.log(`Comparing: ${country_data} with ${json_country}`);

                            if (country_data == json_country) {
                                console.log(`Processing: ${country_data}`)
                                // Copy the rate value into the JSON
                                json.features[j].properties.suicide_rates = rate_value;

                                // Stop looking through the JSON
                                break;
                            }
                        }
                    }
                    console.log('Updated json: ',json);
                    svg.selectAll("path")
                                    .data(json.features)
                                    .enter()
                                    .append("path")
                                    .attr("d", path)
                                    .style("stroke", "#fff")
                                    .style("stroke-width", "1")
                                    .style("fill", function (d) {
                                        var value = d.properties.suicide_rates;

                                        if (value) {
                                            //If value exists…
                                            return color(value);
                                        } else {
                                            //If value is undefined…
                                            return "rgb(213,222,217)";
                                        }
                                    })
                                    .on("mouseover", function (d) {
                                        console.log(`Mousing over!`);
                                        toolTip.html(`<strong>${d.properties.name}</strong>
                                        <p>${d.properties.suicide_rates}</p>`)
                                        .style("left", (event.pageX) + "px")
                                        .style("top", (event.pageY - 28) + "px")
                                        .style("opacity", .9)
                                    })

                                    // fade out tooltip on mouse out
                                    .on("mouseout", function (d) {
                                        toolTip.transition()
                                            .duration(500)
                                            .style("opacity", 1);
                                    });

                                var legend = d3.select("#map").append("svg")
                                    .attr("class", "legend")
                                    .attr("width", 140)
                                    .attr("height", 200)
                                    .selectAll("g")
                                    .data(colorScale)
                                    .enter()
                                    .append("g")
                                    .attr("transform", function (d, i) {
                                        return "translate(0," + i * 20 + ")";
                                    });

                                legend.append("rect")
                                    .attr("width", 18)
                                    .attr("height", 18)
                                    .style("fill", color);

                                legend.append("text")
                                    .data(legendText)
                                    .attr("x", 24)
                                    .attr("y", 9)
                                    .attr("dy", ".35em")
                                    .text(function (d) {
                                        return d;
                                    });

                            });

                        });




    // d3.json("/metadata/country/AUS")
    //     .then(function (data) {
    //         console.log('Country Data');
    //         console.log(data)
    //     //var suicide_rates = data.suicide_rates;
    //     //var countries = data.countries;
    //     });

}

function init() {

    // Set up the dropdown menu
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selYear");

    // Use the list of sample names to populate the select options
    d3.json("/years", years => {
            years.forEach((instance) => {
            selector
            .append("option")
            .text(instance)
            .property("value", instance);
            });

        // Use Alabama to build the initial plot
        const currentYear = years[0];
        buildMap(currentYear);
    });
}

function yearChanged(newYear) {
    // Fetch new data each time a new state is selected
    buildMap("2010");
}
init();

buildMap("2010");
