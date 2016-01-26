var Restaurant = require('../models/restaurant');
var mongoose = require('mongoose')
require('../db/seed.js').seedRestaurants();

module.exports = {

    all: function (req, res, next) {
      Restaurant.find({}, function (err, restaurants) {
        res.render('restaurants/all', { restaurants: restaurants })
      })
    },

    show: function (req, res, next) {
      Restaurant.findOne({ name: String(req.params.name)}, function (err, restaurant) {
        res.render('restaurants/show', { restaurant: restaurant })
      })
    },

    create: function (req, res, next) {
      var newRestaurant = new Restaurant(req.body)
      newRestaurant.save(function (err) {
        if (err) console.log(err)
        else res.send('Restaurant created!')
      })
    }
}
