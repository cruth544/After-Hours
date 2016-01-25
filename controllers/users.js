var User = require("../models/user");


module.exports = {

  landing: function (req, res, next) {
    res.render('users/landing_page')
    // Check to see if current user exists
    // If current user exits, show index page
  },

  create: function (req, res, next) {
    var newUser = new User()
    var keys = Object.keys(req.body)
    keys.forEach(function (key) {
      newUser[key] = req.body[key]
    })

    newUser.save(function (err) {
      if (err) console.log(err)
      else res.send('User Created!')
    })
  },

  new: function (req, res, next) {
    res.send("Create new user")
    res.render('users/new')
  },


}
