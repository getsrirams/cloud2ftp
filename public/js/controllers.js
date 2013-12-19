var cloud2ftpapp = angular.module('cloud2ftpapp', []);

cloud2ftpapp.factory('socket', function ($rootScope) {
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
});

function cloud2ftpctrl($scope, socket) {
    /*$http.get('/getfilesandfolder').success(function (data) {
    $scope.cloudfiles = data;
    });*/

    socket.on('get:filesandfolders', function (data) {
        $scope.cloudfiles = data;
    });

    //Properties
    $scope.orderProp = '';
    $scope.cloudfolder = new Array();

    //Methods
    $scope.changeWorkingDirectory = function (file) {
        return false;

    }
}

cloud2ftpapp.controller('cloud2ftpctrl', ['$scope', 'socket', cloud2ftpctrl]);