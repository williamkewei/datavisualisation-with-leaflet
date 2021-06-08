// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
var myMap = L.map("map", {
  center: [45.52, -122.67],
  zoom: 11
});

//Adding a tile layer(background map image) to our map
// we use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// The USGS provides earthquake data in a number of different formats, updated every 5 minutes. Visit the USGS GeoJSON Feed page and pick a data set to visualize
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
function getcolor(mag){
var color = ""
 
  if (mag >5){color ="#ea2c2c"}

  else if (mag >4){
    color ="#ea822c"
  }
  else if (mag >3){
    color = "#ee9c00"
  }
  else if (mag >2){
    color = "#eecc00"
  }
  else if (mag >1){
    color = "#d4ee00"
  }
  else {
    color = "#98ee00"
  }return color
}
function getlabel(mag){
  var label = ""
   
    if (mag >5){label ="5+"}
  
    else if (mag >4){
      label ="4-5"
    }
    else if (mag >3){
      label = "3-4"
    }
    else if (mag >2){
      label = "2-3"
    }
    else if (mag >1){
      label = "1-2"
    }
    else {
      label = "0-1"
    }return label
  }
d3.json(queryUrl).then(function(data){
  // console.log(data);
  for (var i=0; i <data.features.length; i++){
    coords = [data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]];
    // console.log(coords)
  mag = data.features[i].properties.mag
  place = data.features[i].properties.place;


  L.circle(coords, {
    fillOpacity: 0.75,
    color: "black",
    fillColor: getcolor(mag),
    // Adjust radius
    radius:  10000*mag
  }).bindPopup("<h3>" + place + "</h3>" + "<hr>" + "Magnitude:"+mag ).addTo(myMap);
}

var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  const grades = [0.5,1.5,2.5,3.5,4.5,5.5]
  const labels = []

 grades.forEach(function(mag) { 
    labels.push("<li style=\"background-color: " + getcolor(mag) + "\">"+getlabel(mag) +"</li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Adding legend to the map
legend.addTo(myMap);
}
)
