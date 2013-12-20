var cloud2ftpapp = angular.module('cloud2ftpapp', []);

/*cloud2ftpapp.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});*/

function cloud2ftpctrl($scope,$http, $timeout) {
       /*socket.on('get:filesandfolders', function (data) {
        $scope.cloudfiles = data;
    });*/

    //Properties
    $scope.message = '';
    $scope.orderProp = '';
    $scope.cloudfolder = new Array();
    $scope.queuedfiles = new Array();
    //$scope.directories = new Array();
    //Methods
    $scope.changeWorkingDirectory = function (file) {
        if (file.type == 'd') {
            if (file.name != '/' && $scope.cloudfolder.length != 1) {
                $scope.cloudfolder.push('/');
            }
            $scope.cloudfolder.push(file.name);
            var path = '';
            for (p in $scope.cloudfolder) {
                path += $scope.cloudfolder[p];
            }
            $http.get('/getfilesandfolder?path=' + path).success(function (data) {
                $scope.cloudfiles = data;
            });
        }
        return false;

    }
    $scope.addtoqueue =function(file){
        
    }
    $scope.ftpupload = function(){
        

    }
    $scope.onefolderup = function () {
        if ($scope.cloudfolder.length != 1) {
            $scope.cloudfolder.pop();
            $scope.cloudfolder.pop();
            var path = "";
            for (p in $scope.cloudfolder) {
                path += $scope.cloudfolder[p];
            }
            $http.get('/getfilesandfolder?path=' + path).success(function (data) {
                $scope.cloudfiles = data;
            });
        }
        else
        {
             $scope.message = 'You have reached root folder.';
              $timeout(function(){
             $scope.message = '';
                }, 5000);
        }
        //return false;

    }
    var rootpath = new Object();
    rootpath.name = '/';
    rootpath.type = 'd';
    rootpath.date = null;
    $scope.changeWorkingDirectory(rootpath);
}

cloud2ftpapp.controller('cloud2ftpctrl', ['$scope','$http', '$timeout', cloud2ftpctrl]);