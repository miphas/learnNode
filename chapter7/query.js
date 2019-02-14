
const connect = require('connect');
const connectQuery = require('connect-query');

let app = new connect();
app.use(connectQuery());
app.use(function(req, res, next) {
  console.log(req.query);
  res.end('get');
});

app.listen(3000);