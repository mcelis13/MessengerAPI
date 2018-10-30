"use strict"

const Conversation = require('../models/conversation'),
      Message = require('../models/message'),
      User = require('../models/user');

//creating the function that deals with getting the user conversation/messages
exports.getConversations = function(req, res, next){
    //Only return one conversation at a time to view
    Conversation.find({participants: req.user._id})
      .select('_id')
      .exec(function(err, conversations){
        if(err){
          res.send({error: err});
          return next(err);
        }
      })
    //Set up an empty array to hold convesations + more recent Messages
    let fullConversations = [];
    conversations.forEach(function(conversations){
      Message.find({'conversationId': conversation._id})
        .sort('_createdAt')
        .limit(1)
        .populate({
          path: 'author',
          select: 'profile.firstName profile.lastName'
        })
        .exec(function(err, message){
          if(err){
            res.send({error: err});
            return next(err);
          }
          fullConversations.push(message);
          if(fullConversations.length === conversations.length){
            return res.status(200).json({ conversations: fullConversations});
          }
        });
    });
}
