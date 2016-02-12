console.log('JS loaded!');
// Javascript for

// $("#scroll").on("click", function() {
//     $("body").scrollTop(0);
// });

// smooth scroll
$("#scroll").click(function() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
});
