var userData = function () {
  var dateObject = new Date()
  var daysOfTheWeekReference = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  // accessible variables
  var coordinates = {
    lat: 34.031245,
    lng: -118.266532
  }
  var location = ""
  var offset = 0
  var time = dateObject.getHours() + dateObject.getMinutes() / 60
  var day = dateObject.getDay()

  return {
    getCoordinates: function () {
      return coordinates
    },
    setCoordinates: function (newCoordinates) {
      return coordinates = newCoordinates
    },
    getLocation: function () {
      return location
    },
    setLocation: function (newLocation) {
      console.log(newLocation)
      return location = newLocation
    },
    getOffset: function () {
      return offset
    },
    incrementOffset: function () {
      offset += 20
      return offset
    },
    getTime: function () {
      return time
    },
    setTime: function (newTime) {
      return time = newTime
    },
    getDay: function () {
      return daysOfTheWeekReference[day] // returns string of day
    },
    setDay: function (newDay) {
      if (typeof newDay === 'string') {
        newDay = newDay.toLowerCase()
        if (daysOfTheWeekReference.indexOf(newDay) > -1) {
          day = daysOfTheWeekReference.indexOf(newDay)
        } else {
          throw "Day needs to be a number 0 - 6 or a day of the week"
        }
      } else if (typeof newDay === 'number') {
        if (newDay >= 0 && newDay < 7) {
          day = newDay
        } else {
          throw "Day needs to be a number 0 - 6 or a day of the week"
        }
      }
      day = newDay
      return day // returns string of day
    }
  }
}()



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
              ajaxCall(userData.setLocation(generalLocationArray[j].long_name), position)
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

getMyPosition(null, function () {
  getCityByPosition(userData.getCoordinates())
})



function ajaxCall (zip, geo) {
  var geoString = geo.lat + "," + geo.lng

  $.ajax({
    url: '/restaurants/getAll',
    type: 'GET',
    data: {zipCode: zip, geoLocation: geoString, offset: userData.getOffset, time: userData.getTime(), day: userData.getDay()}
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
    // populateRestaurantList(restaurantArray)
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
  function distance (origin, coordinates) {
    if (coordinates) {
      return (coordinates.lat - origin.lat) * (coordinates.lat - origin.lat) +
      (coordinates.lng - origin.lng) * (coordinates.lng - origin.lng)
    } else {
      return -1
    }
  }
  restaurantArray.sort(function (location1, location2) {
    return getDistance(position, location1.contact.coordinates) - getDistance(poistion, location2.contact.coordinates)
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
    userData.setCoordinates(pos)
    return pos
  }
}

function getDistance (origin, destination) {
  var originLat = origin.lat.toRadians()
  var destinationLat = destination.lat.toRadians()
  var latDiff = (destination.lat - origin.lat).toRadians()
  var lngDiff = (destination.lng - origin.lng).toRadians()

  var a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
          Math.cos(originLat) * Math.cos(destinationLat) *
          Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return c * 3959 // miles
}

function populateRestaurantList (restaurantArray, origin) {
  for (var i = 0; i < restaurantArray.length; i++) {
    var restaurant = restaurantArray[i]
    var distance = getDistance(origin, restaurant.contact.coordinates)
    var timesArray = restaurant.hours[userData.getDay()].time
    if (timesArray.length > 0) {
      for (var i = 0; i < timesArray.length; i++) {
        var t = timesArray[i]
        var userTime = userData.getTime()
        if (userTime >= t.startTime
          && userTime < t.endTime ) {
          var timeLeft = t.endTime - userTime
          break
        }
      }
    }

    var restaurantHtml = '<div class="restaurant">'
    restaurantHtml += '<div class="restaurant-picture"></div>'
    restaurantHtml += '<div class="restaurant-name">'
    restaurantHtml += restaurant.name + '</div>'
    restaurantHtml += '<div class="time-left">' + timeLeft + '</div>'
    restaurantHtml += '<div class="distance">'
    restaurantHtml += distance + ' mi.</div>'
    restaurantHtml += '</div>'
    $('#my_restaurant_list').append(restaurantHtml)
  }
}

















































