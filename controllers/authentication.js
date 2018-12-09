const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      User = require('../models/user'),
      keys = require('../config/keys');

function generateToken(user){
  return jwt.sign(user, keys.jwt_secret_key, {
    expiresIn: '1d'//in one day
  });
};


//creating a serializer to function that sets the info that will be return
//for the user class
exports.setUserInfo = function(request){
  return {
    _id: request._id,
    firstName: request.firstName,
    lastName: request.lastName,
    email: request.email,
    role: request.role
  };
};

//LOGIN ROUTE token generation //

exports.login = function(req, res, next){
  let userInfo = setUserInfo(req.user);
  res.status(200).json({
    token: 'JWT' + generateToken(userInfo),
    user: userInfo
  });
};

//REGISTRATION ROUTE token generation//
exports.upperCaseNames = function(name){
    let upperCased = name[0].toUpperCase() + name.slice(1);
    return upperCased;
}

exports.register = function(req, res, next){
  //make first and last name capitalized
console.log(req.body)
const email = req.body.email;
const firstName = upperCaseNames(req.body.firstName);
const lastName = upperCaseNames(req.body.lastName);
const password = req.body.password;

//return error if no email provided
if(!email){
  return res.status(422).send({error: `You must enter an email addresss.`});
}
if(!firstName || !lastName){
  return res.status(422).send({error: 'You must enter your full name.'});
}
if(!password){
  return res.status(422).send({error: 'You must enter a password.'});
}

User.findOne({email: email}, function(err, existingUser){
  if(err){
    return next(err);
  }
  //if the user is not unique return an error telling user already with that email address
  if(existingUser){
    return res.status(422).send({error: 'That email address is already in use.'});
  }

  //if email is unique and password was provided create an account for user
  let user = new User({
    email: email,
    password: password,
    profile: {firstName: firstName, lastName: lastName}
  });

  user.save(function(err, user){
    console.log(err)
    if(err){
      return next(err);
    }

      //now also create a user token and respond with the new token
      let userInfo = setUserInfo(user);
      res.status(201).json({
        token: 'JWT' + generateToken(userInfo),
        user: userInfo
      });
  });

});

};


// Role authorization check
exports.roleAuthorization = function(role) {
  return function(req, res, next) {
    const user = req.user;
    User.findById(user._id, function(err, foundUser) {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }


      console.log('Found user', foundUser)

      // If user is found, check role.
      if (foundUser.role == role) {
        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    })
  }
}
