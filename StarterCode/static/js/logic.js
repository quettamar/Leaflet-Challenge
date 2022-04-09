// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var geojson;

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Name: ${feature.properties.title}</h3><hr><p><h4>Magnitude: ${feature.properties.mag}</h4><p><h4>Depth: ${feature.geometry.coordinates[2]}km</h4>`);
    }

    function style(feature) {
        var calculatedSize = (feature.properties.mag * 4);
        var adjustedColor;
        var depth = feature.geometry.coordinates[2];
        console.log(depth)
        if (depth > 100) adjustedColor = "#4A148C";
        else if (depth > 80) adjustedColor = "#8E24AA";
        else if (depth > 60) adjustedColor = "blue";
        else if (depth > 40) adjustedColor = "green";
        else if (depth > 20) adjustedColor = "yellow";
        else if (depth > 0) adjustedColor = "orange";
        else adjustedColor = "red";

        return {
            fillOpacity: 1,
            color: "white",
            fillColor: adjustedColor,
            radius: calculatedSize
        }
    }

    console.log(earthquakeData);
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlong) {
            return L.circleMarker(latlong);
        },
        style: style,
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

// Store our API endpoint as queryUrl.
var platequeryUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

console.log(tectonicPlateData);
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
var techtonicplates = L.geoJSON(tectonicPlateData);

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    
    var tectonicplates = L.layerGroup()

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicplates
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, topo]
    });
    
    d3.json(platequeryUrl).then(function (data) {
        L.geoJSON(data).addTo(tectonicplates)
        tectonicplates.addTo(myMap)        
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "info legend");

        div.innerHTML += "<h4>Earthquake Depth (km)</h4>";
        div.innerHTML += '<i style="background: #FF0000"></i><span>Above sea-level</span><br>';
        div.innerHTML += '<i style="background: #FF5722"></i><span>0-19</span><br>';
        div.innerHTML += '<i style="background: #FFEB3B"></i><span>20-39</span><br>';
        div.innerHTML += '<i style="background: #4CAF50"></i><span>40-59</span><br>';
        div.innerHTML += '<i style="background: #1E88E5"></i><span>60-79</span><br>';
        div.innerHTML += '<i style="background: #8E24AA"></i><span>80-99</span><br>';
        div.innerHTML += '<i style="background: #4A148C"></i><span>100+</span><br>';


        return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);

}
