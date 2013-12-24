var cloud2ftpapp = angular.module('cloud2ftpapp', []);


function cloud2ftpctrl($scope,$http, $timeout) {
      

    //Properties
    $scope.message = '';
    $scope.orderProp = '';
    $scope.cloudfolder = new Array();
    $scope.remotefolder = new Array();
    $scope.queuedfiles = new Array();
    $scope.queue = 0;

    //Methods
    //Change working directory on Folder click
    $scope.changeWorkingDirectory = function (file, conntype) {
        if (conntype == 'cloud') {
            if (file.type == 'd') {
                if (file.name != '/' && $scope.cloudfolder.length != 1) {
                    $scope.cloudfolder.push('/');
                }
                $scope.cloudfolder.push(file.name);
                var path = '';
                for (p in $scope.cloudfolder) {
                    path += $scope.cloudfolder[p];
                }
                $http.get('/getfilesandfolder?cid=' + $('#ddlleftconnection').val() + '&path=' + path).success(function (data) {
                    $scope.cloudfiles = data;
                });
            }
        }
        else {
            if (file.type == 'd') {
                if (file.name != '/' && $scope.remotefolder.length != 1) {
                    $scope.remotefolder.push('/');
                }
                $scope.remotefolder.push(file.name);
                var path = '';
                for (p in $scope.remotefolder) {
                    path += $scope.remotefolder[p];
                }
                $http.get('/getfilesandfolder?cid=' + $('#ddlrightconnection').val() + '&path=' + path).success(function (data) {
                    $scope.remotefiles = data;
                });
            }
        }
        return false;

    }

    //Add selected files to queue array
    $scope.addtoqueue = function (file) {
        var path = getWorkingDirectory('cloud');
        var queuefile = new Object();
        queuefile.name = file.name;
        if ($scope.cloudfolder.length == 1) {
            
            queuefile.path = path + file.name;
        }
        else{
            queuefile.path = path + '/' + file.name;
        }
        var remotepath =  getWorkingDirectory('remote');
         if ($scope.remotefolder.length == 1) {
            
            queuefile.remotepath = remotepath + file.name;
        }
        else{
            queuefile.remotepath = remotepath + '/' + file.name;
        }
        queuefile.size = file.size;
        queuefile.status = 'Queued';
        $scope.queuedfiles.push(queuefile);
    }

    $scope.$watch('queue', function () {
        ftpupload();
    });

    //Process queue array when upload button is clicked
    $scope.ftpupload = function () {
        //Download the file to temp directory in server
        $http.get('/downloadfile?cid=' + $('#ddlleftconnection').val() + '&path=' + $scope.queuedfiles[$scope.queue].path + '&filename=' + $scope.queuedfiles[$scope.queue].name).success(function (data) {
            //Upload the file from temp directory to remote FTP server
            $http.get('/uploadfile?cid=' + $('#ddlrightconnection').val() + '&path=' + $scope.queuedfiles[$scope.queue].remotepath + '&filename=' + $scope.queuedfiles[$scope.queue].name).success(function (data) {
                if($scope.queue < $scope.queuedfiles.length )
                    $scope.queue++;
            });
        });
    }

    //Add new FTP connection
     $scope.addconnection = function(){
        var $newconnection = $('#newconnection');
        $.ajax({
            type: 'POST',
            url: '/addconnection',
            data: $newconnection.serialize(),
            success: function (data) {
                if (data.status == 'success') {
                    document.location.href = '/';
                }
            }
        });

    }
   
    //Move one folder up from current working directory
    $scope.onefolderup = function (conntype) {
        if (conntype == 'cloud') {
            if ($scope.cloudfolder.length != 1) {
                $scope.cloudfolder.pop();
                $scope.cloudfolder.pop();
                var path = getWorkingDirectory(conntype);
                $http.get('/getfilesandfolder?cid=' + $('#ddlleftconnection').val() + '&path=' + path).success(function (data) {
                    $scope.cloudfiles = data;
                });
            }
            else {
                $scope.message = 'You have reached root folder.';
                $timeout(function () {
                    $scope.message = '';
                }, 5000);
            }
        }
        else
        {
            if ($scope.remotefolder.length != 1) {
            $scope.remotefolder.pop();
            $scope.remotefolder.pop();
            var path = getWorkingDirectory(conntype);
            $http.get('/getfilesandfolder?cid=' + $('#ddlrightconnection').val() + '&path=' + path).success(function (data) {
                    $scope.remotefiles = data;
                });
        }
        else {
            $scope.message = 'You have reached root folder.';
            $timeout(function () {
                $scope.message = '';
            }, 5000);
        } 
        }
        //return false;

    }
    var rootpath = new Object();
    rootpath.name = '/';
    rootpath.type = 'd';
    rootpath.date = null;
   

    
    init = function(){
         $http.get('/getuserconnections').success(function (data) {
                $scope.ftplist = data;
                 
            });
    }
    $scope.changecloudconn = function(){
        $scope.cloudfolder.length=0;
        $scope.changeWorkingDirectory(rootpath,'cloud');
    }
     $scope.changeremoteconn = function(){
        $scope.remotefolder.length=0;
        $scope.changeWorkingDirectory(rootpath,'remote');
    }

    //Accounts
     $scope.register1 = function () {
        var $register = $('#register');
        $.ajax({
            type: 'POST',
            url: '/register',
            data: $register.serialize(),
            success: function (data) {
                if (data.status == 'success') {
                    document.location.href = '/';
                } 
            }
        });
    }
    $scope.login1 = function () {
        alert('login');
        var $login = $('#frmlogin1');
        $.ajax({
            type: 'POST',
            url: '/login',
            data: $login.serialize(),
            success: function (data) {
                if (data.status == 'success') {
                    init();
                    document.location.href = '/';
                    
                } 
            }
        });

    }

    //Helper functions
    getWorkingDirectory = function (conntype) {
        var path = "";
        if(conntype=='cloud')
        {
        for (p in $scope.cloudfolder) {
            path += $scope.cloudfolder[p];
        }
        }
        else
        {
             for (p in $scope.remotefolder) {
            path += $scope.remotefolder[p];
        }
        }
        return path;
    }
}

cloud2ftpapp.controller('cloud2ftpctrl', ['$scope','$http', '$timeout', cloud2ftpctrl]);