var express = require('express')
var router  = new express.Router()
var usersController = require('../controllers/users')
var restaurantsController = require('../controllers/restaurants')

<<<<<<< HEAD

=======
var restaurantsController = require('../controllers/restaurants')


// USER ROUTES
var restaurantsController = require('../controllers/restaurants')

// USER ROUTES
>>>>>>> 389fe8d019fcd61b980ef5499f59dd42786e8a13
router.route('/')
  .get(restaurantsController.index)

router.route('/users')
  .get(usersController.users)

router.route('/login')
  .post(usersController.login)

router.route('/signUp')
  .post(usersController.create)

router.route('/logout')
  .get(usersController.logout)

<<<<<<< HEAD
router.route('/auth/facebook')
  .get(passport.authenticate('facebook', {scope: 'email'}));


router.route('/auth/facebook/callback')
  .get(passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  }));

=======
// RESTAURANT ROUTES
router.route('/restaurants/all')
  .get(restaurantsController.all)
router.route('/:name' )
  .get(restaurantsController.show)
>>>>>>> 389fe8d019fcd61b980ef5499f59dd42786e8a13

// router.get('/welcome', usersController.index);
module.exports = router;
