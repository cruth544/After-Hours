function getCityByPosition (position) {
  var geocoder = new google.maps.Geocoder()
  geocoder.geocode({ location: position }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      console.log(results)
    } else {
      alert('Geocoder failed due to: ' + status)
    }
  })
}
var getPosition = getMyPosition()
setTimeout(function () {
  getCityByPosition(getPosition)
}, 1000)



// function getCityByPosition (position) {

//   var googleUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
//   googleUrl += position.lat + ','
//   googleUrl += position.lng
//   googleUrl += '&key=AIzaSyDZYqdGCiP3a1xbvJsYYbAt5ZEoe896axU'
//   $.ajax({
//     url: googleUrl,
//     type: 'GET'
//   })
//   .done(function(data) {
//     console.log("success")
//     ajaxCall(data)
//   })
//   .fail(function(err) {
//     console.log("error")
//   })
//   .always(function() {
//     console.log("complete")
//   })
// }

function ajaxCall (data) {
  console.log(data)
  $.ajax({
    url: '/restaurants/getAll',
    type: 'GET',
    data: {currentPosition: data},
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
}

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



















































