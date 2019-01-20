var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function(req, res) {
  switch (req.method) {
    case 'POST':
      var item = '';
      req.on('data', function(chunk) {
        item += chunk;
      });
      req.on('end', function() {
        items.push(item);
        res.end('OK');
      });
      break;
    case 'GET':
      var body = items.map((item, idx) => `${idx}) ${item}`).join('\n');
      // 优化点
      res.setHeader('Content-Length', Buffer.byteLength(body));
      res.setHeader('Content-Type', 'text/plain; charset="utf-8"')
      res.end(body);
      break;
    case 'DELETE':
      var pathname = url.parse(req.url).pathname;
      var i = parseInt(pathname.slice(1), 10);
      if (isNaN(i) || !items[i]) {
        res.statusCode = 404;
        res.end('Item not found');
      } else {
        items.splice(i, 1);
        res.end('OK\n');
      }
      break;
  }
});

server.listen(3000);