var User = require("../models/user");


module.exports = {


  users: function (req, res, next) {
      User.find({}, function (err, users) {
        res.render('all-users', {users: users})
      })
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
