
/**
* Module dependencies.
*/

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , Client = require('ftp');


var app = express();
var c = new Client();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/getfilesandfolder', routes.getfilesandfolder);

var server = http.createServer(app);

/**
* CHAT / SOCKET.IO 
* -------------------------------------------------------------------------------------------------
* this shows a basic example of using socket.io to orchestrate chat
**/

// socket.io configuration
var buffer = [];
var io = require('socket.io').listen(server);

//Socket Code
io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 100);
});
// send the new user their name and a list of users
io.sockets.on('get:filesandfolders', function (data) {
    c.on('ready', function () {
        c.list("/justsalwars-site", function (err, list) {
            if (err) throw err;
            //res.json(list);
            io.socket.emit('get:filesandfolders', list);
            c.end();
        });
    });
    // connect to localhost:21 as anonymous
    var o = new Object();
    o.host = "example.com";
    o.user = "ftpuser";
    o.password = "ftppwd";

    c.connect(o);

});


server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
