// Seeing if the script is in fact imported
console.log('Working!');

let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: api_key
});

let sat = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: api_key
});

let dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: api_key
})

let baseMaps = {
    'Street View': streets,
    'Satellite View': sat,
    'Dark View': dark
};

let map = L.map(mapID, {
    center: [39.5, -98.5],
    zoom: 4,
    layers: [streets]
});

let earthquakes = new L.layerGroup();
let tec = new L.layerGroup();
let majah = new L.layerGroup();

let overlays = {
    Earthquakes: earthquakes,
    'Tectonic Plates': tec,
    'Major Earthquakes': majah
}

L.control.layers(baseMaps, overlays).addTo(map);

function getColor(magnitude) {
    if (magnitude > 6) {
        return '#FF4500'
    }
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

    const magnitudes = [0, 1, 2, 3, 4, 5, 6];
    const colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c", '#FF4500'];

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
            return L.circleMarker(latlng).bindPopup('<h2> Magnitude: ' + feature.properties.mag + '</h2> <hr> <h3>' 
            + feature.properties.place + '</h3>')
        },
        // Creating listner to change popup to hoverstate.
        // Code borrowed and modified from: https://gis.stackexchange.com/questions/31951/showing-popup-on-mouse-over-not-on-click-using-leaflet
        onEachFeature: (feature, layer) => {
            layer.on({
                mouseover: function(event) {
                    this.openPopup();
                },
                mouseout: function(event) {
                    this.closePopup();
                }
            })
        }
    }).addTo(earthquakes);
    earthquakes.addTo(map);
})

let tecPlates = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json';
d3.json(tecPlates).then((data) => {
    console.log(data);
    L.geoJSON(data, {
        style: {weight: 5},
        onEachFeature: (feature, layer) => {
            layer.bindPopup('<h2> Plate Name: ' + feature.properties.Name + '</h2>')
        }
    }).addTo(tec);
    tec.addTo(map);
});

let majQuakes = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';
d3.json(majQuakes).then((data) => {
    console.log(data);
    L.geoJSON(data, {
        style: weirdStyle,
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng).bindPopup('<h2> Magnitude: ' + feature.properties.mag + '</h2> <hr> <h3>' 
            + feature.properties.place + '</h3>')
        },
        // Creating listner to change popup to hoverstate.
        // Code borrowed and modified from: https://gis.stackexchange.com/questions/31951/showing-popup-on-mouse-over-not-on-click-using-leaflet
        onEachFeature: (feature, layer) => {
            layer.on({
                mouseover: function(event) {
                    this.openPopup();
                },
                mouseout: function(event) {
                    this.closePopup();
                }
            });
    }}).addTo(majah);
    majah.addTo(map)
})

// Seeing if code breaks
console.log("Still workin' baby!");