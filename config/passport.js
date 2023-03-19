var passport = require('passport');
var User = require('../models/user');
var {body, validationResult} = require('express-validator');
var {formatter} = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then(
      function (user) {
        done(null, user);
      },
      function (err) {
        done(err);
      }
    );
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {

  body('email').notEmpty().isEmail().withMessage("Invalid Email");
  body('password').isStrongPassword().withMessage("Invalid Password");
  
  const errors = validationResult(req).formatWith(formatter);


  console.log(errors);
  if (errors) {
    var messages = [];
    Array(errors.errors).forEach(function(error) {
      console.log(error);
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }

  User.findOne({ 'email': email })
    .then(
      function (user) {
        if (user) {
          return done(null, false, { message: 'Email is already in use' });
        }

        // New user creation
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save()
          .then(
            function (result) {
              return done(null, newUser);
            },
            function (err) {
              return done(err);
            }
          );
        },
      function (err) {
        if (err) {
          return done(err);
        }
      });
})
);

passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
  body('email').notEmpty().isEmail().withMessage("Invalid Email Address");
  body('password').notEmpty().isStrongPassword().withMessage("Not a Strong password");

  var errors = validationResult(req).formatWith(formatter);

  if (errors) {
    var messages = [];
    Array(errors.errors).forEach(function (error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }

  User.findOne({'email': email})
  .then(
    function (user) {
      if (!user) {
        return done(null, false, {message: "User not found"});
      } else if (!user.validPassword(password)) {
        return done(null, false, {message: "Invalid Password"});
      }

      return done(null, user);
    }

  )
}));