// Define a color map for unique classes
var colorMap = {
    'Home garden': '#FF6384',
    'Seasonal crop': '#36A2EB',
    'Scrub land': '#FFCE56',
    'Perennials': '#4BC0C0',
    'Paddy': '#9966FF',
    'Forest': '#FF9F40',
    // Add more classes and colors as needed
};

// Initialize an object to hold total areas for each class
var areaTotals1 = {};

// Fetch the GeoJSON data from the external file
fetch('https://raw.githubusercontent.com/MWS003-GIS/MWS003-GIS.github.io/main/IWWRMP/Data/EXD/MWS_003/ED_07_SED_PPL_poly_v1.geojson')
    .then(response => response.json())
    .then(data => {
        // Iterate through the features to set polygon colors and aggregate areas
        L.geoJSON(data, {
            style: function(feature) {
                var className = feature.properties.GND_N;
                var fillColor = colorMap[className] || '#808080'; // Default to grey if class not found
                return {
                    color: fillColor, // Polygon border color
                    fillColor: fillColor, // Polygon fill color
                    fillOpacity: 0.6 // Adjust as needed
                };
            },
            onEachFeature: function(feature, layer) {
                var className = feature.properties.GND_N;
                var area = feature.properties.Shape_Area;

                // Aggregate area by class
                if (!areaTotals1[className]) {
                    areaTotals1[className] = 0;
                }
                areaTotals1[className] += area;

                // Optionally add a popup with area info
                layer.bindPopup('<strong>MWS ID:</strong> ' + className + '<br><strong>Area:</strong> ' + area + ' sq km');
            }
        //}).addTo(map);
        });
        // Calculate the total area of all polygons for percentage calculation
        var totalArea = Object.values(areaTotals1).reduce((a, b) => a + b, 0);

        // Prepare data for the pie chart
        var ids = Object.keys(areaTotals1); // Unique class names
        var areas = Object.values(areaTotals1); // Total areas for each class

        // Toggle the side panel and display the pie chart
        var sidePanel = document.getElementById('statPanel');
        var toggleButton = document.getElementById('adminstatPanel');
        var chartInstance = null;  // Variable to hold the chart instance

        toggleButton.addEventListener('click', function() {
            sidePanel.classList.toggle('open');

            if (sidePanel.classList.contains('open')) {
                toggleButton.innerText = 'Hide Chart';

                // Render the pie chart when the panel is opened
                var ctx = document.getElementById('areaPieChart').getContext('2d');
                if (chartInstance !== null) {
                    chartInstance.destroy(); // Destroy the old chart instance before creating a new one
                }
                chartInstance = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ids,  // Use unique class names as labels
                        datasets: [{
                            label: 'Polygon Areas',
                            data: areas,  // Use aggregated areas as values
                            backgroundColor: ids.map(id => colorMap[id] || '#808080'), // Use colors from colorMap
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Polygon Areas'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        var area = areas[tooltipItem.dataIndex];
                                        var percentage = (area / totalArea * 100).toFixed(2); // Calculate percentage
                                        return tooltipItem.label + ': ' + area.toFixed(2) + ' sq km (' + percentage + '%)';
                                    }
                                }
                            }
                        }
                    }
                });

            } else {
                toggleButton.innerText = 'Admin';

                // Remove the chart when the panel is closed
                if (chartInstance !== null) {
                    chartInstance.destroy();
                    chartInstance = null;  // Reset the chart instance
                }
            }
        });

        // Download button event listener
        document.getElementById('downloadButton').addEventListener('click', function() {
            // Create the CSV content
            var csvContent = "data:text/csv;charset=utf-8,Class,Area (sq km),Percentage\n";
            ids.forEach((className, index) => {
                var area = areas[index];
                var percentage = (area / totalArea * 100).toFixed(2);
                csvContent += `${className},${area.toFixed(2)},${percentage}%\n`;
            });

            // Create a temporary link element
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', 'area_statistics.csv');
            document.body.appendChild(link);

            // Programmatically click the link to trigger the download
            link.click();

            // Remove the link element
            document.body.removeChild(link);
        });
		
		// Download button event listener for Pie Chart image
       document.getElementById('downloadChartButton').addEventListener('click', function() {
    if (chartInstance) {
        // Convert chart to Base64 image and create a link to download it
        var imageLink = document.createElement('a');
        imageLink.href = chartInstance.toBase64Image();  // Convert chart to image
        imageLink.download = 'area_pie_chart.png';  // Set the filename for download
        imageLink.click();  // Trigger the download
    } else {
        alert('No chart available to download.');
    }
});
		
		
    })
    .catch(error => console.error('Error loading the GeoJSON data:', error));