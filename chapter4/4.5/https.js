var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./key-cert.pem')
};

var server = https.createServer(options, function(req, res) {
  res.writeHead(200);
  res.end("Hello world\n");
});

server.listen(3000);