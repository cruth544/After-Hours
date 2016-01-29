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
  var displayedRestaurants = []

  return {
    getCoordinates: function () {
      return coordinates
    },
    setCoordinates: function (newCoordinates) {
      if (newCoordinates) {
        if (typeof newCoordinates.lat === 'string') {
          newCoordinates.lat = Number(newCoordinates.lat)
        }
        if (typeof newCoordinates.lng === 'string') {
          newCoordinates.lng = Number(newCoordinates.lng)
        }
        return coordinates = newCoordinates
      }
    },
    getLocation: function () {
      return location
    },
    setLocation: function (newLocation) {
      if (newLocation) {
        return location = newLocation
      }
    },
    getOffset: function () {
      return offset
    },
    incrementOffset: function () {
      return offset += 10
    },
    resetOffset: function () {
      return offset = 0
    },
    getTime: function () {
      return time
    },
    setTime: function (newTime) {
      if (newTime) {
        return time = newTime
      }
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
    },
    getDisplayedRestaurants: function () {
      return displayedRestaurants
    },
    addToDisplayedRestaurants: function (restaurants) {
      if (restaurants.name) {
        displayedRestaurants.push(restaurants)
      } else if (restaurants instanceof Array) {
        for (var i = 0; i < restaurants.length; i++) {
          displayedRestaurants.push(restaurants[i])
        }
      }
      return displayedRestaurants
    }
  }
}()
function setUserData (data) {
  for (var setting in data) {
    for (var method in userData) {
      if (method.includes('set')) {
        if (method.toLowerCase().includes(setting)) {
          if (!/[a-zA-Z]+/.test(data[setting])) {
            data[setting] = Number(data[setting])
          }
          userData[method](data[setting])
          break
        }
      }
    }
  }
}
function getUserData () {
  var data = {}
  for (var method in userData) {
    if (method.includes('get')) {
      data[method.slice(3).toLowerCase()] = userData[method]()
    }
  }
  return data
}

////////////////////////////HELPER METHODS//////////////////////////////
function showTimeLeft (number) {
  var minute = number % 1
  var hour = number - minute
  minute = Math.floor(minute * 60)
  var minute_s = minute > 1 ? 's' : ''
  var hour_s = hour > 1 ? 's' : ''
  var and = ' and '
  var timeLeftString = ''
  if (hour >= 1) {
    timeLeftString += hour + ' hour' + hour_s
  }
  if (hour >= 1 && minute >= 1) {
    timeLeftString += ' and '
  }
  if (minute >= 1) {
    minute = minute > 10 ? minute : '0' + minute
    timeLeftString += minute + ' minute' + minute_s + ' left'
  }
  return timeLeftString
}

function placeMarkersOn (googleMaps) {
  var bounds = new google.maps.LatLngBounds()
  for (var i = 0; i < map.markers.length; i++) {
    map.markers[i].setMap(googleMaps)
    bounds.extend(map.markers[i].getPosition())
  }
  map.fitBounds(bounds)
}
function clearMarkers () {
  console.log('clearing')
  placeMarkersOn(null)
  map.markers = []
}

//////////////////////////////////START/////////////////////////////////
getMyPosition(null, function (position) {
  getCityByPosition(userData.setCoordinates(position), ajaxCall)
})

//////////////////////////////////CODE//////////////////////////////////


function getCityByPosition (position, startSearch) {
  var geocoder = new google.maps.Geocoder()
  geocoder.geocode({ location: position }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        if (results[i].types[0] === 'postal_code') {
          var generalLocationArray = results[i].address_components
          var zipCodeRegEx = /\d{5}/
          for (var j = 0; j < generalLocationArray.length; j++) {
            if (zipCodeRegEx.test(generalLocationArray[j].long_name)) {
              userData.setLocation(generalLocationArray[j].long_name)
              if (startSearch) {
                startSearch(userData.getLocation(),
                  userData.getCoordinates())
              }
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
function getPositionByCity (city, startSearch, fail) {
  var geocoder = new google.maps.Geocoder()
  geocoder.geocode({ address: city }, function (results, status) {
    if (results.length === 1) {
      var pos = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng()
      }
      startSearch(userData.setLocation(results[0].formatted_address), userData.setCoordinates(pos))
      clearMarkers()
      map.panTo(userData.getCoordinates())
    } else {
      alert("please specify further")
      fail(status)
    }
  })
}

function ajaxCall () {
  var searchParams = {
    location: userData.getLocation(),
    offset: userData.getOffset(),
    time: userData.getTime(),
    day: userData.getDay()
  }
  if (userData.getCoordinates()) {
    searchParams.coordinates = userData.getCoordinates()
  }

  $.ajax({
    url: '/restaurants/getAll',
    type: 'GET',
    data: searchParams
  })
  .done(function(data) {
    console.log(data.restaurants)
    setUserData(data.settings)
    var restaurantArray = sortByDistance(userData.getCoordinates(), addObjectsToArray(data.restaurants))
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var labelIndex = 0
    var allMarkers = []
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
        // label: {
        //   text: labels[labelIndex++ % labels.length],
        //   color: 'yellow'
        // },
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
      allMarkers.push(marker)
    }
    map.markers = allMarkers
    placeMarkersOn(map)
    populateRestaurantList(restaurantArray, userData.getCoordinates(), userData.getOffset() === 0)
  })
  .fail(function() {
    console.log("error")
  })
  .always(function() {
    console.log("complete")
    $('.more-results').prop('disabled', false)
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
    return distance(position, location1.contact.coordinates) - distance(position, location2.contact.coordinates)
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
    if (completeCallback) {
      completeCallback(pos)
    }
    return pos
  }
}

function getDistance (origin, destination) {
  if (typeof(Number.prototype.toRadians) === "undefined") {
    Number.prototype.toRadians = function() {
      return this * Math.PI / 180;
    }
  }
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

function populateRestaurantList (restaurantArray, origin, reset) {
  if (reset) $('#my_restaurant_list').html('')
  var delayTime = 0
  function hoursLeft (t) {
    var userTime = 18//userData.getTime()
    if (userTime >= t.startTime
      && userTime < t.endTime ) {
      return t.endTime - userTime
    }
    return false
  }
  for (var i = 0; i < restaurantArray.length; i++) {
    var restaurant = restaurantArray[i]
    var distance = getDistance(origin, restaurant.contact.coordinates)
    if (restaurant.hours) {
      var timesArray = restaurant.hours[userData.getDay()].time
      if (timesArray.length > 0) {
        for (var j = 0; j < timesArray.length; j++) {
          var timeLeft = hoursLeft(timesArray[j])
        }
      }
    } else {
      var timeLeft = hoursLeft(restaurant.time)
    }

    if (!timeLeft) throw "No time left"
    var restaurantHtml = '<div class="restaurant">'
    restaurantHtml += '<div class="restaurant-picture-container">'
    restaurantHtml += '<img class="restaurant-picture" src="'
    restaurantHtml += restaurant.image +'"></div>'
    restaurantHtml += '<div class="restaurant-name">'
    restaurantHtml += restaurant.name + '</div>'
    restaurantHtml += '<div class="time-left">'
    restaurantHtml += showTimeLeft(timeLeft)
    restaurantHtml += ' of Happy Hour left!!</div>'
    restaurantHtml += '<div class="distance">'
    restaurantHtml += distance.toFixed(1) + ' mile'
    restaurantHtml += distance !== 1 ? 's' : ''
    restaurantHtml += ' away</div>'
    restaurantHtml += '</div>'
    $('#my_restaurant_list').append($(restaurantHtml).hide().fadeIn(400).delay(delayTime += 250))
  }
}

function searchYelp () {
  var searchBar = document.getElementById('search-bar').value
  userData.resetOffset()
  getPositionByCity(searchBar, ajaxCall, function (error) {
    getMyPosition(null, function (position) {
      getCityByPosition(userData.setCoordinates(position))
    })
  })
}

function moreResults () {
  console.log("MORE!!")
  $('.more-results').prop('disabled', true)
  userData.incrementOffset()
  ajaxCall()
}













































