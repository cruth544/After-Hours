var Restaurant  = require("../models/restaurant")
var Yelp        = require('yelp')
var cheerio     = require('cheerio')
var async       = require('async')
var fs          = require('fs')
var request     = require('request')



module.exports = {
  index: function (req, res, next) {
    var yelp = new Yelp({
      consumer_key: 'ppGF7cs331hgnbdAMFtrKQ',
      consumer_secret: 'vZIA3bJyHdn9q9JLLgLeY6c35eE',
      token: '8pSTKEbNQJ7P8zx8ECZdIUDknncrjPLq',
      token_secret: 'Z2t6RPX8FOlA43xpFmWppg8J_hI'
    })

    yelp.search({ term: 'happy hour', location: 'Los Angeles'})
      .then(function (data) {
        res.render('index', {data: data, curr_user: null})
        yelpParse(data)
      }).catch(function (err) {
        console.log(err)
      })
  }
}

function yelpParse (data) {
  var businesses = data.businesses
  var businessCount = 0
  var businessesWithReviews = {}
  async.whilst(
    // Condition to check every loop
    function () {
      return businessCount < businesses.length
    },
    // function to call every iteration
    function (callback) {
      var restaurant = businesses[businessCount]
      businessesWithReviews[restaurant.name] = getReviewCount(restaurant.name, restaurant.url, businessesWithReviews)
      // console.log(reviewCount)
      //DO STUFF HERE

      // increment counter
      businessCount++
      // you have to call the callback to go to next
      // iteration of the loop
      callback()
    },
    // Stopped loop
    function (err) {
      console.log("STOPPED EVERYTHING!")
      console.log(businessesWithReviews)
    })
}

function getReviewCount (name, url, businessesObject) {
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
      extractHappyHourTime(name, reviewCount, url, businessesObject)
    } else {
      console.log(err)
    }
  })
}

function extractHappyHourTime (name, reviewCount, url, allRestaurants) {
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
          var happyHoursRegEx = /\s1?\d?:?\d{0,2}\s?([AaPp]\.?[mM]\.?)?\s?(is|to|from|through|until|and|-)\s?\d{1,2}:?\d{0,2}\s?([AaPp]\.?[mM]\.?)?/
          async.forEachOf(reviews, function (item, key, forEachCallback) {
            var review = $(item).children().last().text()
            if (happyHoursRegEx.test(review)) {
              review = review.match(happyHoursRegEx)
              var jsonKey = Number(key) + counter
              restaurantJson[jsonKey] = {}
              restaurantJson[jsonKey].review = review
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
      console.log("stopped extractHappyHourTime")
      allRestaurants[name] = restaurantJson
      // fs.writeFile('output.json', JSON.stringify(allRestaurants, null, 4), function(err){
      //         console.log('File successfully written! - Check your project directory for the output.json file');
      //       })
    }
  )
}


















































