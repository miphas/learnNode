const connect = require('connect');
const bodyParser = require('body-parser');


let app = connect();
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

app.use(bodyParser.text({ type: 'text/html' }))

app.use(function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.write('You Post:\n');
  res.end(JSON.stringify(req.body, null, 2));
});

app.listen(3000);

// application/x-www-form-urlencoded
// curl -d name=tobi http://localhost:3000

// application/json
// curl -d '{"user":"tobi"}' -H "Content-Type: application/json"  http://localhost:3000/


// curl -d '<a>123</a>' -H "Content-Type:text/html"  http://localhost:3000