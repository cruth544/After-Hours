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
