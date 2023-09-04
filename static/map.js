// File containing all of the map's front end
mapboxgl.accessToken = 'pk.eyJ1IjoiZi1hbHZhcmV6cGVuYXRlIiwiYSI6ImNsZWh0ZXB6cTB5YnIzcW16NTJ5OGpvbGMifQ.0e-hIYt1VVSoRXujuzJnMA'; // Flavio's access token

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-117.181738, 46.729777], // Longitude, Langitude for Pullman as of now
    zoom: 9
});

// Just ADDED, search funtionality on the map (will also work for coordinates input)

// Given a query in the form "lng, lat" or "lat, lng"
// returns the matching geographic coordinate(s)
const coordinatesGeocoder = function (query) {

    // Match anything which looks like
    // decimal degrees coordinate pair.
    const matches = query.match(/^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i);
    if (!matches) {
        return null;
    }

    function coordinateFeature(lng, lat) {
        return {
            center: [lng, lat],
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            },

            place_name: 'Lat: ' + lat + ' Lng: ' + lng,
            place_type: ['coordinate'],
            properties: {},
            type: 'Feature'
        };
    }

    const coord1 = Number(matches[1]);
    const coord2 = Number(matches[2]);
    const geocodes = [];

    if (coord1 < -90 || coord1 > 90) {
        // must be lng, lat
        geocodes.push(coordinateFeature(coord1, coord2));
    }

    if (coord2 < -90 || coord2 > 90) {
        // must be lat, lng
        geocodes.push(coordinateFeature(coord2, coord1));
    }

    if (geocodes.length === 0) {
        // else could be either lng, lat or lat, lng
        geocodes.push(coordinateFeature(coord1, coord2));
        geocodes.push(coordinateFeature(coord2, coord1));
    }
        return geocodes;
    };

    // Search
    map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        // zoom: 6,
        placeholder: 'Address or LAT, LONG',
        mapboxgl: mapboxgl,
        reverseGeocode: true,
        marker:{
            color: 'green'
        }
    })
);

const layerList = document.getElementById('menu');
const inputs = layerList.getElementsByTagName('input');

for (const input of inputs) {
    input.onclick = (layer) => {
        const layerId = layer.target.id;
        map.setStyle('mapbox://styles/mapbox/' + layerId);
    };
}

// DOES NOT WORK ON FIREFOX BECAUSE OF FETCH(), NEED TO FIND ALT
const allMarkers = []
// when we start plotting actual data, we should load it as an external source rather than adding it inline
fetch('https://api.mapbox.com/datasets/v1/f-alvarezpenate/clgpynyxk0sab2ao5sbuv0xxx/features?access_token=pk.eyJ1IjoiZi1hbHZhcmV6cGVuYXRlIiwiYSI6ImNsZWh0ZXB6cTB5YnIzcW16NTJ5OGpvbGMifQ.0e-hIYt1VVSoRXujuzJnMA')
    .then(response => response.json())
    .then(data => {
        // Assign the parsed GeoJSON data to a variable
        for (let i = 0; i < data.features.length; i++){
            const feature = data.features[i];
            
            const el = document.createElement('div');
            el.className = 'marker';

            // make a marker for each feature and add it to the map
            var x = new mapboxgl.Marker(el)
            x.setLngLat(feature.geometry.coordinates)
            x.setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                .setHTML( //Attach popups to markers
                    `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                )

            )
            x.addTo(map);

            // Add a click event listener to the marker so that it will toggle the sidenav when it's pressed
            el.addEventListener('click', () => {
                toggleSidebar();
            });

            allMarkers.push([feature.properties.category, feature.geometry.coordinates])
        }
});

map.on('load', () => {
   // Add urban areas data onto the map (using fill)
    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style.
    let firstSymbolId;
    for (const layer of layers) {
        if (layer.type === 'symbol') {
            firstSymbolId = layer.id;
            break;
        }
    }
    
    // this is some sample data from a different source our clients gave us to check if that we could display it on the map.
    map.addSource('urban-areas', {
        'type': 'geojson',
        'data': 'https://github.com/f-alvarezpenate/MarkerDataLivingAtlas/blob/main/Washington_State_City_Urban_Growth_Areas.geojson'
    });

    map.addLayer({
        'id': 'urban-areas-fill',
        'type': 'fill',
        'source': 'urban-areas',
        'layout': {},
        'paint': {
        'fill-color': 'red',
        'fill-opacity': 0.4
        }
        // This is the important part of this example: the addLayer
        // method takes 2 arguments: the layer as an object, and a string
        // representing another layer's name. If the other layer
        // exists in the style already, the new layer will be positioned
        // right before that layer in the stack, making it possible to put
        // 'overlays' anywhere in the layer stack.
        // Insert the layer beneath the first symbol layer.
    }, firstSymbolId);

    // Add an event listener to the urban-areas-fill for when we click on it
    map.on('click', 'urban-areas-fill', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['urban-areas-fill']
        });

        if (!features.length) {
            return;
        }
        const feature = features[0];
        // We display a pop for the important description of the urban area
        new mapboxgl.Popup({ offset: 100 })
            .setLngLat(e.lngLat)
            .setHTML(`
                        <h3><strong>${feature.properties.CITY_NM}</h3></strong>
                        <ul><strong>OBJECTID:</strong> ${feature.properties.OBJECTID}</ul>
                        <ul><strong>UGA_NM:</strong> ${feature.properties.UGA_NM}</ul>
                        <ul><strong>UGA_NM2:</strong> ${feature.properties.UGA_NM2}</ul>
                        <ul><strong>COUNTY_NM:</strong> ${feature.properties.COUNTY_NM}</ul>
                        <ul><strong>GMA:</strong> ${feature.properties.GMA}</ul>
                        <ul><strong>FIPS_PLC:</strong> ${feature.properties.FIPS_PLC}</ul>
                        <ul><strong>INCORP:</strong> ${feature.properties.INCORP}</ul>
                        <ul><strong>ORIGIN:</strong> ${feature.properties.ORIGIN}</ul>
                        <ul><strong>DATEMOD:</strong> ${feature.properties.DATEMOD}</ul>
                    `)
            .addTo(map);
    });

    // We change the cursor to a pointer when hovering over urban areas
    map.on('mouseenter', 'urban-areas-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // We change the cursor back to the default if not hover over
    map.on('mouseleave', 'urban-areas-fill', () => {
        map.getCanvas().style.cursor = '';
    });
    // the conversion of the .shp files for streams into a geojson did not succeed. Need to consult clients. Coordinates are very off.
    // map.addSource('streams', {
    //     'type': 'geojson',
    //     'data': '../GEOjson/streams_example.geojson'
    // });
    // map.addLayer({
    //     'id': 'streams-fill',
    //     'type': 'fill',
    //     'source': 'streams',
    //     'layout': {},
    //     'paint': {
    //     'fill-color': 'blue',
    //     'fill-opacity': 0.4
    //     }
    // }, firstSymbolId);
});

// Polygon tool
const draw = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
        polygon: true,
        trash: true
    }
});

map.addControl(draw);

map.on('draw.create', updateMarkers);
map.on('draw.delete', updateMarkers);
map.on('draw.update', updateMarkers);

// Add full screen function to the map
map.addControl(new mapboxgl.FullscreenControl(), 'top-left');

// Add zoom function to the map
map.addControl(new mapboxgl.NavigationControl(), 'top-left');

// Add current location (user's)
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },

        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
        }), 'top-left'
);
