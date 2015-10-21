'use strict';
// Declare app level module which depends on views, and components
angular
    .module('myApp', ['ngRoute','myApp.version','base64'])
    .factory('Credentials', function() {
        var Credentials = {
            username: '',
            password: '',
            encryptedpassword: ''
        };
        return Credentials;
    })
    .config(['$routeProvider', function($routeProvider) {

        $routeProvider
            .when('/showList', {
                templateUrl: 'templates/showList.html'
            })
            .when('/login', {
                templateUrl: 'templates/login.html'
            })
            .otherwise({
                redirectTo: '/login'
            });
    }])
    .controller('loginController', function($scope, $http, $location, $base64, Credentials) {
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
                            $location.path('/showList');
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