

// Function to load XLSX and display it as a table in the infoPanel
document.getElementById('mwsInfoBtn').addEventListener('click', function () {
    const selectElement = document.getElementById('selectMWSID');
    const mwsID = selectElement.value;

    if (mwsID) {
        //const xlsxFilePath = `https://raw.githubusercontent.com/MWS003-GIS/MWS003-GIS.github.io/main/IWWRMP/Data/EXD/MWS_${mwsID}/gcp_${mwsID}.xlsx`;
		const xlsxFilePath = 'https://raw.githubusercontent.com/MWS003-GIS/MWS003-GIS.github.io/main/IWWRMP/Data/EXD/Pathahewaheta_name%20lists.xlsx';

        // Fetch the .xlsx file
        fetch(xlsxFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.arrayBuffer(); // Get the file as an array buffer
            })
            .then(arrayBuffer => {
                // Use SheetJS to read the .xlsx file
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });

                // Get the first sheet's name
                const firstSheetName = workbook.SheetNames[1];

                // Get the first sheet's data
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName], { header: 1 });

                // Generate and display the table
                displayTable(sheetData);
            })
            .catch(error => {
                console.error('Error fetching the XLSX file:', error);
            });
    } else {
        alert('Please select a valid MWS_ID.');
    }
});

// Function to display parsed XLSX data as a table
function displayTable(sheetData) {
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

    // Assuming the first row of the sheet is the header row
    const keys = sheetData[0]; // First row contains the headers
    keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });

    // Create the table body
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    // Populate the table with data (skip the first row, which is the header)
    for (let i = 1; i < sheetData.length; i++) {
        const row = sheetData[i];
        const tr = tbody.insertRow();

        row.forEach(cellData => {
            const td = tr.insertCell();
            td.textContent = cellData || ''; // Add cell data or empty string if undefined
        });
    }

    // Append the table to the infoPanel
    infoPanel.appendChild(table);
}
