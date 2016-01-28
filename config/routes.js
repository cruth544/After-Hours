var express = require('express')
var router  = new express.Router()
var usersController = require('../controllers/users')

var restaurantsController = require('../controllers/restaurants')
 var passport = require('passport')
  require("./passport")(passport)


// entry page for After Hours
router.route('/welcome')
  .get(usersController.enter)

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

router.route('/editProfile')
  .get(usersController.show)
  .put(usersController.update)
  .delete(usersController.delete)

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

module.exports = router;
