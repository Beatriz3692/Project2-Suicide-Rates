var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 20,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var projection = d3.geoEquirectangular()
                                        .translate([width/2, height/2])    // center of screen
                                        .scale([1000]);          // scale things down so see entire worl
var path = d3.geo.path()
                 .projection(projection);
