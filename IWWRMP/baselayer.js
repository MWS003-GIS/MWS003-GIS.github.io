
let geoJsonLayers = {}; // Store GeoJSON layers globally

// Function to activate buttons and fetch CSV
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
            .then(csvData => {
                // Parse the CSV data using PapaParse
                Papa.parse(csvData, {
                    header: true,
                    complete: function(results) {
                        const data = results.data;
                        console.log(data); // CSV parsed data

                        // Filter data where "Database" equals "Administration"
                        const filteredData = data.filter(row => row.Database === 'Administration');

                        // Get the "Layer" column and "geojson" column from the filtered data
                        const layerNames = filteredData.map(row => row.Layer);
                        const geojsonUrls = filteredData.map(row => row.geojson).filter(url => url); // Filter out empty URLs

                        // Update the side panel (basePanel) with the Layer names
                        updateSidePanel(layerNames, geojsonUrls);
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

// Function to update the side panel with checkboxes for each Layer
function updateSidePanel(layerNames, geojsonUrls) {
    const basePanel = document.getElementById('basePanel');

    // Clear existing content
    basePanel.innerHTML = '';

    // Create checkboxes for each Layer name
    layerNames.forEach((layerName, index) => {
        const div = document.createElement('div');

        // Create a checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `layer_${index}`; // Unique ID for the checkbox
        checkbox.checked = true; // Check the checkbox by default
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

        // Load the GeoJSON layer
        loadGeoJsonLayer(geojsonUrls[index], layerName); // Pass GeoJSON URL and Layer name
    });
}

// Function to load a single GeoJSON layer onto the Leaflet map
function loadGeoJsonLayer(url, layerName) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(geojsonData => {
            // Create a GeoJSON layer
            const geoJsonLayer = L.geoJSON(geojsonData, {
                onEachFeature: (feature, layer) => {
                    // You can add popups or other interactivity here
                    layer.bindPopup(feature.properties.name || 'No name'); // Example: binding a popup
                }
            });

            geoJsonLayers[layerName] = geoJsonLayer; // Store layer for later use
            geoJsonLayer.addTo(map); // Add layer to map by default
        })
        .catch(error => {
            console.error('Error fetching the GeoJSON file:', error);
        });
}
