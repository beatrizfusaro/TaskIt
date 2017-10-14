var express = require('express');
var app = express();

var staticContentDir = 'content/static_html/';

app.use(express.static(staticContentDir));


app.listen(80); //the port you want to use
