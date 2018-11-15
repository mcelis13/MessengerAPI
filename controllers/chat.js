"use strict"

const Conversation = require('../models/conversation'),
      Message = require('../models/message'),
      User = require('../models/user'),
      jwt_decode = require('jwt-decode');


//creating the function that deals with getting the user conversation/messages
exports.getConversations = function(req, res, next){
    let user = jwt_decode(req.headers.authorization)
    Conversation.find({participants: user._id})
    .exec(function(err, conversations_list){
      console.log(conversations_list)
      if(err){
        res.send({error: err})
        return next(err);
      }
      res.status(200).json(conversations_list);
    })

    //Only return one conversation at a time to view
    //Maybe i can make a route that gets messages by conversationId instead
    //put this in get messages/:conversationId function?
    // let user = jwt_decode(req.headers.authorization)
    //
    // Conversation.find({participants: user._id})
    //   .select('_id')
    //   .exec(function(err, conversations){
    //     if(err){
    //       res.send({error: err});
    //       return next(err);
    //     }
    //
    //
    //     let fullConversations = [];
    //     conversations.forEach(function(conversation){
    //       Message.find({'conversationId': conversation._id})
    //         .sort('-createdAt')
    //         //.limit(1)
    //         .populate({
    //           path: 'author',
    //           select: 'profile.firstName profile.lastName'
    //         })
    //         .exec(function(err, message){
    //           if(err){
    //             res.send({error: err});
    //             return next(err);
    //           }
    //           fullConversations.push(message);
    //           if(fullConversations.length === conversations.length){
    //             return res.status(200).json({ conversations: fullConversations});
    //           }
    //         });
    //     });
    //   })

}

exports.getConversationMessages = function(req, res, next){
  //Maybe i can make a route that gets messages by conversationId instead
  //put this in get messages/:conversationId function?
  let user = jwt_decode(req.headers.authorization)

  Conversation.find({participants: user._id})
    .select('_id')
    .exec(function(err, conversations){
      if(err){
        res.send({error: err});
        return next(err);
      }


      let allConversationMessages = [];
      conversations.forEach(function(conversation){
        Message.find({'conversationId': conversation._id})
          .sort('-createdAt')
          //.limit(1)
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
              return res.status(200).json({ conversationMessages: allConversationMessages});
            }
          });
      });
    })

}

exports.getMessages = function(req, res, next){
    Message.find()
    .populate({ path: 'author', select: 'profile' })
    .exec(function(err, messages_list){

      if(err){
        res.send({error: err})
        return next(err);
      }

      res.status(200).json(messages_list);
    })
}

exports.getConversation = function(req, res, next){
    Conversation.findById(req.params.conversationId)
      .populate({ path: 'participants', select: 'profile' })
      .exec(function(err, participants){
        if(err){
          res.send({error: err})
          return next(err);
        }

        // res.status(200).json(participants)
      });
  Message.find({conversationId: req.params.conversationId})
    .select('createdAt body author')
    .populate({
      path: 'author',
      select: 'profile.firstName profile.lastName'
    })
    .exec(function(err, messages){

      if(err){
        res.send({error: err})
        return next(err);
      }

      res.status(200).json({messages: messages, conversationId:req.params.conversationId});
    })
}

exports.sendReply = function(req, res, next){
  let user = jwt_decode(req.headers.authorization)
  const reply = new Message({
    conversationId: req.params.conversationId,
    body: req.body.composedMessage,
    author: user._id
  });

  reply.save(function(err, sentReply){
    if(err){
      res.send({error: err})
      return next(err);
    }

    Message.findById(sentReply._id)
    .populate({
      path: 'author',
      select: 'profile.firstName profile.lastName'
    })
    .exec(function(err, message){

      if(err){
        res.send({error: err})
        return next(err);
      }

      res.status(200).json(message);
      return(next);
    })
  })


  // let user = jwt_decode(req.headers.authorization)
  // const reply = new Message({
  //   conversationId: req.params.conversationId,
  //   body: req.body.composedMessage,
  //   author: user._id
  // });
  //
  // reply.save(function(err, sentReply){
  //   if(err){
  //     res.send({error: err})
  //     return next(err);
  //   }
  //
  //   Message.find({conversationId: req.params.conversationId})
  //     .select('createdAt body author')
  //     .populate({
  //       path: 'author',
  //       select: 'profile.firstName profile.lastName'
  //     })
  //     .exec(function(err, messages){
  //
  //       if(err){
  //         res.send({error: err})
  //         return next(err);
  //       }
  //
  //       res.status(200).json({messages: messages, conversationId:req.params.conversationId});
  //     })
  //
    // res.status(200).json(sentReply);
    // return(next);
  };

exports.singleUser = function(req, res, next) {
  let id = req.params.id;
  User.findById({'_id': id})
  .select('_id email password profile role createdAt')
  .sort('-createdAt')
  .exec(function(err, user){

    if(err){
      res.send({error: err})
      return next(err);
    }

    res.status(200).json(user);
  })
}

exports.getUsers = function(req, res, next) {
  User.find()
  .exec(function(err, users_list){

    if(err){
      res.send({error: err})
      return next(err);
    }

    res.status(200).json(users_list);
  })
}


exports.newConversation = function(req, res, next){
  if(!req.params.recipientId) {
    res.status(422).send({error: "Please choose a valid recipient."});
    return next();
  }
  if(!req.body.composedMessage){
    res.status(422).send({ error: 'Please enter a message.'});
    return next();
  }

  let user = jwt_decode(req.headers.authorization)
  const conversation = new Conversation({
    participants: [user._id, req.params.recipientId]
  });

  conversation.save(function(err, newConversation){
    if(err){
      res.send({error: err});
      return next(err);
    }

    const message = new Message({
      conversationId: newConversation._id,
      body: req.body.composedMessage,
      author: user._id
    });

    message.save(function(err, newMessage){
      if(err){
        res.send({error: err});
        return next(err);
      }

      res.status(200).json({message:newMessage, conversationId: conversation._id});
      return next();
    });
});
};
