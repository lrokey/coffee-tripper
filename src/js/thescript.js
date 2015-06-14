
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
    styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#675a4b"}]},
    {"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},
    {"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#ffebc5"},
    {"lightness":"-10"}]},{"featureType":"administrative","elementType":"geometry.stroke",
    "stylers":[{"color":"#675a4b"}]},{"featureType":"administrative.country","elementType":"labels.text.fill",
    "stylers":[{"color":"#b70046"}]},{"featureType":"administrative.province","elementType":"geometry.fill",
    "stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke",
    "stylers":[{"color":"#675a4b"},{"weight":"0.50"}]},{"featureType":"administrative.province",
    "elementType":"labels.text.fill","stylers":[{"color":"#675a4b"}]},{"featureType":"administrative.locality",
    "elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.locality",
    "elementType":"labels.text.fill","stylers":[{"color":"#ff850a"}]},{"featureType":"administrative.neighborhood",
    "elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"administrative.neighborhood",
    "elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all",
    "stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill",
    "stylers":[{"saturation":"-71"},{"lightness":"-2"},{"color":"#ffebc5"}]},{"featureType":"poi","elementType":"all",
    "stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill",
    "stylers":[{"color":"#70bfaf"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},
    {"lightness":45},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels.text.stroke",
    "stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all",
    "stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill",
    "stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"geometry.stroke",
    "stylers":[{"color":"#675a4c"}]},{"featureType":"road.highway","elementType":"labels.text.fill",
    "stylers":[{"color":"#675a4b"}]},{"featureType":"road.arterial","elementType":"all",
    "stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"geometry.fill",
    "stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.fill",
    "stylers":[{"color":"#675a4b"}]},{"featureType":"road.arterial","elementType":"labels.icon",
    "stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"all",
    "stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all",
    "stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7ccff0"},
    {"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#cfeae4"}]},
    {"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#109579"}]},{"featureType":"water",
    "elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]}]
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
  });

}

google.maps.event.addDomListener(window, "resize", function() {
 var center = map.getCenter();
 google.maps.event.trigger(map, "resize");
 map.setCenter(center); 
});

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

 