let csvData; // Global variable to hold the CSV data

function activateButtons() {
    const selectElement = document.getElementById('selectMWSID');
    const mwsID = selectElement.value;

    if (mwsID) {
        const csvFilePath = `https://raw.githubusercontent.com/MWS003-GIS/MWS003-GIS.github.io/main/IWWRMP/Data/EXD/MWS_${mwsID}/datalayer_${mwsID}.csv`;

        fetch(csvFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                // Parse the CSV data using PapaParse
                Papa.parse(data, {
                    header: true,
                    complete: function(results) {
                        csvData = results.data; // Store CSV data globally

                        // Update side panel with all layers or based on your initial criteria
                        updateSidePanel(csvData);
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching the CSV file:', error);
            });
    } else {
        alert('Please select a valid MWS_ID.');
    }
}

// Function to search metadata in the CSV data
function searchMetadata() {
    const query = document.getElementById('metadataSearch').value.toLowerCase();
    const filteredLayers = [];

    // Iterate through the previously fetched CSV data
    csvData.forEach(row => {
        // Check if any specified columns contain the search query
        if (Object.values(row).some(value => 
            value.toString().toLowerCase().includes(query)
        )) {
            filteredLayers.push(row);
        }
    });

    // Update the side panel with the filtered results
    updateSidePanelWithSearchResults(filteredLayers);
}

// Function to update the side panel with the filtered search results
function updateSidePanelWithSearchResults(filteredLayers) {
    const basePanel = document.getElementById('basePanel');
    
    // Clear existing content
    basePanel.innerHTML = '';

    // Create checkboxes for each filtered layer
    filteredLayers.forEach((row, index) => {
        const layerName = row.Layer; // Adjust based on your column names
        const geojsonUrl = row.geojson; // Adjust based on your column names

        const div = document.createElement('div');

        // Create a checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `filtered_layer_${index}`; // Unique ID for the checkbox
        checkbox.checked = true; // Check the checkbox by default

        // Add event listener to toggle the layer
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                // Show the layer
                geoJsonLayers[layerName].addTo(map);
            } else {
                // Hide the layer
                map.removeLayer(geoJsonLayers[layerName]);
            }
        });

        // Create a label for the checkbox
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = layerName;

        // Append checkbox and label to the div
        div.appendChild(checkbox);
        div.appendChild(label);
        basePanel.appendChild(div);

        // Load the GeoJSON layer if it hasn't been loaded already
        if (!geoJsonLayers[layerName]) {
            loadGeoJsonLayer(geojsonUrl, layerName); // Load GeoJSON layer
        }
    });
}
