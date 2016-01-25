var User = require("../models/user");


module.exports = {

  index: function (req, res, next) {
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

    newUser.saveAsync()
      .then(function() {
          req.session.email = newUser.email
          res.redirect(303,'/')
      })
   },

   login: function (req, res, next) {
      User.findOneAsync({email: req.body.email}).then(function(user){
        user.comparePasswordAsync(req.body.password).then(function(isMatch){
         console.log('match: '+ isMatch);
         console.log(req.session)
         req.session.email = user.email;
         res.redirect(303, '/')
        })
      })
   },

   logout: function (req, res, next) {
      req.session.destroy(function () {
        res.redirect(303, '/')
      })
   }


}
