var express = require('express');
var app = express();

var sqlTest = require('./sql/sqlTest.js');

var staticContentDir = 'content/static_html/';

app.use(express.static(staticContentDir));

app.get('/sqlTest/', function (req, res) {
  sqlTest.queryDatabase();
})


app.listen(process.env.PORT || 3000); //the port you want to use
