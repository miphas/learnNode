let net = require('net');

let server = net.createServer(function(socket) {
  socket.once('data', function(data) {
    socket.write(data);
  });
});
server.listen(8000);