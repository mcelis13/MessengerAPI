exports = module.exports = function(io){
  //Set socket io listeners
  io.on('connection', (socket) => {
    console.log('the user has been connected');
    //on conversation entry, join broadcast channel
    socket.on('enter conversation', (conversation) => {
      socket.join(conversation);
      console.log('joined' + conversation);
    });

    socket.on('leave conversation', (conversation) => {
      socket.leave(conversation);
      conosle.log('left' + conversation);
    });

    socket.on('new message', (message) => {
      io.sockets.in(message.conversationId).broadcast.emit('new message', message);
    });

    socket.on('disconnect', () => {
      console.log('user has been disconnected');
    });
  });
}
