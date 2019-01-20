var http = require('http');
var formidable = require('formidable');

function show(req, res) {
  var html = '' +
    '<form method="post" action="/" enctype="multipart/form-data">' +
      '<p><input type="text" name="name" /></p>' +
      '<p><input type="file" name="file" /></p>' +
      '<p><input type="submit" value="Upload" /></p>' +
    '</form>';
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
}

function isFormData(req) {
  var type = req.headers['content-type'] || '';
  return 0 == type.indexOf('multipart/form-data')
} 
function upload(req, res) {
  if (!isFormData(req)) {
    res.statusCode = 400;
    res.end('Bad Request: expecting multipart/form-data');
    return;
  }
  var form = new formidable.IncomingForm();
  form.on('field', function(field, value) {
    console.log(field);
    console.log(value);
  });
  form.on('file', function(field, file) {
    console.log(field);
    console.log(file);
  });
  form.on('end', function() {
    res.end('upload complete');
  });
  form.on('progress', function(byteReceived, byteExpected) {
    var parcent = Math.floor(byteReceived / byteExpected * 100);
    console.log(parcent);
  });

  form.parse(req);
}

var server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    show(req, res);
  }
  else if (req.method === 'POST') {
    upload(req, res);
  }
});

server.listen(3000);