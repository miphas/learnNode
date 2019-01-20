var http = require('http');
var server = http.createServer(function(req, res) {
  res.write('Hello World');
  res.end(); // 上述两句话可以直接写成res.end('Hello world')
});
server.listen(3000);