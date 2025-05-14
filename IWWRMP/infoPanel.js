// Function to load CSV and display it as a table in the infoPanel
document.getElementById('mwsInfoBtn').addEventListener('click', function () {
    const selectElement = document.getElementById('selectMWSID');
    const mwsID = selectElement.value;

    if (mwsID) {
        const csvFilePath = `https://raw.githubusercontent.com/MWS003-GIS/MWS003-GIS.github.io/main/IWWRMP/Data/EXD/MWS_${mwsID}/gcp_${mwsID}.csv`;

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

                        // Generate and display the table
                        displayTable(data);
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

// Function to display parsed CSV data as a table
function displayTable(data) {
    const infoPanel = document.getElementById('infoPanel');
    infoPanel.innerHTML = ''; // Clear any existing content

    // Create a table
    const table = document.createElement('table');
    table.border = "1";
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    // Create the table header
    const header = table.createTHead();
    const headerRow = header.insertRow(0);

    // Assuming all rows have the same keys, use the first row for headers
    const keys = Object.keys(data[0]);
    keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });

    // Create the table body
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    // Populate the table with data
    data.forEach(row => {
        const tr = tbody.insertRow();

        keys.forEach(key => {
            const td = tr.insertCell();
            td.textContent = row[key] || ''; // Add cell data or empty string if undefined
        });
    });

    // Append the table to the infoPanel
    infoPanel.appendChild(table);
}
