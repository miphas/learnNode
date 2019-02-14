
const connect = require('connect');
const morgan = require('morgan');

let app = new connect();
app.use(morgan());
app.use((req, res) => res.end('hello3000'));

app.listen(3000);