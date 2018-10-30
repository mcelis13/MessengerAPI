//Importing passport, strategies and config

const passport = require('passport'),
      User = require('../models/user'),
      config = require('./main'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local');

//we will be using the email field and password to authenticate
//so we are letting passport know that we are replacing our
//username field with our email field
const localOptions = {usernameField: 'email'}

//Found in jwt documentation to create login
//first set up local login strategy //which mean using email/password/finding user
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  //find user by email address and return user or error
  User.findOne({email: email}, function(err, user){
    if(err){
      return done(err);
    }
    if(!user) {
      return done(null, false, { error: 'Your login details could not be verified. Please try again.'});
    }

    user.comparePassword(password, function(err, isMatch){
      if(err){
        return done(err)
      }
      if(!isMatch){
        return done(null, false, {error: 'Your login details could not be verified. Please try again.'});
      }

      return done(null, user)
    })
  });
});
