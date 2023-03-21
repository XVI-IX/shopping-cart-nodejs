var passport = require('passport');
var User = require('../models/user');
var {validationResult} = require('express-validator');
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
  
  // check('email', 'Invalid Email').notEmpty().isEmail();
  // check('password', 'Invalid Password').isLength({min: 4});
  
  const errors = validationResult(req).array();

  console.log(errors);
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      console.log(error);
      messages.push(error.msg);
    });

    console.log(messages);
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
            function (newUser) {
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

  const errors = validationResult(req).array();

  console.log(errors);
  if (errors) {
    var messages = [];
    errors.forEach(function(error) {
      console.log(error);
      messages.push(error.msg);
    });

    console.log(messages);
    return done(null, false, req.flash('error', messages));
  }

  User.findOne({'email': email})
  .then(
    function (user) {
      if (!user) {
        return done(null, false, { message: "User not found" });
      } else if (!user.validPassword(password)) {
        return done(null, false, { message: "Invalid Password" });
      }
      return done(null, user);
    },
    function (err) {
      return done(err);
    }
  )
}));