// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
createFeatures(data.features);
});

// function markerSize(magnitude) {
//     return (magnitude) * 50;
//   }

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Name: ${feature.properties.title}</h3><hr><p><h4>Magnitude: ${feature.properties.mag}</h4>`);
}

function style(feature){
    var calculatedSize = (feature.properties.mag*3);
    var adjustedColor;
    var depth = feature.geometry.coordinates[2];
    console.log(depth)
        if (depth >100) adjustedColor = "red";
        else if (depth >80) adjustedColor = "orange";
        else if (depth >60) adjustedColor = "yellow";
        else if (depth >40) adjustedColor = "green";
        else if (depth >20) adjustedColor = "blue";
        else adjustedColor = "purple";

    return {
            fillOpacity: 0.75,
            color: adjustedColor,
            fillColor: adjustedColor,
            // Setting our circle's radius to equal the output of our markerSize() function:
            // This will make our marker's size proportionate to its population.
            radius: calculatedSize
        }
    }

console.log(earthquakeData);
// Create a GeoJSON layer that contains the features array on the earthquakeData object.
// Run the onEachFeature function once for each piece of data in the array.
var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlong){
        return L.circleMarker(latlong);
    }, 
    style: style,
});

// Send our earthquakes layer to the createMap function/
createMap(earthquakes);
}

// // Store our API endpoint as queryUrl.
// var platequeryUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// // Perform a GET request to the query URL/
// d3.json(platequeryUrl).then(function (data) {
//   // Once we get a response, send the data.features object to the createFeatures function.
// createFeatures(data.features);
// });

// function createFeatures(tectonicPlateData) {

// //console.log(tectonicPlateData);
// // Create a GeoJSON layer that contains the features array on the earthquakeData object.
// // Run the onEachFeature function once for each piece of data in the array.
// var techtonicplates = L.geoJSON(tectonicPlateData);

// // Send our earthquakes layer to the createMap function/
// createMap(techtonicplates);
// }

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // var tectonic = L.tileLayer('')

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        "Earthquakes": earthquakes
        // "Tectonic Plates": techtonicplates
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 5,
        layers: [street, topo]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

//     // Set up the legend.
//     var legend = L.control({ position: "bottomright" });
//     legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = geojson.options.limits;
//     var colors = geojson.options.colors;
//     var labels = [];

//     // Add the minimum and maximum.
//     var legendInfo = "<h1>Median Income</h1>" +
//     "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//       "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function(limit, index) {
//       labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
//   };

//   // Adding the legend to the map
//   legend.addTo(myMap);

}
