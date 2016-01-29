function getCityByPosition (position) {
  var geocoder = new google.maps.Geocoder()
  geocoder.geocode({ location: position }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        if (results[i].types[0] === 'postal_code') {
          var generalLocationArray = results[i].address_components
          var zipCodeRegEx = /\d{5}/
          for (var j = 0; j < generalLocationArray.length; j++) {
            if (zipCodeRegEx.test(generalLocationArray[j].long_name)) {
              ajaxCall(generalLocationArray[j].long_name, position)
              break
            }
          }
          break
        }
      }
    } else {
      alert('Geocoder failed due to: ' + status)
    }
  })
}

getMyPosition(null, function (position) {
  getCityByPosition(position)
})

function ajaxCall (zip, geo) {
  var geoString = geo.lat + "," + geo.lng

  $.ajax({
    url: '/restaurants/getAll',
    type: 'GET',
    data: {zipCode: zip, geoLocation: geoString}
  })
  .done(function(data) {
    console.log(data)
    var restaurantArray = sortByDistance(geo, addObjectsToArray(data))
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
        position: restaurantArray[i].contact.coordinates,
        title: restaurantArray[i].name,
        label: {
          text: labels[labelIndex++ % labels.length],
          color: 'yellow'
        },
        map: map,
        attribution: {
          source: 'After Hours',
          webUrl: restaurantArray[i].contact.website
        },
        animation: google.maps.Animation.DROP,
        icon: {
               url: "/public/assets/logo-animate/map-marker-logo-red.png",
               scaledSize: new google.maps.Size(30, 30),
               origin: new google.maps.Point(0,0),
               anchor: new google.maps.Point(32, 32)
            }
      })
    }
  })
  .fail(function() {
    console.log("error")
  })
  .always(function(data) {
    console.log(data)
    console.log("complete")
  })
}

function sortByDistance (position, restaurantArray) {
  function distance (coordinates) {
    if (coordinates) {
      return (coordinates.lat - position.lat) * (coordinates.lat - position.lat) +
      (coordinates.lng - position.lng) * (coordinates.lng - position.lng)
    } else {
      return -1
    }
  }
  restaurantArray.sort(function (location1, location2) {
    return distance(location1.contact.coordinates) - distance(location2.contact.coordinates)
  })
  // console.log(restaurantArray)
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

function getMyPosition (defaultPosition, completeCallback) {
  var pos = {}
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      if (completeCallback) {
        completeCallback(pos)
      }
      return pos
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
    return pos
  }
}



















































