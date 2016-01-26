$.ajax({
  url: '/restaurants/getAll',
  type: 'GET'
  // data: {param1: 'value1'},
})
.done(function(data) {
  // for (var restaurant in data)
    var marker = new google.maps.Marker({
      position: data.location,
      label: "A",
      map: map,
      animation: google.maps.Animation.DROP
    })
})
.fail(function() {
  console.log("error")
})
.always(function() {
  console.log("complete")
})
