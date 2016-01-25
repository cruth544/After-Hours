var express = require('express')
var router  = new express.Router()
var usersController = require('../controllers/users')



router.route('/')
  .get(usersController.landing)

router.route('/login')
  .post(usersController.login)

router.route('/SignUp')
  .post(usersController.create)







// router.get('/welcome', usersController.index);
module.exports = router;
