const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  getTitles(res);
}).listen(8000);

const getTitles = (res) => {
  fs.readFile('./title.json', (err, data) => {
    if (err) {
      hadError(err, res);
    } else {
      getTemplate(JSON.parse(data.toString()), res);
    }
  });
}
const getTemplate = (titles, res) => {
  fs.readFile('./template.html', (err, data) => {
    if (err) {
      hadError(err, res);
    } else {
      formatHtml(titles, data.toString(), res);
    }
  });
}
const formatHtml = (titles, tmpl, res) => {
  let html = tmpl.replace('%', titles.join('</li><li>'));
  res.writeHead(200, {'Content-Type':'text/html'});
  res.end(html);
}

const hadError = (err, res) => {
  console.log(err);
  res.end('Server Error!');
}