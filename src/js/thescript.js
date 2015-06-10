
var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var autocomplete_origin;
var autocomplete_destination;

function initialize() {
  var mapCanvas = document.getElementById('map-canvas');
  directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    // To Disable the zoom-y controls -- will be added in later... maybe
    disableDefaultUI: true,
    zoom: 4,
    center: new google.maps.LatLng(37.1, -95.7), // U.S.

    // Custom Map Style 
    styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#6195a0"}]},
      {"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},
      {"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":"0"},{"saturation":"0"},{"color":"#f5f5f2"},
      {"gamma":"1"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"lightness":"-3"},{"gamma":"1.00"}]},
      {"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},
      {"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},
      {"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#bae5ce"},{"visibility":"on"}]},
      {"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"simplified"}]},
      {"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},
      {"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#fac9a9"},{"visibility":"simplified"}]},
      {"featureType":"road.highway","elementType":"labels.text","stylers":[{"color":"#4e4e4e"}]},
      {"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#787878"}]},
      {"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
      {"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},
      {"featureType":"transit.station.airport","elementType":"labels.icon","stylers":[{"hue":"#0a00ff"},{"saturation":"-77"},
      {"gamma":"0.57"},{"lightness":"0"}]},{"featureType":"transit.station.rail","elementType":"labels.text.fill","stylers":[{"color":"#43321e"}]},
      {"featureType":"transit.station.rail","elementType":"labels.icon","stylers":[{"hue":"#ff6c00"},{"lightness":"4"},{"gamma":"0.75"},
      {"saturation":"-68"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eaf6f8"},{"visibility":"on"}]},
      {"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c7eced"}]},
      {"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-49"},{"saturation":"-53"},{"gamma":"0.79"}]}]
  };

  map = new google.maps.Map(mapCanvas, mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));


  var origin_input = (document.getElementById('pac-input'));
  var destination_input = (document.getElementById('pac-input-d'));
  var options = {
    types: ['(regions)']
  };

  autocomplete_origin = new google.maps.places.Autocomplete(origin_input, options);
  autocomplete_origin.bindTo('bounds', map);
  autocomplete_destination = new google.maps.places.Autocomplete(destination_input, options);
  autocomplete_destination.bindTo('bounds', map);


  google.maps.event.addListener(autocomplete_origin, 'place_changed', function () {
    var place = autocomplete_origin.getPlace();
    if (!place.geometry) {
      return;
    } 
  });

  google.maps.event.addListener(autocomplete_destination, 'place_changed', function () {
    var place = autocomplete_destination.getPlace();
    if (!place.geometry) {
      return;
    }

    // calcRoute();
  });

}

function calcRoute() {
  var startPlace = autocomplete_origin.getPlace();
  var start = startPlace.formatted_address;

  var endPlace = autocomplete_destination.getPlace();
  var end = endPlace.formatted_address;
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}



google.maps.event.addDomListener(window, 'load', initialize);

 