var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var autocomplete_origin;
var autocomplete_destination;

function initialize() {
  var mapCanvas = document.getElementById('map-canvas');
  directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: "#FF712C" }});
  var mapOptions = {
    // To Disable the zoom-y controls -- will be added in later... maybe
    disableDefaultUI: true,
    zoom: 4,
    center: new google.maps.LatLng(37.1, -95.7), // U.S.

    // Custom Map Style 
    styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},
    {"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},
    {"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"all",
    "stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},
    {"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},
    {"featureType":"landscape","elementType":"geometry","stylers":[{"lightness":20},{"color":"#ececec"}]},{"featureType":"landscape.man_made",
    "elementType":"all","stylers":[{"visibility":"on"},{"color":"#f0f0ef"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill",
    "stylers":[{"visibility":"on"},{"color":"#f0f0ef"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke",
    "stylers":[{"visibility":"on"},{"color":"#d4d4d4"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"visibility":"on"},
    {"color":"#ececec"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry",
    "stylers":[{"lightness":21},{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},
    {"color":"#d4d4d4"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#303030"}]},{"featureType":"poi",
    "elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"visibility":"on"}]},
    {"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.government","elementType":"all",
    "stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park",
    "elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},
    {"lightness":21}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school",
    "elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"poi.school","elementType":"geometry.stroke","stylers":[{"lightness":"-61"},
    {"gamma":"0.00"},{"visibility":"off"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"visibility":"on"}]},
    {"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway",
    "elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial",
    "elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry",
    "stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},
    {"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#dadada"},{"lightness":17}]}]
  };

  map = new google.maps.Map(mapCanvas, mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));


  var origin_input = (document.getElementById('pac-input'));
  var destination_input = (document.getElementById('pac-input-d'));
  var options = { types: ['(regions)']};

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

  google.maps.event.addListener(map, 'tilesloaded', function(){
    document.getElementById('map-canvas').style.position = 'fixed';
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

 