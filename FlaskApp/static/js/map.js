var margin = {top: 50, left: 50, right: 50, bottom: 50},
	height = 400 - margin.top - margin.bottom,
	width = 1600 - margin.left - margin.right;

//var svg = d3.selectAll("body")
	//.append("svg")
	//.attr("height", height + margin.top + margin.bottom)
	//.attr("width", width + margin.left + margin.right)
 	//.append("g");

// create SVG element
var svg = d3.select("#map")
					.append("svg")
					.attr("height", height + margin.top + margin.bottom)
					.attr("width", width + margin.left + margin.right)
					.append("g");


var gBackground = svg.append("g"); // appended first

var projection = d3.geoEquirectangular()
										.scale(600)
										.translate([340, 150]);
var path = d3.geoPath(projection);


// define color scale
var color = function scale(d) {
  return d < 1 ? '#61001d' :
          d < 6 ? '#6f011e' :
           d < 12 ? '#7d051f' :
            d < 18 ? '#890d22' :
             d < 24 ? '#951726' :
              d < 30 ? '#9f232c' :
               d < 36 ? '#a73135' :
                d < 42 ? '#aa4144' :
                 d < 50 ? '#a4555b' :
                            '#145214'
                  };


var colorScale = [1, 6, 12, 18, 24, 30, 36, 42, 50];
var legendText = ["0-1","1-6","6-12","12-18","18-24","24-30","30-36","36-42","42-50"];

// Append Div for tooltip to SVG
var toolTip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



function buildMap(year) {
    // Remove older SVG
    d3.select("#map svg").remove();
    d3.select(".legend").remove();

    //Create SVG element and append map to the SVG
    var svg = d3.select("#map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Load in country data
    var suicide_years_url = `/metadata/year/${year}`;
    d3.json(suicide_years_url, function (data) {
       console.log('country data', data);
       var suicide_rates = data.suicide_rates;
       var countries = data.countries;

    /// Load GeoJSON data and merge with data
    var map_url = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json"
    d3.json(map_url, function (json) {
            console.log('json country', json);
            //loop through each country in csv
             for (var i = 0; i < data.countries.length; i++) {

               // country name
                var country_data = data.countries[i];

                // rate value
                var rate_value = data.suicide_rates[i];


                for (var j = 0; j < json.features.length; j++) {
                    var json_country = json.features[j].properties.alpha-3;

                    if (country_data == json_country) {

                        // Copy the rate value into the JSON
                        json.features[j].properties.suicide_rates = rate_value;

                        // Stop looking through the JSON
                        break;
                    }
                }
            }

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
                                toolTip.transition()
                                    .duration(200)
                                    .style("opacity", .9);
                                toolTip.html(`<strong>${d.properties.name}</strong>
                                            <p>${d.properties.suicide_rates}</p>`)
                                    .style("left", (d3.event.pageX) + "px")
                                    .style("top", (d3.event.pageY - 28) + "px");
                            })

                            // fade out tooltip on mouse out
                            .on("mouseout", function (d) {
                                toolTip.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            });

                        var legend = d3.select("#map").append("svg")
                            .attr("class", "legend")
                            .attr("width", 140)
                            .attr("height", 200)
                            .selectAll("g")
                            .data(colorsRange)
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
    buildMap("2016");
}
init();
