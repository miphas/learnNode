const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  getTemplates(res);
}).listen(8000);

const getTemplates = (res) => {
  fs.readFile('./template.html', (err, data) => {
    if (err) return handleError(err, res);
    getTitles(data.toString(), res);
  });
};
const getTitles = (tmpl, res) => {
  fs.readFile('./title.json', (err, data) => {
    if (err) return handleError(err, res);
    formatHtml(tmpl, JSON.parse(data.toString()), res);
  })
}
const formatHtml = (tmpl, titles, res) => {
  let html = tmpl.replace('%', titles.join('</li><li>'));
  res.writeHead(200, {'Content-Type':'text/html'});
  res.end(html);
}

const handleError = (err, res) => {
  console.log(err);
  res.end('Server Error');
};