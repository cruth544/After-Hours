'use strict'

require('dotenv').load()

var express = require('express'),
    SessionStore = require('session-mongoose')(express)
var app = express()
// var helpers = require('express-helpers')()
// app = helpers.all(app);
var Promise = require('bluebird')
var path  = require('path');
var passport   = require('passport');
var path  = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var passport       = require('passport')
var dbConfig = require('./db/credentials.js')
var mongoose = Promise.promisifyAll( require('mongoose'))
var helper = require('./helper.js')
app.locals = helper

var credentials = require('./config/credentials.js')
app.use( require('cookie-parser')(credentials.cookieSecret))
app.use( require('express-session')({
  resave: false, saveUnitialized: false,
  secret: credentials.cookieSecret }))

// Set View Engine to EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(cookieParser())
app.use('/public', express.static('public'));
app.use(passport.initialize());
app.use(
 express.session({
   store: new SessionStore({
   url: 'mongodb://mongolab.com:51665/heroku_h1907377/session',
   interval: 1200000
 }),
 cookie: { maxAge: 1200000 },
 secret: 'my secret'
}))
var routes = require('./config/routes')
app.use('/', routes)

app.get('/yelp/:location/:term', function (req, res) {
  console.log("Made yelp api call")
})



// use db connection string based on whether the environment is development or production
switch(app.get('env')){
  case 'development':
      mongoose.connect(dbConfig.mongo.dev.conn, dbConfig.mongo.options);
      break;
  case 'production':
      mongoose.connect(dbConfig.mongo.prod.conn, dbConfig.mongo.options);
      break;
  default:
      throw new Error('Unknown execution environment: ' + app.get('env'));
}

// var server = http.createServer(app).listen( process.env.PORT || 3000, function () {
//     console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
//   })
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
console.log("Server starting...go to localhost:3000")
