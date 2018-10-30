//Importing my node modules and intializing Express
const express = require('express'),
      app = express(),
      logger = require('morgan'),
      config = require('./config/main'),
      keys = require('./config/keys'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser');

//Starting the server
const server = app.listen(config.port);
console.log('Your server is running on port ' + config.port + ' madeline!');

// Setting up basic middleware for all Express requests
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

//Connecting the Mongoose Database
const mongoDB = `mongodb://${keys.user}:${keys.password}@${keys.service}/${keys.database}`;
mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
