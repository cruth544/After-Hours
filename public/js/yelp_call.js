$.ajax({
  url: '/restaurants/getAll',
  type: 'GET'
  // data: {param1: 'value1'},
})
.done(function(data) {
  var restaurantArray = sortByDistance(getMyPosition(), addObjectsToArray(data))
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var labelIndex = 0
  for (var i = 0; i < restaurantArray.length; i++) {
    restaurantArray[i]
    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null)
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE)
      }
    }
    var marker = new google.maps.Marker({
      position: restaurantArray[i].location,
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

function sortByDistance (position, restaurantArray) {
  console.log(restaurantArray)
  function distance (coordinates) {
    return (coordinates.lat - position.lat) * (coordinates.lat - position.lat) +
    (coordinates.lng - position.lng) * (coordinates.lng - position.lng)
  }
  restaurantArray.sort(function (location1, location2) {
    return distance(location1) - distance(location2)
  })
  console.log(restaurantArray)
  return restaurantArray
}

function addObjectsToArray (object) {
  var array = []
  Object.keys(object).map(function(val) {
    object[val].name = val
    array.push(object[val])
  })
  return array
}

function getMyPosition (defaultPosition) {
  var pos = {}
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
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






















































