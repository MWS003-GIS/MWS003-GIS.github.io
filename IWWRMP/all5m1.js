
// Initialize layers storage
const pngOverlays = {};
const geoJsonLayers = {};
const layerState = {};  // Object to track the state of each layer

// Function to activate buttons and fetch CSV for Base Layers
function activateBaseLayers() {
    const selectElement = document.getElementById('selectMWSID');
    const mwsID = selectElement.value;

    if (mwsID) {
        const csvFilePath = `https://raw.githubusercontent.com/MWS003-GIS/MWS003-GIS.github.io/main/IWWRMP/Data/EXD/MWS_${mwsID}/AllDataLayer_${mwsID}.csv`;

        fetch(csvFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(csvData => {
                Papa.parse(csvData, {
                    header: true,
                    complete: function (results) {
                        const data = results.data;
                        console.log("Parsed Base CSV data:", data);

                        const baseData = data.filter(row => row.Group === 'Base' || row.Group === 'Raster');
                        const databaseLayers = {};
                        baseData.forEach(row => {
                            const { Database, Layer, geojson, Group } = row;
                            if (!databaseLayers[Database]) {
                                databaseLayers[Database] = [];
                            }
                            databaseLayers[Database].push({ Layer, geojson, Group });
                        });

                        updateBasePanel(databaseLayers);
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching the Base CSV file:', error);
            });
    } else {
        alert('Please select a valid MWS_ID.');
    }
}

// Function to update the side panel with checkboxes for Base Layers
function updateBasePanel(databaseLayers) {
    const basePanel = document.getElementById('basePanel');
    basePanel.innerHTML = '';

    Object.keys(databaseLayers).forEach(databaseName => {
        const databaseDiv = document.createElement('div');
        const databaseTitle = document.createElement('h3');
        databaseTitle.textContent = databaseName;
        databaseDiv.appendChild(databaseTitle);

        databaseLayers[databaseName].forEach((layerInfo, index) => {
            const { Layer, geojson, Group } = layerInfo;

            const layerDiv = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `layer_${databaseName}_${index}`;
            //checkbox.checked = false;
            checkbox.checked = layerState[Layer] || false;  // Use stored state if available
			
            checkbox.addEventListener('change', (e) => {
                layerState[Layer] = e.target.checked;  // Update layer state				
                if (e.target.checked) {
                    // Check if the layer is a Raster
                    if (Group === 'Raster' && geojson) {
                        loadPngOverlay(geojson, Layer);
                    } else if (Group === 'Base' && geojson) {
                        loadGeoJsonLayer(geojson, Layer);
                    }
                } else {
                    if (Group === 'Raster' && pngOverlays[Layer]) {
                        map.removeLayer(pngOverlays[Layer]);
                    } else if (geoJsonLayers[Layer]) {
                        map.removeLayer(geoJsonLayers[Layer]);
                    }
                }
            });

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = Layer;

            layerDiv.appendChild(checkbox);
            layerDiv.appendChild(label);
            databaseDiv.appendChild(layerDiv);
        });

        basePanel.appendChild(databaseDiv);
    });
}

// Function to load PNG overlay
function loadPngOverlay(url, layerName) {
    const southWest = [6.753572835, 80.4263826425084];
    const northEast = [7.47454951957935, 81.06883711];
    const imageBounds = [southWest, northEast];

    // Ensure the URL is defined and not empty
    if (!url) {
        console.error(`No URL provided for layer: ${layerName}`);
        return; // Exit if URL is invalid
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const imgUrl = URL.createObjectURL(blob);
            const overlay = L.imageOverlay(imgUrl, imageBounds, { opacity: 0.5 });
            pngOverlays[layerName] = overlay;
            overlay.addTo(map);
        })
        .catch(error => {
            console.error(`Error loading PNG overlay for layer ${layerName}:`, error);
        });
}

// Function to load GeoJSON layer
function loadGeoJsonLayer(url, layerName) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const geoJsonLayer = L.geoJSON(data);
            geoJsonLayers[layerName] = geoJsonLayer;
            geoJsonLayer.addTo(map);
        })
        .catch(error => {
            console.error(`Error loading GeoJSON layer for ${layerName}:`, error);
        });
}


// Function to activate buttons and fetch CSV for Proposal Layers
function activateProposalLayers() {
    const selectElement = document.getElementById('selectMWSID');
    const mwsID = selectElement.value;

    if (mwsID) {
        const csvFilePath = `https://raw.githubusercontent.com/MWS003-GIS/MWS003-GIS.github.io/main/IWWRMP/Data/EXD/MWS_${mwsID}/PropLayers_${mwsID}.csv`;

        fetch(csvFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(csvData => {
                Papa.parse(csvData, {
                    header: true,
                    complete: function (results) {
                        const data = results.data;
                        console.log("Parsed Proposal CSV data:", data);

                        const proposalData = data.filter(row => row.Group === 'Proposal');
                        const databaseLayers = {};
                        proposalData.forEach(row => {
                            const { Database, Layer, geojson } = row;
                            if (!databaseLayers[Database]) {
                                databaseLayers[Database] = [];
                            }
                            databaseLayers[Database].push({ Layer, geojson });
                        });

                        updateProposalPanel(databaseLayers);
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching the Proposal CSV file:', error);
            });
    } else {
        alert('Please select a valid MWS_ID.');
    }
}

// Generalized Function to update panels with checkboxes for Layers
function updateSidePanel(panelId, databaseLayers) {
    const panel = document.getElementById(panelId);
    panel.innerHTML = '';

    Object.keys(databaseLayers).forEach(databaseName => {
        const databaseDiv = document.createElement('div');
        const databaseTitle = document.createElement('h3');
        databaseTitle.textContent = databaseName;
        databaseDiv.appendChild(databaseTitle);

        databaseLayers[databaseName].forEach((layerInfo, index) => {
            const { Layer, geojson } = layerInfo;
            const layerDiv = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `layer_${panelId}_${index}`;
            //checkbox.checked = false;
            checkbox.checked = layerState[Layer] || false;  // Retrieve and set layer state			

            checkbox.addEventListener('change', e => {
                layerState[Layer] = e.target.checked;  // Update layer state				
                if (e.target.checked) {
                    if (geoJsonLayers[Layer]) {
                        geoJsonLayers[Layer].addTo(map);
                    } else {
                        loadGeoJsonLayer(geojson, Layer);
                    }
                } else {
                    if (geoJsonLayers[Layer]) {
                        map.removeLayer(geoJsonLayers[Layer]);
                    }
                }
            });

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = Layer;

            layerDiv.appendChild(checkbox);
            layerDiv.appendChild(label);
            databaseDiv.appendChild(layerDiv);
        });

        panel.appendChild(databaseDiv);
    });
}

// Function to load a single GeoJSON layer
function loadGeoJsonLayer(url, layerName) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(geojsonData => {
            const geoJsonLayer = L.geoJSON(geojsonData, {
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => updateInfoPanel(feature.properties));
                }
            });

            geoJsonLayers[layerName] = geoJsonLayer.addTo(map);
        })
        .catch(error => console.error(`Error loading GeoJSON for layer ${layerName}:`, error));
}

// Function to update the proposal panel with checkboxes for Proposal Layers by Database
function updateProposalPanel(databaseLayers) {
    const proposalPanel = document.getElementById('proposalPanel');
    proposalPanel.innerHTML = '';

    Object.keys(databaseLayers).forEach(databaseName => {
        const databaseDiv = document.createElement('div');
        const databaseTitle = document.createElement('h3');
        databaseTitle.textContent = databaseName;
        databaseDiv.appendChild(databaseTitle);

        databaseLayers[databaseName].forEach((layerInfo, index) => {
            const { Layer, geojson } = layerInfo;

            const layerDiv = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `proposal_layer_${databaseName}_${index}`;
            //checkbox.checked = false;
            checkbox.checked = layerState[Layer] || false;  // Retrieve and set layer state				

            checkbox.addEventListener('change', (e) => {
                layerState[Layer] = e.target.checked;  // Update layer state				
                if (e.target.checked) {
                    if (geoJsonLayers[Layer]) {
                        geoJsonLayers[Layer].addTo(map);
                    } else {
                        loadGeoJsonLayer(geojson, Layer);
                    }
                } else {
                    if (geoJsonLayers[Layer]) {
                        map.removeLayer(geoJsonLayers[Layer]);
                    }
                }
            });

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = Layer;

            layerDiv.appendChild(checkbox);
            layerDiv.appendChild(label);
            databaseDiv.appendChild(layerDiv);
        });

        proposalPanel.appendChild(databaseDiv);
    });
}














// Function to activate Climate Layers
function activateClimateLayers() {
    const selectElement = document.getElementById('selectMWSID');
    const mwsID = selectElement.value;

    if (mwsID) {
        const csvFilePath = `https://raw.githubusercontent.com/MWS003-GIS/MWS003-GIS.github.io/main/IWWRMP/Data/EXD/MWS_${mwsID}/ClimLayer.csv`;

        fetch(csvFilePath)
            .then(response => response.ok ? response.text() : Promise.reject('Network error'))
            .then(csvData => {
                Papa.parse(csvData, {
                    header: true,
                    complete: (results) => {
                        const data = results.data.filter(row => row.Group === 'Climate');
                        const layersByDatabase = {};
                        data.forEach(row => {
                            if (!layersByDatabase[row.Database]) layersByDatabase[row.Database] = [];
                            layersByDatabase[row.Database].push({
                                layerGroup: row.Group,
                                layerName: row.Layer,
                                geojsonUrl: row.geojson,
                                type: row.Type  // 'Raster' or 'GeoJSON'
                            });
                        });
                        updateClimatePanel(layersByDatabase);
                    }
                });
            })
            .catch(error => console.error('Error fetching the Climate CSV file:', error));
    } else {
        alert('Please select a valid MWS_ID.');
    }
}

// Function to update the climate panel with collapsible sections for each Database
function updateClimatePanel(layersByDatabase) {
    const climPanel = document.getElementById('climPanel');
    climPanel.innerHTML = '';

    Object.keys(layersByDatabase).forEach(database => {
        // Create a container for each database
        const databaseSection = document.createElement('div');
        databaseSection.className = 'database-section';

        // Create a collapsible button for the database
        const databaseHeader = document.createElement('button');
        databaseHeader.className = 'collapsible';
        databaseHeader.textContent = database;
        databaseHeader.addEventListener('click', function () {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });

        // Create a div to hold the layers, initially hidden
        const layerContainer = document.createElement('div');
        layerContainer.className = 'layer-content';
        layerContainer.style.display = 'none';

        // Add the layers to the collapsible content
        layersByDatabase[database].forEach((layerInfo, index) => {
            const { layerName, geojsonUrl, type } = layerInfo;

            const layerDiv = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `clim_layer_${database}_${index}`;
            checkbox.checked = layerState[layerName] || false; // Retrieve and set layer state

            checkbox.addEventListener('change', e => {
                layerState[layerName] = e.target.checked; // Update layer state
                if (e.target.checked) {
                    if (type === 'Raster') {
                        loadPngOverlay(geojsonUrl, layerName);
                    } else {
                        loadGeoJsonLayer(geojsonUrl, layerName);
                    }
                } else {
                    if (type === 'Raster' && pngOverlays[layerName]) {
                        map.removeLayer(pngOverlays[layerName]);
                    } else if (geoJsonLayers[layerName]) {
                        map.removeLayer(geoJsonLayers[layerName]);
                    }
                }
            });

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = layerName;

            layerDiv.appendChild(checkbox);
            layerDiv.appendChild(label);
            layerContainer.appendChild(layerDiv);
        });

        // Append the collapsible button and content to the panel
        databaseSection.appendChild(databaseHeader);
        databaseSection.appendChild(layerContainer);
        climPanel.appendChild(databaseSection);
    });
}

// Add CSS for the collapsible functionality
const style = document.createElement('style');
style.textContent = `
    .collapsible {
        background-color: #777;
        color: white;
        cursor: pointer;
        padding: 10px;
        width: 100%;
        text-align: left;
        border: none;
        outline: none;
        font-size: 15px;
    }

    .collapsible.active, .collapsible:hover {
        background-color: #555;
    }

    .layer-content {
        padding: 0 15px;
        display: none;
        overflow: hidden;
        background-color: #f1f1f1;
    }
`;
document.head.appendChild(style);

// Helper function to remove layer
function removeLayer(layerName, type) {
    if (type === 'Raster' && pngOverlays[layerName]) {
        map.removeLayer(pngOverlays[layerName]);
        delete pngOverlays[layerName];
    } else if (geoJsonLayers[layerName]) {
        map.removeLayer(geoJsonLayers[layerName]);
        delete geoJsonLayers[layerName];
    }
}

// Function to load PNG overlay
function loadPngOverlay(url, layerName) {
    if (pngOverlays[layerName]) return;  // Avoid duplicates

    const imageBounds = [[6.753572835, 80.4263826425084], [7.47454951957935, 81.06883711]];
    fetch(url)
        .then(response => response.ok ? response.blob() : Promise.reject('Error loading image'))
        .then(blob => {
            const imgUrl = URL.createObjectURL(blob);
            const overlay = L.imageOverlay(imgUrl, imageBounds, { opacity: 0.5 });
            pngOverlays[layerName] = overlay;
            overlay.addTo(map);
        })
        .catch(error => console.error(`Error loading PNG overlay for ${layerName}:`, error));
}

// Function to load GeoJSON layer
function loadGeoJsonLayer(url, layerName) {
    if (geoJsonLayers[layerName]) return;  // Avoid duplicates

    fetch(url)
        .then(response => response.ok ? response.json() : Promise.reject('Error loading GeoJSON'))
        .then(data => {
            const geoJsonLayer = L.geoJSON(data);
            geoJsonLayers[layerName] = geoJsonLayer.addTo(map);
        })
        .catch(error => console.error(`Error loading GeoJSON layer for ${layerName}:`, error));
}


// Function to load a single GeoJSON layer and add click events to display feature properties
function loadGeoJsonLayer(url, layerName) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(geojsonData => {
            const geoJsonLayer = L.geoJSON(geojsonData, {
                onEachFeature: (feature, layer) => {
                    layer.on('click', () => updateInfoPanel(feature.properties));  // Add click event to show properties
                }
            });

            geoJsonLayers[layerName] = geoJsonLayer.addTo(map);
        })
        .catch(error => console.error(`Error loading GeoJSON for layer ${layerName}:`, error));
}

// Function to update the attribute panel with properties of the clicked feature
function updateInfoPanel(properties) {
    const attributePanel = document.getElementById('attributePanel');
    attributePanel.innerHTML = '';  // Clear previous content

    // Create a list to display properties
    const list = document.createElement('ul');
    
    // Loop through properties and display each attribute
    for (const [key, value] of Object.entries(properties)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${key}: ${value}`;
        list.appendChild(listItem);
    }
    
    attributePanel.appendChild(list);  // Append list to the attribute panel
}



// Event listeners for button clicks to activate layers
document.getElementById('baseLayersBtn').addEventListener('click', activateBaseLayers);
document.getElementById('proposalBtn').addEventListener('click', activateProposalLayers);
document.getElementById('climateLayerBtn').addEventListener('click', activateClimateLayers);

