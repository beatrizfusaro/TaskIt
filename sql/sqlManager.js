var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var exports = module.exports = {};

var connection;

exports.initialize = function(callback) {

  // Create connection to database
  var config =
  {
    userName: 'beatrizfusaro', // update me
    password: 'Myageis48', // update me
    server: 'taskit.database.windows.net', // update me
    options:
    {
      database: 'TaskIt' //update me
      , encrypt: true
    }
  }
  console.log('Attempting to Establish Connection...');
  connection = new Connection(config);

  // Attempt to connect and execute queries if connection goes through
  connection.on('connect', function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Connection Established');
      callback();
    }
  });
}

exports.login = function(username, password, callback) {
  console.log('Attempting login...');

  // Read all rows from table
  var query = "SELECT PersonId FROM dbo.Person WHERE UserName='"+username+"' AND Password='"+password+"'";
  console.log(query);
  request = new Request(query, function(err, rowCount, rows) {
    console.log('Checking for Error 1...');
    if (err) throw err;
    if (rowCount = 0) {
      return 0;
    }
  });
  request.on('row', function(columns) {
    columns.forEach(function(column) {
      if (column.value !== null) {
        console.log(column.value);
        callback(column.value);
      }
    });
    console.log(result);
  });
}

exports.addUser = function(username, password, isAdmin) {
  console.log('Adding new user...');
  request = new Request("INSERT dbo.Person (UserName, Password, Token, AdminStatus, Status) OUTPUT INSERTED.PersonId VALUES (@UserName, @Password, @Token, @AdminStatus, @Status);",
  function(err) {
    if (err) {
      console.log(err);}
    });
    request.addParameter('UserName', TYPES.NVarChar, username);
    request.addParameter('Password', TYPES.NVarChar , password);
    request.addParameter('Token', TYPES.Bit, 0);
    request.addParameter('AdminStatus', TYPES.Bit, isAdmin);
    request.addParameter('Status', TYPES.Bit, 0);
    request.on('row', function(columns) {
      columns.forEach(function(column) {
        if (column.value === null) {
          console.log('NULL');
        } else {
          console.log("Id of inserted user is " + column.value);
        }
      });
    });
    connection.execSql(request);
  }
