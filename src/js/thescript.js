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
    styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"administrative","elementType":"labels","stylers":[{"saturation":"-100"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"gamma":"0.75"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"lightness":"-37"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f9f9f9"}]},{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"saturation":"-100"},{"lightness":"40"},{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"labels.text.fill","stylers":[{"saturation":"-100"},{"lightness":"-37"}]},{"featureType":"landscape.natural","elementType":"labels.text.stroke","stylers":[{"saturation":"-100"},{"lightness":"100"},{"weight":"2"}]},{"featureType":"landscape.natural","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"saturation":"-100"},{"lightness":"80"}]},{"featureType":"poi","elementType":"labels","stylers":[{"saturation":"-100"},{"lightness":"0"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"lightness":"-4"},{"saturation":"-100"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"},{"visibility":"on"},{"saturation":"-95"},{"lightness":"62"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road","elementType":"labels","stylers":[{"saturation":"-100"},{"gamma":"1.00"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"gamma":"0.50"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"saturation":"-100"},{"gamma":"0.50"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"},{"saturation":"-100"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"lightness":"-13"}]},{"featureType":"road.highway","elementType":"labels.icon","stylers":[{"lightness":"0"},{"gamma":"1.09"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"},{"saturation":"-100"},{"lightness":"47"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"lightness":"-12"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"saturation":"-100"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"},{"lightness":"77"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"-5"},{"saturation":"-100"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"saturation":"-100"},{"lightness":"-15"}]},{"featureType":"transit.station.airport","elementType":"geometry","stylers":[{"lightness":"47"},{"saturation":"-100"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"water","elementType":"geometry","stylers":[{"saturation":"53"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"lightness":"-42"},{"saturation":"17"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"lightness":"61"}]}]
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

 