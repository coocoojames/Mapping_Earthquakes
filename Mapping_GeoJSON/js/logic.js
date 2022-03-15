console.log('Working!');

let cityData = cities;

let map = L.map('mapID').setView([37.5, -122.5], 10);

let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: api_key
});

streets.addTo(map);

let SFAirport =
{"type":"FeatureCollection","features":[{
    "type":"Feature",
    "properties":{
        "id":"3469",
        "name":"San Francisco International Airport",
        "city":"San Francisco",
        "country":"United States",
        "faa":"SFO",
        "icao":"KSFO",
        "alt":"13",
        "tz-offset":"-8",
        "dst":"A",
        "tz":"America/Los_Angeles"},
        "geometry":{
            "type":"Point",
            "coordinates":[-122.375,37.61899948120190]}}
]};

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

// onEachFeature function
L.geoJSON(SFAirport, {
    onEachFeature: function(feature, layer) {
        console.log(layer);
        layer.bindPopup('<h2> Airport Code: ' + feature.properties.faa + '</h2>');
    }
}).addTo(map);

// 
console.log('Still workin baby!');