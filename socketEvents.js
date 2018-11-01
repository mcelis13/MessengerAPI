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

    socket.on('new message', (conversation) => {
      io.sockets.in(conversation).emit('refresh messages', conversation);
    });

    socket.on('disconnect', () => {
      console.log('user has been disconnected');
    });
  });
}
