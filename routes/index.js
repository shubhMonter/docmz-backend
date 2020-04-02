var express = require('express');
var router = express.Router();
const passport = require('passport')
const userController = require('../controller').user;

require('../database/config/passport')(passport);

const getToken =  ((headers) => {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
})

const private = passport.authenticate('jwt-private', { session: false})

// User Controller
router.post('/api/user/signin', userController.signin);
router.post('/api/user/signup', userController.signup);




module.exports = router;
