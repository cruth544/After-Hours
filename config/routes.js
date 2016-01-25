var express = require('express')
    router  = new express.Router();

// Require user controllers.
var usersController   = require('../controllers/users');

// users resource paths:
router.get('/', usersController.landing);
// router.get('/welcome', usersController.index);
module.exports = router;
