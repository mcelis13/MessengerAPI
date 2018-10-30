const AuthenticationController = require('./controllers/authentication'),
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
        authRoutes = express.Router();

  //Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  //Registration route
  authRoutes.post('/register', AuthenticationController.register);

  //Login Route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  //Set url for API group routes
  app.use('/api', apiRoutes);
}
