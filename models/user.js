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
    enum: ['Member', 'Admin'],
    default: 'Member'
  },
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date}
}, {timestamps: true});

//Before the User is saved we have to hash their password

UserSchema.pre('save', function(next){
  const user = this,
      SALT_FACTOR = 5;

      if (!user.isModified('password')) return next();

      bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
          if (err) return next(err);
          user.password = hash;
          next();
        });
      });
});

//i'm creating a user instance method called comparePassword
//bcrypt makes it easy to compare the passwords by providing us with the compare
//function the next couple of lines are straight from documentation
UserSchema.methods.comparePassword = function(candidatePassword, cb){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err) {return cb(err);}
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
