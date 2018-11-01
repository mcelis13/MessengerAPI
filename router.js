const AuthenticationController = require('./controllers/authentication'),
      ChatController = require('./controllers/chat'),
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

  //Start new conversation
  chatRoutes.post('/new/:recipient', ChatController.newConversation);

  //view messages to and from authentication user
  chatRoutes.get('/', requireAuth, ChatController.getConversations);

  //Retrieve single conversation
  chatRoutes.get('/:conversationId', requireAuth, ChatController.getConversation);

  //Send reply in conversation
  chatRoutes.post('/:conversationId', requireAuth, ChatController.sendReply);



  //Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  //Registration route
  authRoutes.post('/register', AuthenticationController.register);

  //Login Route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  //Set url for API group routes
  app.use('/api', apiRoutes);
}
