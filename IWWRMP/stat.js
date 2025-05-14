
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
var areaTotals = {};

// Fetch the GeoJSON data from the external file
fetch('https://raw.githubusercontent.com/darshanacw/darshanacw.github.io/main/QGIS/lulc_4326.geojson')
    .then(response => response.json())
    .then(data => {
        // Iterate through the features to set polygon colors and aggregate areas
        L.geoJSON(data, {
            style: function(feature) {
                var className = feature.properties.class;
                var fillColor = colorMap[className] || '#808080'; // Default to grey if class not found
                return {
                    color: fillColor, // Polygon border color
                    fillColor: fillColor, // Polygon fill color
                    fillOpacity: 0.6 // Adjust as needed
                };
            },
            onEachFeature: function(feature, layer) {
                var className = feature.properties.class;
                var area = feature.properties.shape_Area;

                // Aggregate area by class
                if (!areaTotals[className]) {
                    areaTotals[className] = 0;
                }
                areaTotals[className] += area;

                // Optionally add a popup with area info
                layer.bindPopup('<strong>MWS ID:</strong> ' + className + '<br><strong>Area:</strong> ' + area + ' sq km');
            }
        }).addTo(map);

        // Calculate the total area of all polygons for percentage calculation
        var totalArea = Object.values(areaTotals).reduce((a, b) => a + b, 0);

        // Prepare data for the pie chart
        var ids = Object.keys(areaTotals); // Unique class names
        var areas = Object.values(areaTotals); // Total areas for each class

        // Create the pie chart with the same colors
        var ctx = document.getElementById('areaPieChart').getContext('2d');
        new Chart(ctx, {
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
    })
    .catch(error => console.error('Error loading the GeoJSON data:', error));

// Toggle the side panel
var sidePanel = document.getElementById('climPanel');
var toggleButton = document.getElementById('climateLayerBtn');

toggleButton.addEventListener('click', function() {
    sidePanel.classList.toggle('open');
    if (sidePanel.classList.contains('open')) {
        toggleButton.innerText = 'Hide Chart';
    } else {
        toggleButton.innerText = 'Show Chart';
    }
});

// Load Leaflet and Chart.js scripts dynamically
const leafletScript = document.createElement('script');
leafletScript.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
document.head.appendChild(leafletScript);

const chartJsScript = document.createElement('script');
chartJsScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(chartJsScript);
