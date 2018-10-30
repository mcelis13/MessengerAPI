const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  //all participants in a conversation will be users
  participants: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Conversation', ConversationSchema);
