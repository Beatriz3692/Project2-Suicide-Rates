Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/3d-scatter.csv', function(err, rows){
      function unpack(rows, key) {
          return rows.map(function(row)
          { return row[key]; });
      }
function buildCharts(year) {
    // TO DO: Iterate through all states

    d3.json(`/metadata/year/${year}`, function(year_data) {
        console.log(year);

        // Cast rates as numbers

        console.log('year data', year_data);

        var trace1 = {
          x: year_data.suicide_rates,
          y: year_data.countries,
          mode: 'markers',
          marker: {
            size: 12,
            line: {
              color: 'red',
              width: 0.5
                  },
                  opacity: 0.5
                },
                text: 'Counts per 100,000 persons',
                type: 'scatter3d',
              };
              var data = [trace1];
              var layout = {
                  title: `${year} Suicide Rates`,
                  xaxis: { title: "Country"},
                  yaxis: { title: "Suicide Rate"}
              };
              Plotly.newPlot("scatter3D", data, layout,
             {showSendToCloud: true});
        });

    }
          function init() {

              // Set up the dropdown menu
              // Grab a reference to the dropdown select element
              var selector = d3.select("#Dataset");

              // Use the list of sample names to populate the select options
              d3.json("/years", year => {
                  year.forEach((instance) => {
                  selector
                      .append("option")
                      .text(instance)
                      .property("value", instance);
                  });

                  // Use Alabama to build the initial plot
                  const currentYear = year[0];
                  buildCharts(currentYear);
              });
          }

          function optionChanged(newYear) {
              // Fetch new data each time a new state is selected
              buildCharts(newYear);
          }

        init();
