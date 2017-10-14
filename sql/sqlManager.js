var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var exports = module.exports = {};

exports.initialize = function() {

  // Create connection to database
  var config =
     {
       userName: 'beatrizfusaro', // update me
       password: 'Myageis48', // update me
       server: 'taskitplatform.database.windows.net', // update me
       options:
          {
             database: 'TaskIt' //update me
             , encrypt: true
          }
     }
  var connection = new Connection(config);

  // Attempt to connect and execute queries if connection goes through
  connection.on('connect', function(err)
     {
       if (err)
         {
            console.log(err)
         }
     }
   );
 }

exports.login = function(username, password)
   { console.log('Attempting login...');

       // Read all rows from table
     request = new Request(
          "SELECT PersonId FROM dbo.Person WHERE UserName = "+username+" AND Password = "+password,
             function(err, rows, result)
                {
                  if (err) throw err;
                  if (rows = 0) {
                    console.log('Wrong username/ password')
                    return 0;
                  } else {
                    console.log('Logged In, User ID = ' + rows[0].PersonId);
                    updateRequest = new Request(
                         "UPDATE dbo.Person SET Status = 1 WHERE PersonId = " + rows[0].PersonId,
                            function(err)
                               {
                                 if (err) throw err;
                               }
                           );
                    connection.execSql(updateRequest);
                    return rows[0].PersonId;
                  }
                }
            );
     connection.execSql(request);
   }

  exports.addUser = function(username, password, isAdmin) {
    console.log('Adding new user...');
    request = new Request("INSERT dbo.Person (UserName, Password, Token, AdminStatus, Status) OUTPUT INSERTED.PersonId VALUES (@UserName, @Password, @Token, @AdminStatus, @Status);", function(err) {
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
