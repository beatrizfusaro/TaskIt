var express = require('express');
var app = express();

var staticContentDir = '../content/static_html/'

app.get('/',function(req,res) {
  res.sendFile(staticContentDir+'index.html');
});
app.listen(3000); //the port you want to use
