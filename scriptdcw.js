document.addEventListener('DOMContentLoaded', function() {
    const data = jsonData;
    const menu = document.getElementById('menu');
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const popupClose = document.getElementById('popup-close');

    function createTree(data) {
        const tree = document.createElement('ul');

        data.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('tree-item');
            
            const title = document.createElement('span');
            title.textContent = `${item.main} - ${item.Type}`;
            li.appendChild(title);

            // Create metadata link
            const metadataLink = document.createElement('a');
            metadataLink.href = '#';
            metadataLink.textContent = 'Metadata';
            metadataLink.addEventListener('click', function(event) {
                event.preventDefault();
                showPopup(item);
            });
            li.appendChild(metadataLink);

            // Create link
            const link = document.createElement('a');
            link.href = item.Link;
            link.textContent = 'View on Map';
            link.target = '_blank';
            li.appendChild(link);

            // Add sub-items
            const subUl = document.createElement('ul');
            const subLi = document.createElement('li');
            subLi.textContent = item.Sub;
            subUl.appendChild(subLi);

            li.appendChild(subUl);
            tree.appendChild(li);
        });

        return tree;
    }

    function showPopup(item) {
        let content = '<h2>Metadata</h2>';
        for (const [key, value] of Object.entries(item)) {
            if (key && key !== 'main' && key !== 'Type' && key !== 'Sub' && key !== 'Link') {
                content += `<p><strong>${key}:</strong> ${value}</p>`;
            }
        }
        popupContent.innerHTML = content;
        popup.classList.remove('hidden');
    }

    popupClose.addEventListener('click', function() {
        popup.classList.add('hidden');
    });

    menu.appendChild(createTree(data));
});
