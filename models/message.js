const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const MessageSchema = new Schema({
    conversationId: {
      type: Schema.types.ObjectId,
      required: true
    },
    body: {
      type: String,
      require: true
    },
    author: {
      type: Schema.types.ObjectId,
      ref: 'User'
    },
  },{timestamps: true});

  module.exports = mongoose.model('Message', MessageSchema);
