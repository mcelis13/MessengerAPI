//Importing passport, strategies and config

const passport = require('passport'),
      User = require('../models/user'),
      config = require('./main'),
      keys = require('./keys'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local');

//we will be using the email field and password to authenticate
//so we are letting passport know that we are replacing our
//username field with our email field
const localOptions = {usernameField: 'email'}

//Found in jwt documentation to create login
//first set up LOCAL login strategy //which mean using email/password/finding user
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  //find user by email address and return user or error
  User.findOne({email: email}, function(err, user){
    //done is a passport error first callback accepting arguments done(error, user, info)
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

//Setting up JWT authentication options
const jwtOptions = {
  //telling jwt to look at the authorization header for the jwt token
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  //telling jwt where to find my secret jwt key
  secretOrKey: keys.jwt_secret_key
};

//Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  console.log(payload);
  User.findById(payload._id, function(err, user){
    //done is a passport error first callback accepting arguments done(error, user, info)
    if (err){
      return done(err, false);
    }
    if (user){
      return done(null, user);
    }else{
      return done(null, false);
    }
  });
});

//this is where passport actually uses the functions we created above to authenticate and login
passport.use(jwtLogin);
passport.use(localLogin);
