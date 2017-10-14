var express = require('express');
var bodyParser = require('body-parser');
var sqlManager = require('./sql/sqlManager.js');
var session = require('express-session');
var uuid = require('uuid/v4');


var app = express();
var httpUnencoded = bodyParser.urlencoded({ extended: false });

var staticContentDir = 'content/static_html/';

app.use(express.static(staticContentDir));
app.use(httpUnencoded);
app.use(session({
  genid: function(req) {
    return uuid(); // use UUIDs for session IDs
  },
  secret: 'entropy death of the universe'
}));
app.get('/about', function (req, res) {
  res.send('about')
});*/

app.get('/login',function (req,res) {
  // Render login page
  res.sendFile(__dirname + '/'+staticContentDir+ '/pages/examples/login.html');
});

app.post('/logmein', function (req,res) {
  var post = req.body;
  sqlManager.initialize(function () {
    sqlManager.login(post.user,post.password, function(credential) {
      if (credential > 0) {
        //req.session.user_id = credential;
        console.log(credential);
        res.redirect('/tasks');
      } else {
        console.log(credential);
        res.redirect('/login');
      }
    });
  }); // Intialize new instance of SQLmanager
  /*
  if (!post.rfid) {
    // RFID Login
    loginCredentials = sqlManager.attemptLogin(post.rfid);
  } else {*/
    //loginCredentials = sqlManager.login(post.user,post.password);
  //}
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
