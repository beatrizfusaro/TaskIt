var express = require('express');
var bodyParser = require('body-parser');
var sqlManager = require('./sql/sqlManager.js');
var session = require('express-session');
var uuid = require('uuid/v4');


var app = express();
var httpUnencoded = bodyParser.urlencoded({ extended: false });

var staticContentDir = 'content/static_html/';

app.get('/', function (req,res) {
  res.redirect('login');
});

app.use(express.static(staticContentDir));
app.use(httpUnencoded);
app.use(session({
  genid: function(req) {
    return uuid(); // use UUIDs for session IDs
  },
  secret: 'entropy death of the universe'
}));

app.get('/about', function (req, res) {

});

app.get('/login',function (req,res) {
  // Render login page
  res.sendFile(__dirname + '/'+staticContentDir+ '/pages/examples/login.html');
});

app.post('/logmein', function (req,res) {
  var post = req.body;
  sqlManager.initialize(function () {
    if (post.rfid !== null) {
      sqlManager.rfidLogin(post.rfid,function(credential) {
        if (credential > 0) {
          req.session.user_id = credential;
          console.log('[login] User "' + req.session.user_id + '" has signed onto the system using a kiosk');
          res.redirect('/tasks');
        } else {
          console.log('[login] Invalid RFID "' + post.rfid + '" attempted login with kiosk.');
        }
      });
    }

    sqlManager.login(post.user,post.password, function(credential) {
      if (credential > 0) {
        req.session.user_id = credential;
        console.log('User ' + credential + ' has logged in.');
        res.redirect('/tasks');
      } else {
        console.log(credential);
        res.redirect('/login');
      }
    });
  });
});

app.get('/admin', function (req, res) {
  res.send('admin page');
});

app.get('/admin/analytics', function (req,res) {
  res.send('analytics page');
});

app.post('/admin/analytics/progress', function(req, res) {
  if ()
});
app.post('/admin/analytics/taskHealth', function(req, res) {

});
app.post('admin/analytics/', function(req,res) {

});

app.get ('/admin/oversight', function (req,res) {
  res.send('oversight page');
});

app.get('/admin/taskManager', function(req,res) {

});

app.post('/admin/taskManager/new-task/', function(req,res) {
  var post = req.body;
  if (!req.session.user_id || !req.session.admin) {
    res.redirect('/login'); // Insufficient privilages
  }
  sqlManager.initialize(function() {
    sqlManager.setNewTask(post.taskName,
      post.summary,
      post.desc,
      post.team,
      post.manager,
      post.dueDate,
      function() {
        res.redirect('/admin/taskManager');
      });
    })
  });

  'admin/taskManager/editTask'


  app.get('/tasks', function (req,res) {
    if (!req.session.user_id) {
      res.redirect('/login'); // Not logged in
    }
    sqlManager.initialize(function(taskArray) {
      sqlManager.getActiveTasks(req.session.user_id, function(taskArray) { // Get list of active tasks associated to person
        // Render task web-page
      });
    });
  });
  // Activate a given task after the user has selected it.
  app.post('/activate-task', function (req,res) {
    var post = req.body;
    if (!req.session.user_id) {
      res.redirect('/login');
    }
    sqlManager.initialize(function() { // Initialize the SQL connection
      sqlManager.activateTask(post.taskid,function() {  // Activate task
        res.redirect('done'); // Take the user to the done page
      });
    });
  });
  // The user can update a task he or she has been working on
  app.post('/update-task', function (req,res) {
    var post = req.body;
    if (!req.session.user_id) {
      res.redirect('/login');
    }
    sqlManager.initialize(function() { // Intialize SQL Server
      sqlManager.updateTask(post.taskid,post.update,post.taskNewState, function() { // Update all information for the task
        res.redirect('done'); // Redirect the user to the done page
      });
    })
  });

  app.post('/asset', function(req,res) {
    if (!req.body) return res.sendStatus(400);
    else {
      var post = req.body;
      sqlManager.initialize(function() {
        sqlManager.toggleMachineState(post.machineID, post.user_id, function (state) {
          res.send('Asset "' + machineID + '" has changed state to "' + state + '" by user "' + post.user_id + '".')
        })
      })
    }
  });

  app.get('done', function(req, res) {
    // TODO: implement the done page
  });


  app.listen(process.env.PORT || 3000); //the port you want to use
