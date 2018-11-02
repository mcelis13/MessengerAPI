const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
      jwt_decode = require('jwt-decode');


const ConversationSchema = new Schema({
  //all participants in a conversation will be users
  //ref is what creates what equates to a join table in sqlite3/postgresql
  participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
});

ConversationSchema.pre('save', function(next){
  console.log(this);
  if(this.isNew){
  }
  next();
})

module.exports = mongoose.model('Conversation', ConversationSchema);
