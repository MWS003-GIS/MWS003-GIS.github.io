const mwsID = '003'; // Replace with the actual value of mwsID
const csvFilePath = `https://raw.githubusercontent.com/MWS003-GIS/MWS003-GIS.github.io/main/IWWRMP/Data/EXD/MWS_${mwsID}/datalayer_${mwsID}.csv`; // Dynamic CSV path
let allData = []; // To store the parsed CSV data

// Fetch and parse the CSV file
fetch(csvFilePath)
    .then(response => response.text())
    .then(csvText => {
        Papa.parse(csvText, {
            header: true, // CSV has headers
            complete: function(results) {
                allData = results.data; // Store all data
                populateDropdowns(allData); // Populate dropdown filters
                displayData(allData); // Initially display all data
            }
        });
    });

// Function to populate dropdowns with unique values from each column
function populateDropdowns(data) {
    const idSet = new Set();
    const databaseSet = new Set();
    const layerSet = new Set();
    const providerSet = new Set();

    data.forEach(row => {
        idSet.add(row.ID);
        databaseSet.add(row.Database);
        layerSet.add(row.Layer);
        providerSet.add(row['Data provider']);
    });

    populateDropdown('filterID', idSet);
    populateDropdown('filterDatabase', databaseSet);
    populateDropdown('filterLayer', layerSet);
    populateDropdown('filterProvider', providerSet);
}

// Helper function to populate a dropdown with unique values
function populateDropdown(dropdownID, valueSet) {
    const dropdown = document.getElementById(dropdownID);
    valueSet.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        dropdown.appendChild(option);
    });
}

// Function to display the CSV data in the table
function displayData(data) {
    const tableBody = document.querySelector('#csvTable tbody');
    tableBody.innerHTML = ''; // Clear the table body before populating it

    data.forEach(row => {
        const tr = document.createElement('tr');
        
        // Create cells for the first 4 columns (ID, Database, Layer, Data provider)
        const colsToShow = [row.ID, row.Database, row.Layer, row['Data provider']];
        colsToShow.forEach(col => {
            const td = document.createElement('td');
            td.textContent = col;
            tr.appendChild(td);
        });

        // Add the download button for the 5th column (Download-SHP)
        const downloadLink = row['Download-SHP'];
        const td = document.createElement('td');
        const button = document.createElement('button');
        button.textContent = "Download SHP";
        button.onclick = function() {
            window.open(downloadLink, '_blank');
        };
        td.appendChild(button);
        tr.appendChild(td);

        tableBody.appendChild(tr);
    });
}

// Add event listeners to dropdown filters for filtering
document.getElementById('filterID').addEventListener('change', filterTable);
document.getElementById('filterDatabase').addEventListener('change', filterTable);
document.getElementById('filterLayer').addEventListener('change', filterTable);
document.getElementById('filterProvider').addEventListener('change', filterTable);

// Function to filter the table based on dropdown selection
function filterTable() {
    const filterID = document.getElementById('filterID').value;
    const filterDatabase = document.getElementById('filterDatabase').value;
    const filterLayer = document.getElementById('filterLayer').value;
    const filterProvider = document.getElementById('filterProvider').value;

    // Filter the data based on the selected dropdown values
    const filteredData = allData.filter(row => {
        return (
            (!filterID || row.ID === filterID) &&
            (!filterDatabase || row.Database === filterDatabase) &&
            (!filterLayer || row.Layer === filterLayer) &&
            (!filterProvider || row['Data provider'] === filterProvider)
        );
    });

    // Display the filtered data
    displayData(filteredData);
}
