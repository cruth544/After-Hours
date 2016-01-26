var Restaurant  = require("../models/restaurant")
var Yelp        = require('yelp')
var cheerio     = require('cheerio')
var async       = require('async')
var fs          = require('fs')
var request     = require('request')

module.exports = {
  index: function (req, res, next) {
    res.render('index', {/*data: data,*/ curr_user: null})
  },

  yelp: function (req, res, next) {
    console.log(req)
    var businessesJson = {}
    var responsesCompleted = 0
    var yelp = new Yelp({
      consumer_key: 'ppGF7cs331hgnbdAMFtrKQ',
      consumer_secret: 'vZIA3bJyHdn9q9JLLgLeY6c35eE',
      token: '8pSTKEbNQJ7P8zx8ECZdIUDknncrjPLq',
      token_secret: 'Z2t6RPX8FOlA43xpFmWppg8J_hI'
    })
      yelp.search({ term: 'happy hour', location: 'Los Angeles', limit: '10'})
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
      // console.log("Counter: " + counter)
      // console.log("is less than")
      // console.log("ReviewCount: " + reviewCount)
      // console.log(counter < reviewCount)
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
          var happyHoursRegEx = /(from)?\s[^$]1?\d?:?\d{0,2}\s?([AaPp]\.?[mM]\.?)?\s?(is|to|through|until|and|-)\s?\d{1,2}:?\d{0,2}\s?([AaPp]\.?[mM]\.?)?/g
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
    }
  )
}


















































