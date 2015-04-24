L.mapbox.accessToken = 'pk.eyJ1IjoibGVhZHplcHBlbGluIiwiYSI6ImxyeHZRUHMifQ.obfdZ8F3spoiO0svHGPKQA';
var map = L.mapbox.map('map', 'leadzeppelin.ff24f216', { zoomControl: false });
new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

map.featureLayer.on('ready', function() {
  var markers = [];

  // Cache all of the markers
  map.featureLayer.eachLayer(function(l) {
    markers.push(l);
    l.setOpacity(0); // initially hide all markers
  });

  // Create a new line with no segments yet and add it to the map.
  var polyline = L.polyline([], { color: '#009fbf'}).addTo(map);

  draw();

  function draw() {
    // add a coordinate to the line
    polyline.addLatLng(markers[0].getLatLng());

    // make the marker visible again
    markers[0].setOpacity(1).update();

    // pan to the newest marker
    map.panTo(markers[0].getLatLng());

    // if this is the last marker (current location), open the popup
    if (markers.length == 1) markers[0].openPopup();

    // Shift (delete) the top marker
    markers.shift();

    // keep draw()ing until we run out of markers
    if (markers.length) window.setTimeout(draw, 500);
  }
});
