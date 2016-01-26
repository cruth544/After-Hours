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
    io.emit('drop-pin', {location: location})
  //******************************************************************\\
 //COMMENTED OUT BECAUSE YELP WILL LOCK YOU OUT AFTER TOO MANY REQUESTS\\
//**********************************************************************\\
    // var businessesJson = {}
    // var responsesCompleted = 0
    // var yelp = new Yelp({
    //   consumer_key: 'ppGF7cs331hgnbdAMFtrKQ',
    //   consumer_secret: 'vZIA3bJyHdn9q9JLLgLeY6c35eE',
    //   token: '8pSTKEbNQJ7P8zx8ECZdIUDknncrjPLq',
    //   token_secret: 'Z2t6RPX8FOlA43xpFmWppg8J_hI'
    // })

    // yelp.search({ term: 'happy hour', location: 'Los Angeles'})
    //   .then(function (data) {
        res.render('index', {/*data: data, */curr_user: null})

      //   yelpParse(data, businessesJson, function () {
      //     responsesCompleted++
      //     console.log(responsesCompleted)
      //     if (responsesCompleted === data.businesses.length) {
      //       fs.writeFile('output.json', JSON.stringify(businessesJson, null, 4), function(err){
      //         console.log('File successfully written! - Check your project directory for the output.json file');
      //       })
      //     }
      //   })
      // }).catch(function (err) {
      //   console.log(err)
      // })
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
  }

}



















































