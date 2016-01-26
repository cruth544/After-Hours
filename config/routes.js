var express = require('express')
var router  = new express.Router()
var usersController = require('../controllers/users')
var restaurantsController = require('../controllers/restaurants')

router.route('/')
  .get(restaurantsController.index)

router.route('/restaurants/getAll')
  .get(restaurantsController.yelp)

router.route('/login')
  .post(usersController.login)

router.route('/signUp')
  .post(usersController.create)

router.route('/logout')
  .get(usersController.logout)

// router.get('/welcome', usersController.index);
module.exports = router;
