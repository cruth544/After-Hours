
require('dotenv').load()

var express = require('express')
var app = express()
var Promise = require('bluebird')
var path  = require('path');

var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/After-Hours')


// Set View Engine to EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
// Middlewares
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(cookieParser())


var routes = require('./config/routes')
app.use('/', routes)


app.listen(3000)
console.log("Server starting...go to localhost:3000")
