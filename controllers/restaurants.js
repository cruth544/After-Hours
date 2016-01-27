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
          // console.log(restaurant)
          // console.log(req.session)
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
      yelp.search({ term: 'happy hour', location: 90013, limit: '10', sort: '0'})
    .then(function (data) {

      yelpParse(data, businessesJson, function () {
        responsesCompleted++
        console.log(responsesCompleted)
        if (responsesCompleted === data.businesses.length) {
          console.log('returning')
          businessesJson = getTimes(businessesJson)
          res.send(businessesJson)

          // fs.writeFile('output.json', JSON.stringify(businessesJson, null, 2), function(err){
          //   console.log('File successfully written! - Check your project directory for the output.json file');
          // })
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
      // check database if entry exists
      checkDataBaseFor(restaurant.location.display_address.join(' '), function (dbRestaurant) {
        // body...
        if (dbRestaurant) {
          console.log("MATCH!\n")
          // if entry does exist, add it to the businessJson and continue
          businessJson[restaurant.name] = dbRestaurant
          complete()
        } else {
          console.log("No match\n")
        // otherwise continue with scraping
        // grabing yelp api stuff and storing it
  /////////////////////// ADD STUFF FROM YELP HERE/////////////////////////
          if (restaurant.location.display_address) {
            var address = restaurant.location.display_address.join(' ')
          }
          businessJson[restaurant.name].contact = {
            phone  : restaurant.display_phone,
            address: address,
            yelpUrl: restaurant.url
          }
          businessJson[restaurant.name].image = restaurant.image_url
          businessJson[restaurant.name].location = {
            lat: restaurant.location.coordinate.latitude,
            lng: restaurant.location.coordinate.longitude
          }
  /////////////////////////////////END/////////////////////////////////////

          // start checking yelp reviews
          getReviewCount(restaurant.name, restaurant.url, businessJson, function () {
            complete()
          })
        }
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
      // first going to grab website url and store it
      var websiteAddress = $('.biz-website').children().last().attr('href')
      if (websiteAddress) {
        var http = websiteAddress.match(/http.*?&/)[0]
          .replace(/%2F/g, '/')
          .replace(/%3A/g, ':')
          .replace(/&/g, '')
      }
      businessJson[name].contact.website = http
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
      var searchUrl = url
      searchUrl += '?start=' + counter
      searchUrl += '&q=happy%20hour'
      request({url: searchUrl}, function (err, res, body) {
        if (!err) {
          var $ = cheerio.load(body)
          var reviews = $('.review-content')
          var happyHoursRegEx = /((until|up to|till|til)\s(1[012]|[1-9])(:[0-6]\d)?\s?([AaPp]\.?[mM]\.?)?|((1[012]|[1-9])(:[0-6]\d)?\s?([AaPp]\.?[mM]\.?)?((\s(to|through|and|until)\s)|(-))(1[012]|[1-9])(:[0-6]\d)?\s?([AaPp]\.?[mM]\.?)?))/g
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


function checkDataBaseFor (restaurantAddress, complete) {
  Restaurant.find({}, function (err, restaurants) {
    for (var i = 0; i < restaurants.length; i++) {
      var dbAddress = restaurants[i].contact.address
      var dbStreetNumber = dbAddress.match(/^\d*/)[0]
      var dbZipCode = dbAddress.match(/\d{5}$/)[0]
      var checkStreetNumber = restaurantAddress.match(/^\d*/)[0]
      var checkZipCode = restaurantAddress.match(/\d{5}$/)[0]
      if (dbZipCode === checkZipCode) {
        if (dbStreetNumber === checkStreetNumber) {
          return complete(restaurants[i])
        }
      }
    }
    return complete(false)
  })
}


// restaurantList param here is the passed in json compiled from scrape

function getTimes (restaurantList) {
  var sortedHappyHourTimes = {}
  for (var restaurantName in restaurantList) {
    var obj = {}
    obj.timeFrequency = {}
    obj.timeStrings = []
    for (var reviewNumber in restaurantList[restaurantName].reviews) {
      var reviews = restaurantList[restaurantName].reviews[reviewNumber]
      for (var i = 0; i < reviews.length; i++) {
        obj.timeStrings.push(reviews[i])
        var num = reviews[i].match(/\d{1,2}/g)
        for (var j = 0; j < num.length; j++) {
          if (num[j]) {
            if (obj.timeFrequency[num[j]]) {
              obj.timeFrequency[num[j]]++
            } else {
              obj.timeFrequency[num[j]] = 1
            }
          }
        }
      }
    }
    restaurantList[restaurantName].timeStrings = obj.timeStrings
    restaurantList[restaurantName].timeCalculations = {timeFrequency: obj.timeFrequency}
  }
  return probableHappyHourTimes(restaurantList)
}

function probableHappyHourTimes (restaurantList) {
  for (var restaurantName in restaurantList) {
    var obj = {}
    var frequency = restaurantList[restaurantName].timeCalculations.timeFrequency
    var sortTime = []

    for (var time in frequency) {
      sortTime.push([time, frequency[time]])
    }
    sortTime.sort(function (a, b) {
      return b[1] - a[1]
    })
    restaurantList[restaurantName].timeCalculations.sortedTime = sortTime
  }
  return storeTimes(restaurantList)
}

function storeTimes (restaurantList) {
  var targetAverage = 6

  for (var restaurantName in restaurantList) {
    var obj = {}
    var sortedTime = restaurantList[restaurantName].timeCalculations.sortedTime
    if (sortedTime.length === 0) {
      obj.time = {
        startTime: null,
        endTime: null
      }
      continue
    }
    var mostEqualsArray = [sortedTime[sortedTime.length - 1]]
    var secondEqualsArray = [sortedTime[sortedTime.length - 1]]

    for (var i = sortedTime.length - 2; i >= 0; i--) {
      if (sortedTime[i][1] > mostEqualsArray[0][1]) {
        secondEqualsArray = mostEqualsArray
        mostEqualsArray = [sortedTime[i]]

      } else if (sortedTime[i][1] === mostEqualsArray[0][1]) {
        mostEqualsArray.push(sortedTime[i])

      } else {
        if (sortedTime[i][1] > secondEqualsArray[0][1]) {
          secondEqualsArray = [sortedTime[i]]

        } else if (sortedTime[i][1] === secondEqualsArray[0][1]) {
          secondEqualsArray.push(sortedTime[i])
        }
      }
    }

    if (mostEqualsArray.length === 1 && secondEqualsArray.length === 1) {
      if (/\d{1,2}/.test(mostEqualsArray[0][0]) && /\d{1,2}/.test(secondEqualsArray[0][0])) {
        var most = Number(mostEqualsArray[0][0])
        var second = Number(secondEqualsArray[0][0])
      }
    } else if (mostEqualsArray.length === 2 && mostEqualsArray.length > secondEqualsArray.length) {
        var most = Number(mostEqualsArray[0][0])
        var second = Number(mostEqualsArray[1][0])

    } else {
      if (mostEqualsArray.length === 1) {
        var most = Number(mostEqualsArray[0][0])

      if (secondEqualsArray.length > 1) {
        var targetAverage = 6
        var second = Number(secondEqualsArray[0][0])

        for (var i = 0; i < secondEqualsArray.length; i++) {
          var current = Number(secondEqualsArray[i][0])
          var avg = (most + current) / 2

          if (Math.abs(targetAverage - current) < Math.abs(targetAverage - second)) {
            second = current
          }
        }
      }

    } else if (secondEqualsArray.length === 1) {
      var second = Number(secondEqualsArray[0][0])
      if (mostEqualsArray.length > 1) {
        var targetAverage = 6
        var most = Number(mostEqualsArray[0][0])

        for (var i = 0; i < mostEqualsArray.length; i++) {
          var current = Number(mostEqualsArray[i][0])
          var avg = (second + current) / 2

          if (Math.abs(targetAverage - current) < Math.abs(targetAverage - most)) {
              most = current
            }
          }
        }
      }
    }
    if (most > second) {
      obj.time = {
        startTime: second,
        endTime: most
      }

    } else if (second > most) {
      obj.time = {
        startTime: most,
        endTime: second
      }

    } else {
      obj.time = {
          startTime: null,
          endTime: most
      }
    }
    restaurantList[restaurantName].time = obj.time
  }
  return restaurantList
}

































