var express = require('express');
var router = express.Router();
const passport = require('passport')
const userController = require('../controller').user;
const footerController = require('../controller').footer
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
router.get('/api/user/:id',private,userController.getUserById)
router.put('/api/user',private,userController.updateUserById)

// Footer Controller
router.post('/api/footer',private,footerController.add)
router.put('/api/footer',private,footerController.update)
router.get('/api/footer/:id',private,footerController.getFooterById)

module.exports = router;
