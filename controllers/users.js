var User = require("../models/user");

var Restaurant  = require("../models/restaurant")
var Yelp        = require('yelp')
var cheerio     = require('cheerio')
var async       = require('async')
var fs          = require('fs')
var request     = require('request')

var mongoose = require('mongoose')



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
