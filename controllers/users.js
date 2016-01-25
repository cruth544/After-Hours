var User = require("../models/user");


module.exports = {
  index: function (req, res, next) {
    res.render('index')
  },
  landing: function (req, res, next) {
    if(req.session && req.session.email){
        User.findOne({ email: req.session.email }).then(function(user){
            res.render('index',{
                curr_user: user.email,
                users: null  })
        })
    }
    else{
        User.findAsync({})
            .then( function(users){
                res.render('index', {
                    curr_user: null,
                    users: users
                })
            }).catch()
    }
    // Check to see if current user exists
    // If current user exits, show index page
  },

  create: function (req, res, next) {
    var newUser = new User()
    var keys = Object.keys(req.body)
    keys.forEach(function (key) {
      newUser[key] = req.body[key]
    })

    newUser.user.saveAsync()
      .then(function() {
          req.session.email = user.email
          res.redirect(303,'/')
      })
  },

  new: function (req, res, next) {
    res.send("Create new user")
    res.render('users/new')
  },


}
