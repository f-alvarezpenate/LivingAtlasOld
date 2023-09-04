// adds a marker to the geojson file
function addFeature(){
    // get form input
    // not working. Input is not being obtained successfully.
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value;
    const longitude = Number(document.getElementById("longitude").value);
    const latitude = Number(document.getElementById("latitude").value);

    // need to add some input checking in the future before adding the feature. 
    fetch('https://api.mapbox.com/datasets/v1/f-alvarezpenate/clgpynyxk0sab2ao5sbuv0xxx/features?access_token=pk.eyJ1IjoiZi1hbHZhcmV6cGVuYXRlIiwiYSI6ImNsZWh0ZXB6cTB5YnIzcW16NTJ5OGpvbGMifQ.0e-hIYt1VVSoRXujuzJnMA')
    .then(response => response.json())
    .then(data => {
        // Create a new feature object with properties and coordinates
        const newFeature = 
        {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [longitude, latitude]},
        "properties": {"title": title, "description": description, "category": category}
        };

        // Add the new feature object to the features array
        data.features.push(newFeature);
        // Log the updated GeoJSON data to the console
        // doesn't actually update the file. Need to figure out how to do that.
        console.log(data);
    });
}