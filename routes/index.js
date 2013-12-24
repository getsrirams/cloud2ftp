
/**
  * Module dependencies.
  */

var Client = require('ftp');
    var fs = require('fs');
    var c = new Client();
    var downloadfolder = '<path to folder>';
    module.exports = {

        //Get Connection details
        getftpdetails: function(connid,db1){
           var connections = db1.get('connections');
                var o = {};
                
                connections.findById(req.query.cid, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        throw err;
                        res.send("There was a problem adding the information to the database.");
                    }
                    else {
                       
                        o.host = doc.host;
                        o.user = doc.username;
                        o.port = doc.port;
                        o.password = doc.password;

                    }  
                    return o;
        })
        },
        index: function (req, res) {
            res.render('index.jade', { title: 'Express', user: req.user });
        },
        
        //Add new FTP Connection
        addconnection: function (db1) {
            return function (req, res) {
                var connections = db1.get('connections');

                // Submit to the DB
                connections.insert({
                    'name': req.param('name')
                , 'host': req.param('host')
                , 'port': req.param('hostport')
                 , 'username': req.param('ftpusername')
                , 'password': req.param('ftppassword')
                , 'userid': req.cookies.userid
                }, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        throw err;
                        res.send("There was a problem adding the information to the database.");
                    }
                    else {                        
                        res.json({ "status": "success" });
                    }
                });
            }
        },

        //Get all FTP connection for an user
        getuserconnections: function (db1) {
            return function (req, res) {
                var connections = db1.get('connections');

                
                connections.find({
                    'userid': req.cookies.userid
                }, '-password', function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        throw err;
                        
                    }
                    else {                        
                        res.json(doc);
                    }
                });
            }
        },

        //Get list of files and folders 
        getfilesandfolder: function (db1) {
            return function (req, res) {

                c.on('ready', function () {
                    c.list(req.query.path, function (err, list) {
                        if (err) throw err;
                        res.json(list);
                        c.end();
                    });
                });
                
                var o = getftpdetails(req.query.cid,db1);
                

                    c.connect(o);
               
            }
        },

        //Download file from FTP server
        downloadfile: function (db1) {
            return function (req, res) {
                c.on('ready', function () {
                    c.get(req.query.path, function (err, stream) {
                        if (err) throw err;
                        stream.once('close', function () { c.end(); });
                        stream.pipe(fs.createWriteStream(downloadfolder+ req.query.filename));
                        res.json({ "status": "success" });
                    });
                });
               
                var o = getftpdetails(req.query.cid,db1);
                

                    c.connect(o);
            }
        },

        //Upload file to FTP server
        uploadfile: function (db1) {
            return function (req, res) {
                c.on('ready', function () {

                    c.put(downloadfolder+ req.query.filename, req.query.path, function (err) {
                        if (err) throw err;
                        c.end();
                        res.json({ "status": "success" });
                    });
                });
               var o = getftpdetails(req.query.cid,db1);
                

                    c.connect(o);
            } 
        },


        // app.post('/register'...)
        postRegister: function (db1) {
            return function (req, res) {
                var collection = db1.get('usercollection');

                // Submit to the DB
                collection.insert({
                    'fname': req.param('name.first')
                , 'lname': req.param('name.last')
                , 'email': req.param('email')
                , 'password': req.param('password')
                }, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        throw err;
                        res.send("There was a problem adding the information to the database.");
                    }
                    else {                        
                        res.json({ "status": "success" });
                    }
                });
            }
        },

        
        login: function (db1) {
            return function (req, res) {
                var collection = db1.get('usercollection');

                collection.find({ 'email': req.param('email'), 'password': req.param('password') }, {}, function (e, docs) {
                    if (docs[0] != null) {
                        res.cookie('userid', docs[0]._id);                        
                        res.json({ 'status': 'success' });
                    }
                    else {
                        res.json({ 'status': 'failure' });
                    }
                });
            }
        }


    };


