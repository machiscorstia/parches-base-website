var express = require('express');
const passport = require('passport');
var router = express.Router();

const userController = require('../controllers/userController')

router.get('/register', userController.renderRegisterPage)

router.post('/register', userController.postNewUser)

router.get('/login', userController.renderLoginPage)

router.get('/profile', userController.isLoggedIn, userController.renderProfile)

router.get('/facebook', passport.authenticate('facebook', { scope: 'email'}));

router.get('/facebook/callback', passport.authenticate('facebook', { 
    successRedirect: '/user/profile',
    failureRedirect: '/user/login' }
));

module.exports = router;
