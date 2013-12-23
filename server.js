
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
    app.use(express.cookieParser());
//app.use(express.session({secret: '1234567890QWERTY'}));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(function (req, res, next) {
    res.locals.req = req;
    next();
  });
    app.use(express.static(path.join(__dirname, 'public')));
});


//MongoDB Code
var conn = 'mongodb://<username>:<password>@paulo.mongohq.com:10019/<database>';
var mongo = require('mongodb');
var monk = require('monk');
var db1 = monk(conn);
app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/getfilesandfolder', routes.getfilesandfolder(db1));
app.get('/downloadfile', routes.downloadfile(db1));
app.get('/uploadfile', routes.uploadfile(db1));
app.post('/register', routes.postRegister(db1));
app.post('/login',routes.login(db1));
app.post('/addconnection',routes.addconnection(db1));
app.get('/getuserconnections',routes.getuserconnections(db1));
var server = http.createServer(app);

app.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
