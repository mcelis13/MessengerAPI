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
