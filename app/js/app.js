'use strict';
// Declare app level module which depends on views, and components
angular
    .module('myApp', ['ngRoute','myApp.version','base64'])
    .factory('StatusNotifier', function($rootScope) {
        return {
            subscribeLogin: function(scope, callback) {
                var loginHandler = $rootScope.$on('LoginEvent', callback);
                scope.$on('$destroy', loginHandler);
            },
            subscribeLogout: function(scope, callback) {
                var logoutHandler = $rootScope.$on('LogoutEvent', callback);
                scope.$on('$destroy', logoutHandler);
            },
            notifyLogin: function() {
                $rootScope.$emit('LoginEvent');
            },
            notifyLogout: function() {
                $rootScope.$emit('LogoutEvent');
            }
        };
    })
    .factory('Credentials', function() {
        var Credentials = {
            username: '',
            password: '',
            encryptedpassword: ''
        };

        return Credentials;
    })
    .controller('navController', function($scope, StatusNotifier) {
        StatusNotifier.subscribeLogin($scope, function() {
            document.getElementById("nav_login").style.display = "none";
            document.getElementById("nav_logout").style.display = "inherit";
            document.getElementById("nav_filter").style.display = "inherit";
        });

        StatusNotifier.subscribeLogout($scope, function() {
            document.getElementById("nav_login").style.display = "inherit";
            document.getElementById("nav_logout").style.display = "none";
            document.getElementById("nav_filter").style.display = "none";
        });

        StatusNotifier.notifyLogout();
    })
    .controller('loginController', function($scope, $http, $location, $base64, Credentials, StatusNotifier) {
        $scope.login = function () {
            Credentials.username = '';
            Credentials.password = '';
            Credentials.encryptedpassword = '';

            // Encrypt password
            var config = {
                method: 'GET',
                url: 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/credential/encryptedpassword',
                headers: {
                    'Authorization': 'Basic ' + $base64.encode($scope.username + ':' + $scope.password)
                },
                transformResponse: [function (data) {
                    // do nothing, simply pass the encrypted password
                    return data;
                }]
            };
            $http(config)
                .then(function successCallback(response) {
                    Credentials.encryptedpassword = response;

                    // Check credentials
                    var config = {
                        method: 'GET',
                        url: 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/credential/check/' + $scope.username + '/' + Credentials.encryptedpassword
                    }
                    $http(config)
                        .then(function successCallback(response) {
                            Credentials.username = $scope.username;
                            Credentials.password = $scope.password;
                            StatusNotifier.notifyLogin();
                        }, function errorCallback(response) {
                            console.log(response.data);
                            alert('Login fehlgeschlagen.');
                        });
                }, function errorCallback(response) {
                    console.log(response);
                    alert('Login fehlgeschlagen.');
                });
        };
    })
    .controller('logoutController', function($scope, StatusNotifier) {
        $scope.logout = function() {
            StatusNotifier.notifyLogout();
        };
    })
    .controller('listController', function($base64, $scope, $http, Credentials){
        var config = {
            method: 'GET',
            url: 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/joboffer/offers/joboffer/0/-1',
            headers: {
                'Authorization': 'Basic ' + $base64.encode(Credentials.username + ':' + Credentials.password)
            },
            respondType: 'json'
        };
        $http(config).then(function successCallback(response) {
            var obj = response.data;
            $scope.jobs = obj.offers;
        }, function errorCallback(response) {
            console.log(response)
            alert('Anzeige fehlgeschlagen.');
        });
    });