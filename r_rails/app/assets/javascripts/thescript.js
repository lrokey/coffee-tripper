
var map;
var directionsDisplay;
var directionsService;
var autocomplete_origin;
var autocomplete_destination;

function initialize() {
  directionsService = new google.maps.DirectionsService();
  var mapCanvas = document.getElementById('map-canvas');
  directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: { strokeColor: "#FF712C" }});
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(37.1, -95.7), // U.S.
    // Custom Map Style 
    styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#9ec1ff"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"lightness":"43"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"saturation":"-100"},{"lightness":"93"},{"gamma":"1.10"},{"weight":"0.62"}]}]
  };

  map = new google.maps.Map(mapCanvas, mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));

  var origin_input = (document.getElementById('pac-input'));
  var destination_input = (document.getElementById('pac-input-d'));
  var options = {
    types: ['geocode'],
    componentRestrictions: {country: 'US'}
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

  google.maps.event.addListener(map, 'tilesloaded', function(){
    document.getElementById('map-canvas').style.position = 'fixed';
  });

  google.maps.event.addDomListener(window, "resize", function() {
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 

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

$("#coffeecup").click(function(){
  $(".illustrations").hide(1000);
  $("#page-header").hide(1000);
});

function placeMarkers(lat, lng, name, phone, rating, address){

    // Use marker animation to drop the icons incrementally on the map.
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat,lng),
      animation: google.maps.Animation.DROP,
      icon: '/assets/coffee-gps2.png'
    });
    console.log(name);
    var contentInfo = '<strong><em>' + name + '</strong></em><br>' + address.join('<br>')+ '<br> <strong>Phone: </strong>' + phone + '<br> <strong>Rating: </strong>' + rating ;
    var infowindow = new google.maps.InfoWindow({
      content: contentInfo
    });

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
    });
    marker.setMap(map);
  }

  $(document).ready(function(){
    google.maps.event.addDomListener(window, 'load', initialize);
  });
