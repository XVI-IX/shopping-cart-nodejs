var passport = require('passport');
var User = require('../models/user');
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