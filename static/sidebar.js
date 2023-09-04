document.addEventListener("DOMContentLoaded", function () {
    fetch("../GEOjson/markers.json")
        .then(response => response.json())
        .then(data => {
            // Assuming data is an array of objects
            const jsonDataContainer = document.getElementById("json-data");

            // Loop through the data and create HTML elements to display it
            data.features.forEach(item => {
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `<ul>
                    <h2>${item.properties.description}</h2>
                    <p>Location: ${item.properties.title}</p>
                    <p>Category: ${item.properties.category}</p>
                    </ul>
                `;
                jsonDataContainer.appendChild(card);
            });
        })
        .catch(error => console.error("Error loading JSON:", error));
})



