var express = require('express')
var router  = new express.Router()
var usersController = require('../controllers/users')



router.route('/')
  .get(usersController.index)
  .post(usersController.create)





// router.get('/welcome', usersController.index);
module.exports = router;
