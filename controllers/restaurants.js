var Restaurant  = require("../models/restaurant")
var User        = require("../models/user")
var Yelp        = require('yelp')
var cheerio     = require('cheerio')
var async       = require('async')
var fs          = require('fs')
var request     = require('request')

var mongoose = require('mongoose')
require('../db/seed.js').seedRestaurants()

module.exports = {
  index: function (req, res, next) {

    // if there is a match for someone in the database, find them and render their profile
    if(req.session && req.session.email){
        User.findOne({ email: req.session.email }).then(function(user){
            res.render('index',{
                curr_user: user.email,
                user: req.user,
                users: null  })
        })
    }
    else{
        User.findAsync({})
            .then( function(users){
                res.render('index', {
                    curr_user: null,
                    user: req.user,
                    users: users
                })
            }).catch()
        }
  },

  all: function (req, res, next) {
    Restaurant.find({}, function (err, restaurants) {
      res.render('restaurants/all', { restaurants: restaurants })
    })
  },

  show: function (req, res, next) {
    Restaurant.findOne({ name: String(req.params.name)}, function (err, restaurant) {
      User.findOne({ email: req.session.email }).then(function(user){
          console.log(restaurant)
          console.log(req.session)
          res.render('restaurants/show', { restaurant: restaurant,
                                           curr_user: user.email,
                                           user: req.user,
                                           users: null })
       })
    })
  },

  create: function (req, res, next) {
    var newRestaurant = new Restaurant(req.body)
    newRestaurant.save(function (err) {
      if (err) console.log(err)
      else res.send('Restaurant created!')
    })
  },

  yelp: function (req, res, next) {
    var businessesJson = {}
    var responsesCompleted = 0
    var yelp = new Yelp({
      consumer_key: 'ppGF7cs331hgnbdAMFtrKQ',
      consumer_secret: 'vZIA3bJyHdn9q9JLLgLeY6c35eE',
      token: '8pSTKEbNQJ7P8zx8ECZdIUDknncrjPLq',
      token_secret: 'Z2t6RPX8FOlA43xpFmWppg8J_hI'
    })
      yelp.search({ term: 'happy hour', cll: '34.0309344, -118.2688299',  limit: '10', sort: '1'})
    .then(function (data) {

      yelpParse(data, businessesJson, function () {
        responsesCompleted++
        console.log(responsesCompleted)
        if (responsesCompleted === data.businesses.length) {
          console.log('returning')
          res.send(businessesJson)

          fs.writeFile('output.json', JSON.stringify(businessesJson, null, 2), function(err){
            console.log('File successfully written! - Check your project directory for the output.json file');
          })
        }
      })
    }).catch(function (err) {
      console.log(err)
    })
  }
}

function yelpParse (data, businessJson, complete) {
  var businesses = data.businesses
  var businessCount = 0
  async.whilst(
    // Condition to check every loop
    function () {
      return businessCount < businesses.length
    },
    // function to call every iteration
    function (callback) {
      var restaurant = businesses[businessCount]
      businessJson[restaurant.name] = {}
      businessJson[restaurant.name].location = {}
      businessJson[restaurant.name].location = {
        lat: restaurant.location.coordinate.latitude,
        lng: restaurant.location.coordinate.longitude
      }
      getReviewCount(restaurant.name, restaurant.url, businessJson, function () {
        complete()
      })

      // increment counter
      businessCount++
      // you have to call the callback to go to next
      // iteration of the loop
      callback()
    },
    // Stopped loop
    function (err) {
    })
}

function getReviewCount (name, url, businessJson, complete) {
  url = url.split('?')[0]
  var yelpSearchUrl = url
  yelpSearchUrl += '?q=happy%20hour'
  request({url: yelpSearchUrl}, function (err, res, body) {
    if (!err) {
      // user cheerio to load html webpage
      var $ = cheerio.load(body)
      // make regex to get number
      var reviewCountRegEx = /\d+\b/
      // grab node where the review count is
      var reviewCount = $('.feed_search-results').first().text()
      // use regex to extract number from node
      reviewCount = reviewCount.match(reviewCountRegEx)[0]
      reviewCount = reviewCount > 100 ? 100 : reviewCount
      extractHappyHourTime(name, businessJson, reviewCount, url, function () {
        complete()
      })
      // extractHappyHourTime(name, reviewCount, url, function (object) {
      //   complete(object)
      // })
    } else {
      console.log(err)
    }
  })
}

function extractHappyHourTime (name, businessJson, reviewCount, url, complete) {
  var counter = 0
  var restaurantJson = {}
  async.whilst(
    function () {
      return counter < reviewCount
    },
    function (callback) {

      // console.log(url)
      url += '?start=' + counter
      url += '&q=happy%20hour'
      // console.log(url)
      request({url: url}, function (err, res, body) {
        if (!err) {
          var $ = cheerio.load(body)
          var reviews = $('.review-content')
          var happyHoursRegEx = /(from)?\s[^$]1?\d?:?\d{0,2}\s?([AaPp]\.?[mM]\.?)?\s?(is|to|through|until|and|-)\s?\d{1,2}:?\d{0,2}\s?([AaPp]\.?[mM]\.?)?/
          async.forEachOf(reviews, function (item, key, forEachCallback) {
            var review = $(item).children().last().text()
            if (happyHoursRegEx.test(review)) {
              review = review.match(happyHoursRegEx)
              var jsonKey = Number(key) + counter
              restaurantJson[jsonKey] = review
              forEachCallback()
            }
          })
          counter += 20
          // console.log("incrementing... " + counter)
          callback()
        }
      })
    },
    function (err) {
      // console.log(restaurantJson)
      // console.log("stopped extractHappyHourTime")
      console.log(name)
      businessJson[name].reviews = restaurantJson
      complete()
    })
}









































