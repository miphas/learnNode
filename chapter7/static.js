
const connect = require('connect');
const static = require('serve-static');
const index = require('serve-index');

let app = new connect();
app.use(static(__dirname));
app.use(index(__dirname, {icons: true}));

app.listen(3000);