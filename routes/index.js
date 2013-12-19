
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.getfilesandfolder = function (req, res) {
  
    var Client = require('ftp');
    var c = new Client();
    c.on('ready', function () {
        c.list("/justsalwars-site",function (err, list) {
            if (err) throw err;
            res.json(list);
            c.end();
        });
    });
    // connect to localhost:21 as anonymous
    /*var o = new Object();
    o.host = "chennaivantravels.com";
    o.user = "chenniqo";
    o.password = "BIG@hosting";   */

    c.connect();    
};