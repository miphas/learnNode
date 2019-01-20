var http = require('http');
var url = require('url');
var qs = require('querystring');
var items = [1, 2];

function showItems(req, res) {
  var body = 
  '<html>' +
    '<head><title>Todo List</title></head>' + 
    '<body>' +
      '<h1>Todo List</h1>' +
      '<ul>' + 
        items.map(item => `<li>${item}</li>`).join('') +
      '</ul>' +
      '<form method="post">' + 
        '<input type="text" name="item"/>' + 
        '<input type="submit" value="Add Item" />' +
      '</form>' +
    '</body>' +
  '</html>';
  res.end(body);
}

function addItem(req, res) {
  var content = '';
  req.setEncoding('utf-8');
  req.on('data', chunk => content += chunk);
  req.on('end', function() {
    var obj = qs.parse(content);
    items.push(obj.item);
    showItems(req, res);
  })
}

function badRequest(req, res) {
  res.statusCode = 400;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Bad Request');
}

var server = http.createServer(function(req, res) {
  if (req.method === 'GET') {
    showItems(req, res);
  } 
  else if (req.method === 'POST') {
    addItem(req, res);
  } 
  else {
    badRequest(req, res);
  }
});

server.listen(3000);