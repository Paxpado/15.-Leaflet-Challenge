// Store our API endpoint as queryURL
const eq = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create our map, giving it the streetmap and earthquakes layers to display on load.
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Perform a GET request to the query URL/
d3.json(eq).then(function (data) {

  // Marker feature and style
  function styleMarker(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: colorMarker(feature.properties.mag),
      color: "#000000",
      radius: radiusMarker(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Color by depth
  function colorMarker(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#ea2c2c";
      case magnitude > 4:
        return "#ea822c";
      case magnitude > 3:
        return "#ee9c00";
      case magnitude > 2:
        return "#eecc00";
      case magnitude > 1:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }

  // radius by magnitude
  function radiusMarker(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleMarker,
    // Give each feature a popup that describes the place and time of the earthquake.
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><hr><h3>Date: ${new Date(feature.properties.time)}</h3><hr><h3>Place: ${feature.properties.place}</h3>`);
    }
  }).addTo(myMap);

  // Create a legend
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  var legend_info = L.control({
    position: "bottomright"
  });

  // When the layer control is added, insert a div with the class of "legend".
  legend_info.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend_info.addTo(myMap);
});

