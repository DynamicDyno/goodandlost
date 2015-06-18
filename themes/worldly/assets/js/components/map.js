if (document.getElementById("map")) {
  L.mapbox.accessToken = 'pk.eyJ1IjoibGVhZHplcHBlbGluIiwiYSI6ImxyeHZRUHMifQ.obfdZ8F3spoiO0svHGPKQA';
  var map = L.mapbox.map('map', 'leadzeppelin.ff24f216', { zoomControl: false });
  new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

  // MIT-licensed code by Benjamin Becquet
  // https://github.com/bbecquet/Leaflet.PolylineDecorator
  L.RotatedMarker = L.Marker.extend({
    options: { angle: 0 },
    _setPos: function(pos) {
      L.Marker.prototype._setPos.call(this, pos);
      if (L.DomUtil.TRANSFORM) {
        // use the CSS transform rule if available
        this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.angle + 'deg)';
      } else if (L.Browser.ie) {
        // fallback for IE6, IE7, IE8
        var rad = this.options.angle * L.LatLng.DEG_TO_RAD,
        costheta = Math.cos(rad),
        sintheta = Math.sin(rad);
        this._icon.style.filter += ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
          costheta + ', M12=' + (-sintheta) + ', M21=' + sintheta + ', M22=' + costheta + ')';
      }
    }
  });
  L.rotatedMarker = function(pos, options) {
    return new L.RotatedMarker(pos, options);
  };

  map.featureLayer.on('ready', function() {
    var markers = [];

    // cache all of the markers
    map.featureLayer.eachLayer(function(l) {
      markers.push(l);
      l.setOpacity(0); // initially hide all markers
    });

    // create a new line with no segments yet and add it to the map.
    var polyline = L.polyline([], { color: '#009fbf'}).addTo(map);

    // when drawing the line through all the markers, this is where the end of the line is
    var currentPosition = markers[0].getLatLng();

    // the position we're going toward
    var destinationPosition = markers[1].getLatLng();

    // the max in either latitude or longitude the cursor can move during each redraw
    var drawDistance = .035;

    // milliseconds it waits to redraw
    var drawDelay = 5;

    var xOffset,
        yOffset,
        slope;

    var bus = L.rotatedMarker(currentPosition, {
      icon: L.icon({
        iconUrl: 'https://www.mapbox.com/maki/renders/bus-24@2x.png',
        iconSize: [24, 24],
      })
    });
    bus.addTo(map);

    reachedMarker(); // initialize because we're starting at the first marker

    window.setTimeout(draw, 1500);

    function draw() {
      // add a coordinate to the line
      polyline.addLatLng(currentPosition);
      bus.setLatLng(currentPosition);

      calculateOffsets();

      currentPosition = getDestinationCoordinates();

      // if currentPosition and destinationPosition are the same, show the marker
      if (currentPosition.lat == destinationPosition.lat) reachedMarker();

      // keep draw()ing until we run out of markers
      if (markers.length) window.setTimeout(draw, drawDelay);
    }

    function calculateOffsets() {
      xOffset = destinationPosition.lng - currentPosition.lng;
      yOffset = destinationPosition.lat - currentPosition.lat;
      slope = yOffset / xOffset;
    }

    function getDestinationCoordinates() {
      var x = 1;
      var y = 2;
      if (Math.abs(yOffset) > Math.abs(xOffset)) {
        if (Math.abs(yOffset) < drawDistance) {
          y = yOffset;
        } else {
          y = (Math.abs(yOffset) * drawDistance) / yOffset;
        }
        x = y / slope;
      } else {
        if (Math.abs(xOffset) < drawDistance) {
          x = xOffset;
        } else {
          x = (Math.abs(xOffset) * drawDistance) / xOffset;
        }
        y = x * slope;
      }

      return L.latLng(currentPosition.lat + y, currentPosition.lng + x);
    }

    function reachedMarker() {
      // make the marker visible again
      markers[0].setOpacity(1).update();

      // if this is the last marker (current location), open the popup
      if (markers.length == 1) {
        markers[0].openPopup();
        bus.setOpacity(0);
      }

      // shift (delete) the top marker
      markers.shift();

      // pan to the newest marker
      map.panTo(currentPosition);

      // update destMarker
      if (markers.length > 0) destinationPosition = markers[0].getLatLng();
    }
  });
}
