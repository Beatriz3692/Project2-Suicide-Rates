function buildCharts(country) {
    // TO DO: Iterate through all states

    d3.json(`/metadata/country/${country}`, function(country_data) {
        console.log(country);

        // Cast rates as numbers

        console.log('country data', country_data);

        // Build line chart
	    var trace1 = {
            x: country_data.year,
            y: country_data.suicide_rates,
            type: "line",
            marker: {
                color: 'red'
            },
            text: 'Counts per 100,000 persons'
        };
        var data = [trace1];
        var layout = {
            title: `${country} Suicide Rates`,
            xaxis: { title: "Year"},
            yaxis: { title: "Suicide Rate"}
        };
        Plotly.newPlot("line", data, layout);
    });

    // Build map with static data from 2016

    d3.json(`/metadata/year/2016`, function(yearData) {
        console.log('2016 data', yearData)


        // Build bar chart
        var myPlot = document.getElementById('bar'),
            data = [{
                x: yearData.countries,
                y: yearData.suicide_rates,
                type: "bar",
                marker: {
                    color: 'red'
                },
                text: 'Counts per 100,000 persons',
            }];
            layout = {
                title: "2016 Suicide Rates",
                xaxis: {
                    title: "Country (alpha-3 code)",
                    tickangle: 40,
                    tickfont: {
                        size: 9.5
                    }
                },
                yaxis: {title: "Suicide Rate"},
                hovermode: 'closest'
            };

        Plotly.newPlot("bar", data, layout);

    });

}



function init() {

    // Set up the dropdown menu
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/countries", country => {
        country.forEach((instance) => {
        selector
            .append("option")
            .text(instance)
            .property("value", instance);
        });

        // Use Alabama to build the initial plot
        const currentCountry = country[0];
        buildCharts(currentCountry);
    });
}

function optionChanged(newCountry) {
    // Fetch new data each time a new state is selected
    buildCharts(newCountry);
}

init();
