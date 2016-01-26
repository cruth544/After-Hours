var express = require('express')
var router  = new express.Router()
var usersController = require('../controllers/users')
var restaurantsController = require('../controllers/restaurants')


// USER ROUTES
router.route('/')
  .get(usersController.index)

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


<<<<<<< HEAD




=======
// FACEBOOK OATH ROUTES
router.route('/auth/facebook')
  .get(passport.authenticate('facebook', {scope: 'email'}));

router.route('/auth/facebook/callback')
  .get(passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  }));

>>>>>>> 6a7e486... working on seeding restaurants


// router.get('/welcome', usersController.index);
module.exports = router;
