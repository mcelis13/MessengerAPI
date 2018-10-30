const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt-nodejs');


const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    firstName: {type: String},
    lastName: {type: String}
  },
  role: {
    type: String,
    enum: ['Member', 'Client', 'Owner', 'Admin'],
    default: 'Member'
  },
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date}
}, {timestamps: true});

//Before the User is saved we have to hash their password

UserSchema.pre('save', function(next){
  const user = this,
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  //salt factor determines the number of rounds the data is processed
  //more rounds means more secure but slower process
  return bcrypt.genSalt(5).then((salt) => {
    // hash the password along with our new salt
    return bcrypt.hash(user.password, salt).then((hash) => {
      // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    }).catch(next);
  }).catch(next);
});
