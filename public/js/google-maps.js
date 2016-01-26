function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.4038824, lng: -122.1162865},
    zoom: 1
  })

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null)
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE)
      }
    }
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'Hello World!'
      })
      map.setCenter(pos)
      map.setZoom(12)
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter())
    })
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter())
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}
