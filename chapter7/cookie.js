var connect = require('connect');
var cookie = require('cookie')
var cookieParser = require('cookie-parser');

var ckParse = cookie.parse('foo=bar; equation=EDA');
var ckSelia = cookie.serialize('foo', 'bar', {
  // domain: 'www.baidu.com',
  encode: a => a,
  httpOnly: true,
  expires: new Date()
});

var jsonCkParse = cookieParser.JSONCookie('j:{"foo": "j"}');
var jsonCkSeria = cookieParser.JSONCookies({"foo": "j:{\"a\":\"aa\"}"});

var app = connect()
  .use(cookieParser('tobi is a cool ferret'))
  .use(function(req, res) {
    console.log(req.cookies);
    console.log(req.signedCookies);
  }).listen(3000);