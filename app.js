var express = require('express');
var bodyParser = require('body-parser')

var app = express();
var httpUnencoded = bodyParser.urlencoded({ extended: false });

var staticContentDir = 'content/static_html/';

app.use(express.static(staticContentDir));

app.get('/about', function (req, res) {
  res.send('about')
});

app.get('/login',function (req,res) {
  // Render login page
  res.sendFile('login.html');
});

app.post('/login', function (req,res) {
  var post = req.body;
  if (typeof post.rfid !== 'undefined'){
    // RFID Login
    loginCredentials = sqlManager.attemptLogin(post.rfid);
  } else {
    loginCredentials = sqlManager.attemptLogin(post.user,post.password);
  }
  if (loginCredentials > 0) {
    req.session.user_id = loginCredentials;
    req.redirect('/tasks');
  }
});

app.get('/admin', function (req, res) {
  res.send('admin page');
});

app.get('/admin/analytics', function (req,res) {
  res.send('analytics page');
});

app.get ('/admin/oversight', function (req,res) {
  res.send('oversight page');
});

app.get('/admin/taskManager', function(req,res) {

});

app.get('/tasks', function (req,res) {
  res.send('tasks page');
  if (!req.session.user_id) {
    res.redirect('/login'); // Not logged in
  }
});

app.post('/asset', function(req,res) {
  if (!req.body) return res.sendStatus(400);
  else {
    switch (req.body.machine) { // Which machine is the request sent from?
      case 0:
        res.send("Haas");
      break;
      case 1:
        res.send('Chevy');
      break;
      case 2:
        res.send('Bridgeport');
      break;
      default:
        res.send("ProtoTrak");
      break;
    }
  }
  res.send('asset IoT page');
});




app.listen(process.env.PORT || 3000); //the port you want to use
