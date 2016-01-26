var express = require('express')
var router  = new express.Router()
var usersController = require('../controllers/users')
var passport = require('passport')
require("./passport")(passport)

router.route('/')
  .get(usersController.index)

router.route('/login')
  .post(usersController.login)

router.route('/signUp')
  .post(usersController.create)

router.route('/logout')
  .get(usersController.logout)

router.route('/auth/facebook')
  .get(passport.authenticate('facebook', {scope: 'email'}));

// app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'} ));

router.route('/auth/facebook/callback')
  .get(passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  }));

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect: '/',
//     failureRedirect: '/'
//   })
// );



// router.get('/welcome', usersController.index);
module.exports = router;
