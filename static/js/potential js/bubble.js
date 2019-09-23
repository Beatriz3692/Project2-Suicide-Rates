(function() {
  var width = 500,
      height = 500;

  var svg = d3.select("chart")
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .append("g")
      .attr("transform", "translate(0,0)")

  var circle = document.getElementById('bubble'),
  data = [{
      x: yearData.countries,
      y: yearData.suicide_rates,
      type: "bubble",
      marker: {
          color: 'red'
      },
      text: 'Counts per 100,000 persons',
  }];
})
