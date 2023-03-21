var express = require('express');
var router = express.Router();
var csrf = require('@dr.pogodin/csurf');
var passport = require('passport');
var {body} = require('express-validator');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
  res.render('user/profile');
});

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout(function (err){
    if (err) {
      return next(err);
    }
  });
  res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
  next();
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0});
});

router.post('/signup',
  body('email', 'Invalid Email').notEmpty().isEmail(),
  body('password', "Invalid Password").notEmpty().isLength({min: 4}),
  function(req, res, next) {
  passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
})(req, res, next);
});


router.get('/signin', function (req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/signin',
  body('email', "Invalid Email Address").notEmpty().isEmail(),
  body('password', "Invalid Password").notEmpty().isLength({min: 4}),
  function(res, req, next) {
  passport.authenticate ('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
  })(res, req, next);
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/signin');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/signin');
}