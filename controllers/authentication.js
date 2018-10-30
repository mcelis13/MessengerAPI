const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      User = require('../models/user'),
      keys = require('../config/keys');

function generateWebToken(user){
  return jwt.sign(user, keys.jwt_secret_key, {
    expiresIn: 30080 //in seconds
  });
};


//creating a serializer to function that sets the info that will be return
//for the user class
function setUserInfo(request){
  return {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
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

exports.register = function(req, res, next){
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;

  //return error if no email provided
  if(!email){
    return res.status(422).send({error: 'You must enter an email addresss.'});
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

    //AT THIS MOMENT I COULD SEND AN EMAIL TO THE USER IF I NEEDED TO CONFIRM THE EMAIL ACCOUNT
    //BEFORE SAVING MY USER

    user.save(function(err, user){
      if(err){
        //incase user was not successfully saved
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

      // If user is found, check role.
      if (foundUser.role == role) {
        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    })
  }
}
