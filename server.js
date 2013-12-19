
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

//Passport Auth
var passport = require('passport')
  , DropboxStrategy = require('passport-dropbox').Strategy;
  var DROPBOX_APP_KEY ="vsuwwv4w9vhjelo";
var DROPBOX_APP_SECRET = "p45njq25o3rakqb";
passport.use(new DropboxStrategy({
    consumerKey: DROPBOX_APP_KEY,
    consumerSecret: DROPBOX_APP_SECRET,
    callbackURL: "http://localhost:34316/auth/dropbox/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({ dropboxId: profile.id }, function (err, user) {
      return done(err, profile);
    });
  }
));
//MongoDB Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');


var app = express();
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));
app.configure(function(){
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

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/helloworld', routes.helloworld);
app.get('/userlist', routes.userlist(db));
app.get('/newuser', routes.newuser);
app.get('/authstart', routes.authstart);
app.get('/authreturn', routes.authreturn);
app.get('/listdir', routes.listdir);
app.post('/adduser', routes.adduser(db));
app.get('/auth/dropbox',
  passport.authenticate('dropbox'));

app.get('/auth/dropbox/callback', 
  passport.authenticate('dropbox', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
