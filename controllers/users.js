// var User = require("../models/user");

var landing = function(req, res, next){

    res.render('users/landing_page')
  };

// var index = function(req, res, next){

//   User.find({}, function(error, users){
//     res.render('users/index', {users: users});
//   });
// };

module.exports = {
  landing: landing,
  // index: index
};
