const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  //all participants in a conversation will be users
  //ref is what create what equates to a join table in sqlite3/postgresql
  participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
});

module.exports = mongoose.model('Conversation', ConversationSchema);
