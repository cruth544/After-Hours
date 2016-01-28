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
    var infowindow = new google.maps.InfoWindow({
      content: "Hello there"
    })
    for (var i = 0; i < restaurantArray.length; i++) {
      console.log(restaurantArray[i])
      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null)
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE)
        }
      }
      var request = {
        location: restaurantArray[i].contact.coordinates,
        radius: '500',
        query: restaurantArray[i].name
      }
      var service = new google.maps.places.PlacesService(map)
      service.textSearch(request, callback)

      function callback (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          var marker = new google.maps.Marker({
            map: map,
            place: {
              placeId: results[0].place_id,
              location: results[0].geometry.location
            },
            icon: {
              url: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
              scaledSize: new google.maps.Size(25, 25)
            }
          })
          // the smooth zoom function
          function smoothZoom (map, max, cnt) {
            if (cnt > max) {
              infowindow.open(map, marker)
              return
            } else {
              z = google.maps.event.addListener(map, 'zoom_changed', function(event){
                google.maps.event.removeListener(z)
                smoothZoom(map, max, cnt + 1)
              })
              setTimeout(function(){map.setZoom(cnt)}, 80) // 80ms is what I found to work well on my system -- it might not work well on all systems
            }
          }
          marker.addListener('click', function () {
            map.panTo(marker.internalPosition) // set map center to marker position
            smoothZoom(map, 16, map.getZoom()) // call smoothZoom, parameters map, final zoomLevel, and starting zoom level
          })
          map.addListener('center_changed', function () {
            infowindow.close()
          })
          // marker.addListener('mouseover', function () {
          //   infowindow.open(map, marker)
          //   console.log('MOUSE OVER')
          // })
          // marker.addListener('mouseout', function () {
          //   infowindow.close()
          //   console.log(marker)
          // })
        }
      }
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



















































