var express = require('express')
var router  = new express.Router()
var usersController = require('../controllers/users')
var passport =


router.route('/')
  .get(usersController.index)

router.route('/login')
  .post(usersController.login)

router.route('/signUp')
  .post(usersController.create)

router.route('/logout')
  .get(usersController.logout)

router.route('/auth/facebook')
  .get(passport.authenticate('facebook', { scope: 'email'} ))







// router.get('/welcome', usersController.index);
module.exports = router;

