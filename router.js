const authenticationController = require('./controllers/authentication'),
      chatController = require('./controllers/chat'),
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport');


//setting up our passport middleware to require login/auth
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});


//roles types of user
const REQUIRE_ADMIN = 'Admin',
      REQUIRE_MEMBER = 'Member';


//Setting up our routes

module.exports = function(app){
  //Initializing routes for authorized users/ api
  const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        chatRoutes = express.Router();


  //setting up our chat routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/chat', chatRoutes);

  //create a new conversation
  chatRoutes.post('/new/:recipientId', chatController.newConversation);

  //Retrieve single user
  chatRoutes.get('/users/:id', chatController.singleUser);

  //get all Users
  chatRoutes.get('/users', chatController.getUsers);


  //get all Messages
  chatRoutes.get('/messages', chatController.getMessages);

  //Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  //Send reply in conversation
  chatRoutes.post('/conversations/:conversationId', chatController.sendReply);

  //Retrieve single conversation
  chatRoutes.get('/conversations/:conversationId', chatController.getConversation);

  //get all userConversation messages  //need to test this route and set it up in redux store if
  //if i'm going to use it

  //chatRoutes.get('/messages/:conversationId', chatController.getConversationMessages);


  //Retrieve all conversations
  chatRoutes.get('/conversations', chatController.getConversations);


  //Registration route
  authRoutes.post('/register', authenticationController.register);

  //Login Route
  authRoutes.post('/login', requireLogin, authenticationController.login);

  // //view messages to and from authentication user
  // chatRoutes.get('/', chatController.getConversations);

  //Set url for API group routes
  app.use('/api', apiRoutes);

}
