var User = require("../models/user");


module.exports = {

  enter: function (req, res, next) {
        res.render('enter')
  },

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

  show: function (req, res, next) {
      User.findOne({ name: req.session.name }).then(function(user){
          res.render('users/edit_profile_show', { user: user,
                                           curr_user: user.email,
                                           user: req.user,
                                           users: null })
       })
    },

  update: function (req, res, next) {
    User.findOneAndUpdate({ _id: Number(req.params.id)}, req.body,
      function (err) {
      if (err) console.log(err);
      else res.send("Profile updated!")
      })
    },

  delete: function (req, res, next) {
    User.findOneAndRemove({ id: Number(req.params.id)}, req.body,
      function (err) {
      if (err) console.log(err);
      else res.send("Profile deleted!")
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
