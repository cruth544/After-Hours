var express = require('express')
var router  = new express.Router()
var usersController = require('../controllers/users')
var restaurantsController = require('../controllers/restaurants')



// USER ROUTES
var restaurantsController = require('../controllers/restaurants')

// USER ROUTES
router.route('/')
  .get(restaurantsController.index)

router.route('/login')
  .post(usersController.login)

router.route('/signUp')
  .post(usersController.create)

router.route('/logout')
  .get(usersController.logout)

// RESTAURANT ROUTES
router.route('/restaurants/all')
  .get(restaurantsController.all)
router.route('/:name' )
  .get(restaurantsController.show)

// router.get('/welcome', usersController.index);
module.exports = router;
