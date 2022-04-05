var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 2
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
    console.log(data);
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${(feature.properties.mag)}</p>`);
    
    }

// Create a GeoJSON layer that contains the features array on the earthquakeData object.
// Run the onEachFeature function once for each piece of data in the array.
var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
    });

console.log(earthquakeData);

// var marker = L.marker(earthquakeData).bindPopup("Name: " + title + "</br>" + "Description: " + description );;
//   marker.feature = {};
//   marker.feature.type = 'Feature';    // Correction, thanks to @Manard82
//   marker.feature.properties = {};
//   marker.feature.properties.title = title;
//   marker.feature.properties.mag = description;
//   marker.addTo(myMap);
// Send our earthquakes layer to the createMap function/
createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  

  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
}).addTo(myMap);

}
