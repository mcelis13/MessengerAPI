const   repl = require("repl"),
        express = require('express'),
        app = express(),
        config = require('./config/main'),
        keys = require('./config/keys'),
        mongoose = require('mongoose'),
        bodyParser = require('body-parser'),

replServer.context.Conversation = require('./models/conversation'),
replServer.context.Message = require('./models/message'),
replServer.context.User = require('./models/user');

var replServer = repl.start({
  prompt: 'Node console >',
})
