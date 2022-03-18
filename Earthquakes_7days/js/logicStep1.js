console.log('Working!');

// let cityData = cities;

// let map = L.map('mapID').setView([30, 30], 2);


let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: api_key
});

// streets.addTo(map);

let sat = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: api_key
});

let baseMaps = {
    'Street View': streets,
    'Satellite View': sat
};

let map = L.map(mapID, {
    center: [39.5, -98.5],
    zoom: 4,
    layers: [streets]
});

let earthquakes = new L.layerGroup();

let overlays = {
    Earthquakes: earthquakes
}

L.control.layers(baseMaps, overlays).addTo(map);

// let SFAirport =
// {"type":"FeatureCollection","features":[{
//     "type":"Feature",
//     "properties":{
//         "id":"3469",
//         "name":"San Francisco International Airport",
//         "city":"San Francisco",
//         "country":"United States",
//         "faa":"SFO",
//         "icao":"KSFO",
//         "alt":"13",
//         "tz-offset":"-8",
//         "dst":"A",
//         "tz":"America/Los_Angeles"},
//         "geometry":{
//             "type":"Point",
//             "coordinates":[-122.375,37.61899948120190]}}
// ]};

// // PointToLayer function
// L.geoJSON(SFAirport, {
//     pointToLayer: (feature, latlng) => {
//         console.log(feature);
//         console.log(latlng);
//         return L.marker(latlng)
//         .bindPopup('<h1>' + feature.properties.name + '</h1> <hr> <h3>' 
//         + feature.properties.city + ', ' + feature.properties.country + '</h3>');
//     }
// }).addTo(map);

// // onEachFeature function
// L.geoJSON(SFAirport, {
//     onEachFeature: function(feature, layer) {
//         console.log(layer);
//         layer.bindPopup('<h2> Airport Code: ' + feature.properties.faa + '</h2>');
//     }
// }).addTo(map);

function getColor(magnitude) {
    if (magnitude > 5) {
        return '#ea2c2c';
    }
    else if (magnitude > 4) {
        return '#ea822c';
    }
    else if (magnitude > 3) {
        return '#ee9c00';
    }
    else if (magnitude > 2) {
        return '#eecc00';
    }
    else if (magnitude > 1) {
        return '#d4ee00';
    }
    return '#98ee00';
}

function getMag(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4
}

function weirdStyle(blah) {
    return {
        color: '#ffffa1',
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(blah.properties.mag),
        radius: getMag(blah.properties.mag),
        stroke: true,
        weight: 0.5
}};

let legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');

    const magnitudes = [0, 1, 2, 3, 4, 5];
    const colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " + 
        magnitudes[i] + (magnitudes[i+1] ? '&ndash;' + magnitudes[i+1] + '<br>' : '+');
    };
    return div;
};
legend.addTo(map);

let quakes = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
d3.json(quakes).then((data) => {
    console.log(data);
    L.geoJSON(data, {
        // color: '#ffffa1',
        // weight: 2,
        style: weirdStyle,
        pointToLayer: (feature, latlng) => {
            console.log(latlng)
            return L.circleMarker(latlng)
        },
        onEachFeature: (feature, layer) => {
            console.log(layer);
            layer.bindPopup('<h2> Magnitude: ' + feature.properties.mag + '</h2> <hr> <h3>' 
            + feature.properties.place + '</h3>')
        }
    }).addTo(earthquakes);
    earthquakes.addTo(map);
})



console.log('Still workin baby!');