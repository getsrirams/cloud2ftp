
/*
 * GET home page.
 */
 var Client = require('ftp');
    var fs = require('fs');
    var c = new Client();
    // connect to localhost:21 as anonymous
    var o = new Object();
    o.host = "chennaivantravels.com";
    o.user = "chenniqo";
    o.password = "BIG@hosting";  
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.getfilesandfolder = function (req, res) { 
    
    
    c.on('ready', function () {
        c.list(req.query.path,function (err, list) {
            if (err) throw err;
            res.json(list);
            c.end();
        });
    });
     

    c.connect(o);    
};

exports.downloadfile = function (req, res) { 
    c.on('ready', function () {
        c.get(req.query.path, function (err, stream) {
            if (err) throw err;
            stream.once('close', function () { c.end(); });
            stream.pipe(fs.createWriteStream('foo.local-copy.txt'));
        });
    });
    c.connect(o);   
}