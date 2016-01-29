function initMap() {

  var styles =
    [
      {
        "elementType": "geometry",
        "stylers": [
          { "invert_lightness": true },
          { "lightness": -7 },
          { "weight": 0.6 },
          { "hue": "#1900ff" },
          { "saturation": 8 },
          { "gamma": 0.89 }
        ]
      }
    ]
  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles);

  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  var mapOptions = {
    zoom: 10,
    center: new google.maps.LatLng(34.031245, -118.266532),
    mapTypeControl: false
  }
  map = new google.maps.Map(document.getElementById('map'),
    mapOptions);

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  // Try HTML5 geolocation.
  if (navigator.geolocation) {

  //bounce into your current location
    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null)
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE)
      }
    }

    //if browser geolocation is on, snap to center
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'You!',
        icon: {
               url: "/public/assets/logo-animate/you-are-here-icon.png",
               scaledSize: new google.maps.Size(40, 40)
        },
        optimized: false,
        zIndex: 99999999
      })
      map.setCenter(pos)
      map.setZoom(13)

      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds())
      });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }))

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport)
          } else {
            bounds.extend(place.geometry.location)
          }
        })
        map.fitBounds(bounds)
      })

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter())
>>>>>>> development
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

