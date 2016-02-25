var Restaurant  = require("../models/restaurant")
var User        = require("../models/user")
var Yelp        = require('yelp')
var cheerio     = require('cheerio')
var async       = require('async')
var fs          = require('fs')
var request     = require('request')
var bcrypt      = require('bcrypt')

var mongoose = require('mongoose')
// require('../db/seed.js').seedRestaurants()

var userData = (function () {
  var dateObject = new Date()
  var daysOfTheWeekReference = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  // accessible variables
  var coordinates = {
    lat: 34.031245,
    lng: -118.266532
  }
  var location = ""
  var offset = 0
  var time = dateObject.getHours() + dateObject.getMinutes() / 60
  var day = dateObject.getDay()

  return {
    getCoordinates: function () {
      return coordinates
    },
    setCoordinates: function (newCoordinates) {
      if (newCoordinates) {
        if (typeof newCoordinates.lat === 'string') {
          newCoordinates.lat = Number(newCoordinates.lat)
        }
        if (typeof newCoordinates.lng === 'string') {
          newCoordinates.lng = Number(newCoordinates.lng)
        }
        return coordinates = newCoordinates
      }
    },
    getLocation: function () {
      return location
    },
    setLocation: function (newLocation) {
      if (newLocation) {
        return location = newLocation
      }
    },
    getOffset: function () {
      return offset
    },
    incrementOffset: function () {
      offset += 20
      return offset
    },
    getTime: function () {
      return time
    },
    setTime: function (newTime) {
      if (newTime) {
        return time = newTime
      }
    },
    getDay: function () {
      return daysOfTheWeekReference[day] // returns string of day
    },
    setDay: function (newDay) {
      if (typeof newDay === 'string') {
        newDay = newDay.toLowerCase()
        if (daysOfTheWeekReference.indexOf(newDay) > -1) {
          day = daysOfTheWeekReference.indexOf(newDay)
        } else {
          throw "Day needs to be a day of the week"
        }
      } else if (typeof newDay === 'number') {
        if (newDay >= 0 && newDay < 7) {
          day = newDay
        } else {
          throw "Day needs to be a number 0 - 6"
        }
      } else {
        throw "Day needs to be a number 0 - 6 or a day of the week"
      }
      return day // returns string of day
    }
  }
})()
function setUserData (data) {
  for (var setting in data) {
    for (var method in userData) {
      if (method.includes('set')) {
        if (method.toLowerCase().includes(setting)) {
          if (!/[a-zA-Z]+/.test(data[setting])) {
            data[setting] = Number(data[setting])
          }
          userData[method](data[setting])
          break
        }
      }
    }
  }
}
function getUserData () {
  var data = {}
  for (var method in userData) {
    if (method.includes('get')) {
      data[method.slice(3).toLowerCase()] = userData[method]()
    }
  }
  return data
}


module.exports = {

  index: function (req, res, next) {
    console.log("IN INDEX")
    // if there is a match for someone in the database, find them and render their profile
    if(req.session && req.session.email){
        console.log("There is a USER")
        User.findOne({ email: req.session.email }).then(function(user){
            res.render('restaurants/index',{
                curr_user: user.email,
                user: req.user,
                users: null  })
        })
    }
    else{
        console.log("NO USER")
        User.find({})
            .then( function(users){
                console.log("IN THEN")
                res.render('restaurants/index', {
                    curr_user: null,
                    user: req.user,
                    users: users
                })
            }, function (err) {
              console.log(err)
            })
        }
  },

  all: function (req, res, next) {

    if (req.user == undefined ) {
      res.render('enter')
    } else {
    {Restaurant.find({}, function (err, restaurants) {
      User.findOne({ email: req.session.email }).then(function(user){

          res.render('restaurants/all', { restaurants: restaurants,
                                           curr_user: user.email,
                                           user: req.user,
                                           users: null })
        }
       )}
    )}
  }

},

  show: function (req, res, next) {

    if (req.user == undefined ) {
      res.render('enter')
    } else {
    {Restaurant.findOne({ name: String(req.params.name)}, function (err, restaurant) {
      User.findOne({ email: req.session.email }).then(function(user){

          res.render('restaurants/show', { restaurant: restaurant,
                                           curr_user: user.email,
                                           user: req.user,
                                           users: null })
        }
       )}
    )}
  }

},
  // Submit form data via restaurants/new
  create: function (req, res, next) {

  function stringTimeToNumber(time) {
  time = time.split(':')
  var hours = Number(time[0])
  var minutes = Number(time[1])

  time = hours + minutes / 60
  time = (Math.round(time * 4) / 4).toFixed(2);

  return time
}
    saveRestaurant(req.body).save(function (err) {
      if (err) console.log(err)
      else res.send('Restaurant created!')
    })
  },
  // Restaurant Form Page

  new: function (req, res, next) {

    // if there is a match for someone in the database, find them and render their profile
    if(req.session && req.session.email){
        User.findOne({ email: req.session.email }).then(function(user){
            res.render('restaurants/new',{
                curr_user: user.email,
                user: req.user,
                users: null  })
        })
    }
    else{
        User.findAsync({})
            .then( function(users){
                res.render('restaurants/new', {
                    curr_user: null,
                    user: req.user,
                    users: users
                })
            }).catch()
        }
  },

  edit: function (req, res, next) {
    Restaurant.findOne({ name: String(req.params.name)}, function (err, restaurant) {
      User.findOne({ email: req.session.email }).then(function(user){
          res.render('restaurants/edit', {restaurant: restaurant,
                                           curr_user: user.email,
                                           user: req.user,
                                           users: null })
    })
   })
  },

  update: function (req, res, next) {
    // if(user.admin){

      function stringTimeToNumber(time) {
        time = time.split(':')
        var hours = Number(time[0])
        var minutes = Number(time[1])

        time = hours + minutes / 60
        time = (Math.round(time * 4) / 4).toFixed(2);

        return time
      }
    Restaurant.findOneAndUpdate({name: String(req.params.name)}, {
          name   : req.body.name,
          image  : req.body.image,
          hours  :{
              monday: { scheduled: req.body.monday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              },
              tuesday:{ scheduled: req.body.tuesday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              },
              wednesday: { scheduled: req.body.wednesday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              },
              thursday: { scheduled: req.body.thursday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              },
              friday: { scheduled: req.body.friday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              },
              saturday: { scheduled: req.body.saturday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              },
              sunday: { scheduled: req.body.saturday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              }
          },
          drinks : req.body.drinks,
          food   : req.body.food,
          contact: { website: req.body.website,
                     phone  : req.body.phone,
                     address: req.body.address,
                     yelpUrl: req.body.yelpUrl
                    }
    }, function (err) {
     if (err) console.log(err)
     // else res.send("Restaurant updated");
     else Restaurant.findOne({ name: String(req.params.name)}, function (err, restaurant) {
      User.findOne({ email: req.session.email }).then(function(user){
          res.render('restaurants/show', { restaurant: restaurant,
                                           curr_user: user.email,
                                           user: req.user,
                                           users: null })
     })
   })

  })
// }
},

  delete: function (req, res, next) {
    if(user.admin){
    Restaurant.findOneAndRemove({name: String(req.params.name)}, function (err, restaurant) {
      res.send('Restaurant deleted')
    })
  }
  },


  // API STUFF
  showApi: function(request, response, next) {
    var email = request.params.email
    var password = request.params.password
    User.find({ email: email }, function (error, userList) {
      userList.forEach(function (user) {
        bcrypt.compare(password, user.password, function (err, res) {
          if (res) {
            Restaurant.find({}, function (error, restaurantList) {
              response.send(restaurantList)
            })
          } else {
            console.log("inside else")
            response.json({error: 'You are not authorized to view this list'})
          }
        })
      })
    })
  },

  showOneApi: function(request, response, next) {
    var name = request.params.name
    var email = request.params.email
    var password = request.params.password
    User.find({ email: email }, function (error, userList) {
      userList.forEach(function (user) {
        bcrypt.compare(password, user.password, function (err, res) {
          if (res) {
            Restaurant.find({ name: name }, function (error, restaurantList) {
              response.send(restaurantList)
            })
          } else {
            console.log("inside else")
            response.json({error: 'You are not authorized to view this list'})
          }
        })
      })
    })
  },

  //YELP STUFF
  yelp: function (req, res, next) {
    console.log('fetching from yelp...')
    // CHECK FOR CURRENT USER
    var businessJson = {}
    var responsesCompleted = 0
    var yelp = new Yelp({
      consumer_key: 'ppGF7cs331hgnbdAMFtrKQ',
      consumer_secret: 'vZIA3bJyHdn9q9JLLgLeY6c35eE',
      token: '8pSTKEbNQJ7P8zx8ECZdIUDknncrjPLq',
      token_secret: 'Z2t6RPX8FOlA43xpFmWppg8J_hI'
    })
    setUserData(req.query)

    var searchParams = {
      term: 'happy hour',
      location: req.query.location,
      limit: '11',
      offset: req.query.offset,
      sort: '0'
    }
    if (!searchParams.location) searchParams.location = 'Los Angeles'
    if (!searchParams.offset) searchParams.offset = 0
    if (req.query.coordinates) {
      var geoString = req.query.lat + "," + req.query.lng
      searchParams.cll = geoString
    }

    yelp.search(searchParams)
    .then(function (data) {
      yelpParse(data, businessJson, function () {
        responsesCompleted++
        console.log(responsesCompleted)
        if (responsesCompleted === data.businesses.length) {
          console.log('returning')
          businessJson = getTimes(businessJson)
          onlyShowHappyHourNow(businessJson, userData.getDay(), userData.getTime(), function (currentHappyHourJson) {
            console.log("onlyShowHappyHourNow complete")
            res.send({
              restaurants: currentHappyHourJson,
              settings: getUserData()
            })
          })
          // res.send(businessJson)

          // fs.writeFile('output.json', JSON.stringify(businessJson, null, 2), function(err){
          //   console.log('File successfully written! - Check your project directory for the output.json file');
          // })
        }
      })
    }).catch(function (err) {
      console.log(err)
    })
  }
}

function onlyShowHappyHourNow (businessJson, day, intTime, complete) {
  var noHappyHoursArray = []

  function currentlyHavingHappyHour (restaurant) {
    if (restaurant.hours) {
      var restaurantTimes = restaurant.hours[day].time
      for (var i = 0; i < restaurantTimes.length; i++) {
        if (restaurantTimes[i]) {
          if (intTime < restaurantTimes[i].endTime) {
            if (restaurantTimes[i].startTime) {
              if (intTime >= restaurantTimes[i].startTime) {
                return true
              }
            } else {
              return true
            }
          }
        }
      }
    } else {
      var time = restaurant.time
      if (time) {
        if (intTime < time.endTime) {
          if (time.startTime) {
            if (intTime >= time.startTime) {
              return true
            }
          } else {
            return true
          }
        }
      }
    }
    return false
  }

  for (var restaurantName in businessJson) {
    console.log("checking " + restaurantName)
    if (!currentlyHavingHappyHour(businessJson[restaurantName])) {
      console.log("No happy hour... Removing...")
      noHappyHoursArray.push(restaurantName)
    } else console.log("Happy Hour!")
  }
  for (var i = 0; i < noHappyHoursArray.length; i++) {
    delete businessJson[noHappyHoursArray[i]]
  };
  return complete(businessJson)
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
        if (dbRestaurant) {
          console.log("MATCH! " + restaurant.name + "\n")
          // if entry does exist, add it to the businessJson and continue
          businessJson[restaurant.name] = dbRestaurant
          complete()
        } else {
        // otherwise continue with scraping
        // grabing yelp api stuff and storing it
/////////////////////// ADD STUFF FROM YELP HERE/////////////////////////
          businessJson[restaurant.name].name = restaurant.name
          if (restaurant.location.display_address) {
            var address = restaurant.location.display_address.join(' ')
          }
          businessJson[restaurant.name].contact = {
            phone  : restaurant.display_phone,
            address: address,
            coordinates: {
              lat: restaurant.location.coordinate.latitude,
              lng: restaurant.location.coordinate.longitude
            },
            yelpUrl: restaurant.url
          }
          businessJson[restaurant.name].image = restaurant.image_url
///////////////////////////////////END///////////////////////////////////

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
  console.log("checking review count...")
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

      reviewCount = reviewCount.match(reviewCountRegEx)
      if (!reviewCount) {
        console.log("no review count")
        console.log($('h2').text())
        delete businessJson[name]
        return complete()
      }
      console.log("there are reviews")
      reviewCount = reviewCount[0]
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
          callback()
        }
      })
    },
    function (err) {
      console.log(name)
      businessJson[name].reviews = restaurantJson
      complete()
    })
}


function checkDataBaseFor (restaurantAddress, complete) {
  Restaurant.find({}, function (err, restaurants) {
    for (var i = 0; i < restaurants.length; i++) {
      var dbAddress = restaurants[i].contact.address

      var dbStreetNumber = dbAddress.match(/^\d*/)
      var dbZipCode = dbAddress.match(/\d{5}$/)
      if (!dbStreetNumber || !dbZipCode) return complete(false)
      dbStreetNumber = dbStreetNumber[0]
      dbZipCode = dbZipCode[0]
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
    if (restaurantList[restaurantName].hours) continue
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
    if (restaurantList[restaurantName].hours) continue
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
    if (restaurantList[restaurantName].hours) continue
    var obj = {}
    var sortedTime = restaurantList[restaurantName].timeCalculations.sortedTime
    if (sortedTime.length === 0) {
      obj.time = {
        startTime: null,
        endTime: null
      }
      saveRestaurantToDB(restaurantList[restaurantName])
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
          if (current > 23) continue
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
        startTime: second + 12,
        endTime: most + 12
      }

    } else if (second > most) {
      obj.time = {
        startTime: most + 12,
        endTime: second + 12
      }

    } else {
      obj.time = {
          startTime: null,
          endTime: most + 12
      }
    }
    restaurantList[restaurantName].time = obj.time
    restaurantList[restaurantName].drinks = true
    saveRestaurantToDB(restaurantList[restaurantName])

  }
  return restaurantList
}

function saveRestaurantToDB (restaurant) {
  var newRestaurant = new Restaurant()
  var hourObj = {}
  var restaurantKeys = Object.keys(Restaurant.schema.paths)
  var dayOfWeekRegEx = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/
  for (var i = 0; i < restaurantKeys.length; i++) {
    if (dayOfWeekRegEx.test(restaurantKeys[i])) {
      var day = restaurantKeys[i].match(dayOfWeekRegEx)
      if (day) {
        day = day[0]
        if (!hourObj[day]) {
          hourObj[day] = {time: []}
          hourObj[day].time.push(restaurant.time)
        }
      }
    }
  }
  var yelpKeys = Object.keys(restaurant)
  for (var i = 0; i < yelpKeys.length; i++) {
    newRestaurant[yelpKeys[i]] = restaurant[yelpKeys[i]]
  }
  newRestaurant.hours = hourObj
  console.log("saving... " + newRestaurant.name)
  newRestaurant.save(function (err) {
    if (err) console.log(err); console.log(newRestaurant.name)
  })
  return newRestaurant
}




function saveRestaurant( data ){
  var newRestaurant = new Restaurant ({
          name   : req.body.name,
          image  : req.body.image,
          hours  :{
              monday: { scheduled: req.body.monday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              },
              tuesday:{ scheduled: req.body.tuesday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              },
              wednesday: { scheduled: req.body.wednesday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              },
              thursday: { scheduled: req.body.thursday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              },
              friday: { scheduled: req.body.friday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              },
              saturday: { scheduled: req.body.saturday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              },
              sunday: { scheduled: req.body.saturday,
                        time: [{
                                startTime: stringTimeToNumber(req.body.start_time),
                                endTime  : stringTimeToNumber(req.body.end_time)
                        }]
              }
          },
          drinks : req.body.drinks,
          food   : req.body.food,
          contact: { website: req.body.website,
                     phone  : req.body.phone,
                     address: req.body.address,
                     yelpUrl: req.body.yelpUrl
                    }
    })

  return newRestaurant
}
