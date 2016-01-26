var Restaurant  = require("../models/restaurant")
var Yelp        = require('yelp')
var cheerio     = require('cheerio')
var async       = require('async')
var fs          = require('fs')
var request     = require('request')
var io          = require('socket.io')()

var mongoose    = require('mongoose')
require('../db/seed.js').seedRestaurants();

module.exports = {
  index: function (req, res, next) {
    var location = {
                    "latitude": 34.123814,
                    "longitude": -118.268692
                  }
    res.render('index', {/*data: data, */curr_user: null})
    yelp.api.requset(function (argument) {
      // body...
    }).done(function (data) {
      // body...
    })
    console.log(io.sockets.connected)
    // io.sockets.connected[socketid].emit()
  },

  all: function (req, res, next) {
    Restaurant.find({}, function (err, restaurants) {
      res.render('restaurants/all', { restaurants: restaurants, name: "The Morrison" })
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
  },

  io: io

}



















































