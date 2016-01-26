$.ajax({
  url: '/restaurants/getAll',
  type: 'GET'
  // data: {param1: 'value1'},
})
.done(function(data) {
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var labelIndex = 0
  for (var restaurantsList in data) {
    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null)
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE)
      }
    }
    var marker = new google.maps.Marker({
      position: data[restaurantsList].location,
      label: labels[labelIndex++ % labels.length],
      map: map,
      animation: google.maps.Animation.DROP
    })
  }
})
.fail(function() {
  console.log("error")
})
.always(function() {
  console.log("complete")
})

function addObjectsToArray (object) {
  var array = []
  for (var key in object) {
    // add to array
  }
}

function getMyPosition (defaultPosition) {
  var pos = {}
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = {
        lat: position.coordinate.latitude,
        lng: position.coordinate.longitude
      }
    })
  } else {
    if (defaultPosition) {
      pos = defaultPosition
    } else {
      pos = {
        lat: 34.0309344,
        lng: -118.2688299
      }
    }
  }
  return pos
}

function sortByDistance (restaurantArray) {

}





















































