var express = require('express')
var router  = new express.Router()
var usersController = require('../controllers/users')



router.route('/')
  .get(usersController.landing)

// User Routes
router.route('/user/new')
  .get(usersController.new)



// router.get('/welcome', usersController.index);
module.exports = router;
