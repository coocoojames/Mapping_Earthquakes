console.log('Working!');

let cityData = cities;

let map = L.map('mapID').setView([36.1733, -120.1794], 7);

let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: api_key
});

streets.addTo(map);

let marker = L.marker([34.0522, -118.2437]).addTo(map);

cityData.forEach(function(city) {
    console.log(city)
    L.circleMarker(city.location, {radius: city.population/100000, color: 'black', fillColor: '#f03'})
    .bindPopup('<h2>' + city.city + ', ' + city.state + '</h2> <hr> <h3>Population: ' + city.population).addTo(map);
});

let circle = L.circleMarker([34.0522, -118.2437], {radius: 100}).addTo(map);

let line = [
    [33.9416, -118.4085],
    [37.6213, -122.3790]
];
let polyline = L.polyline(line, {
    color: 'red'
}).addTo(map);
console.log('Still workin baby!');