// Function to activate buttons and fetch CSV based on button click
document.getElementById('climateLayerBtn').addEventListener('click', function () {
    const selectElement = document.getElementById('selectMWSID');
    const mwsID = selectElement.value;

    if (mwsID) {
        const csvFilePath = `https://raw.githubusercontent.com/MWS003-GIS/MWS003-GIS.github.io/main/IWWRMP/Data/EXD/MWS_${mwsID}/proplayer_${mwsID}.csv`;

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
                    complete: function (results) {
                        const data = results.data;
                        console.log(data); // CSV parsed data

                        // Filter data where "Database" equals "Administration"
                        const filteredData = data.filter(row => row.Database === 'Climate');

                        // Get the "Layer" column and "png" column from the filtered data
                        const layerNames = filteredData.map(row => row.Layer);
                        const pngUrls = filteredData.map(row => row.geojson).filter(url => url); // Filter out empty URLs

                        // Update the side panel (proposalPanel) with the Layer names
                        updateProposalPanel(layerNames, pngUrls);
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching the CSV file:', error);
            });
    } else {
        alert('Please select a valid MWS_ID.');
    }
});

// Function to update the proposal panel with checkboxes for each Layer
function updateProposalPanel(layerNames, pngUrls) {
    const climPanel = document.getElementById('climPanel');

    // Clear existing content
    climPanel.innerHTML = '';

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
                // Show the PNG overlay
                pngOverlays[layerName].addTo(map);
            } else {
                // Hide the PNG overlay
                map.removeLayer(pngOverlays[layerName]);
            }
        });

        // Create a label for the checkbox
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = layerName;

        // Append checkbox and label to the div
        div.appendChild(checkbox);
        div.appendChild(label);
        climPanel.appendChild(div);

        // Load the PNG overlay
        loadPngOverlay(pngUrls[index], layerName); // Pass PNG URL and Layer name
    });
}

// Function to load a PNG overlay onto the Leaflet map with bounding coordinates
function loadPngOverlay(url, layerName) {
    // Define the bounding coordinates for the overlay
    const southWest = [6.753572835,80.4263826425084]; // Replace with actual South-West coordinates (lat, lng)
    const northEast = [7.47454951957935 ,81.06883711]; // Replace with actual North-East coordinates (lat, lng)
    const bounds = [southWest, northEast];

    // Create the PNG image overlay
    const pngOverlay = L.imageOverlay(url, bounds, {
        opacity: 0.7,  // Set opacity if needed
        interactive: true  // Make the image interactive for events
    });

    pngOverlays[layerName] = pngOverlay; // Store overlay for later use
    pngOverlay.addTo(map); // Add overlay to map by default
}

// Store the PNG overlays globally for reference
const pngOverlays = {};
