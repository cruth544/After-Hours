var express = require('express')
var router  = new express.Router()
var usersController = require('../controllers/users')

var restaurantsController = require('../controllers/restaurants')
 var passport = require('passport')
  require("./passport")(passport)

// USER ROUTES

router.route('/')
  .get(restaurantsController.index)

router.route('/restaurants/getAll')
  .get(restaurantsController.yelp)

router.route('/users')
  .get(usersController.users)

router.route('/login')
  .post(usersController.login)

router.route('/signUp')
  .post(usersController.create)

router.route('/logout')
  .get(usersController.logout)

router.route('/auth/facebook')
  .get(passport.authenticate('facebook', {scope: 'email'}));

router.route('/auth/facebook/callback')
  .get(passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  }));

// RESTAURANT ROUTES
router.route('/restaurants/all')
  .get(restaurantsController.all)

router.route('/restaurants/create')
  .post(restaurantsController.create)

router.route('/:name' )
  .get(restaurantsController.show)
  .delete(restaurantsController.delete)

router.route('/:name/edit')
  .get(restaurantsController.edit)
  .post(restaurantsController.update)

router.route('/restaurants/new')
  .get(restaurantsController.new)

// API ROUTE (RESTAURANTS)
router.route('/restaurants/api')
  .get(restaurantsController.showApi)
  .post(restaurantsController.create)
router.route('/restaurants/api/:name')
  .get(restaurantsController.showOneApi)
  .post(restaurantsController.update)
  .delete(restaurantsController.delete)




module.exports = router;
