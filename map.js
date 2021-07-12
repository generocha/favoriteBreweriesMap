let map,
  locations = [];

function initMap() {
  $.getJSON(
    "https://sheets.googleapis.com/v4/spreadsheets/1uOvEyolpKjTB6d7bxtzMUwrD72oJVLgJ4MWkpr74VyA/values/Sheet1!A2:Q?key=AIzaSyBPr_tBlvuoBLkGS6-vlaleTWo2M_l3sU4",
    function (data) {
      // data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.
      // Modify the code below to suit the structure of your spreadsheet.
      $(data.values).each(function () {
        var location = {};
        location.brewery = this[0];
        location.locationName = this[3];
        location.address = this[1];
        location.zip = this[2];
        location.city = this[4];
        location.state = this[5];
        location.latitude = parseFloat(this[7]);
        location.longitude = parseFloat(this[8]);
        location.beer = this[9];
        location.beer_style = this[10];
        location.beer_description = this[11];
        location.url = this[6];
        locations.push(location);
      });

      // map options
      let options = {
        zoom: 13,
        center: { lat: 47.6792, lng: -122.386 },
        mapTypeControl: false,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#222629" }] },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }],
          },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#1C221A" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1C221A" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#61892f" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#93A38B" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }],
          },
        ],
      };
      let map = new google.maps.Map(document.getElementById("map"), options);
      setBrewerys(map, locations);
    }
  );
}
function setBrewerys(map, locations) {
  let bounds = new google.maps.LatLngBounds();
  // add brewery info window
  let infoWindow = new google.maps.InfoWindow({
    content: "String",
  });
  for (let i = 0; i < locations.length; i++) {
    let new_marker = addMarker(map, locations[i], infoWindow);
    bounds.extend(new_marker.position);
  }
  map.fitBounds(bounds);
}
// add marker
function addMarker(map, location, infoWindow) {
  let position = {
    lat: parseFloat(location.latitude),
    lng: parseFloat(location.longitude),
  };
  let image = {
    url: "http://www.generocha.com/images/BeerICON2.svg",
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(100, 100),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32),
    scaledSize: new google.maps.Size(100, 100),
  };
  let marker = new google.maps.Marker({
    position: position,
    map: map,
    animation: google.maps.Animation.DROP,
    brewery: location.brewery,
    title: location.brewery,
    icon: image,
    label: {
      text: location.brewery,
      color: "#8ac832",
      fontSize: "14px",
    },
    labelAnchor: new google.maps.Point(200, 0),
    labelClass: "labels", // the CSS class for the label
    labelStyle: { opacity: 0.1 },
  });
  google.maps.event.addListener(marker, "click", function () {
    infoWindow.setContent(
      "<div><h2>" +
      location.brewery +
      "</h2><h3>" +
      location.locationName +
      "</h3><p>" +
      location.address +
      "<br/>" +
      location.city +
      " " +
      location.state +
      "</p><h4>" +
      location.beer +
      "</h4><p>" +
      location.beer_style +
      "</p><p>" +
      location.beer_description +
      "</p><a href='" +
      location.url +
      "' target='_blank'>" +
      location.url +
      "</a></p></div>"
    );
    infoWindow.open(map, marker);
  });
  return marker;
}
