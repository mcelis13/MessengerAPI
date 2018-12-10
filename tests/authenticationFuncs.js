const jwt = require('jsonwebtoken');

exports.setUserInfo = function(request){
  return {
    _id: request._id,
    firstName: request.firstName,
    lastName: request.lastName,
    email: request.email,
    role: request.role
  };
};


exports.upperCaseNames = function(name){
    let upperCased = name[0].toUpperCase() + name.slice(1);
    return upperCased;
}

exports.generateToken = function(user){
  const jwt_secret_key = 'blahblahblah';
  return jwt.sign(user, jwt_secret_key);
};
