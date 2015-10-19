'use strict';
var username = "";
var password = "";
// Declare app level module which depends on views, and components
angular
    .module('myApp', ['ngRoute','myApp.version','base64'])
    .config(['$routeProvider', function($routeProvider) {

        $routeProvider.
            when('/showList', {
            templateUrl: 'templates/showList.html'
          })
          .when('/login', {
            templateUrl: 'templates/login.html'
          })
          .otherwise({
            redirectTo: '/login'
          });
    }])
    .controller('loginController', [
         '$scope', '$http',
        function($scope, $http) {
            $scope.userName = username;
            $scope.password = password;
            $scope.login = function ( ) {
                $http({
                    method: 'GET',
                    url: 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/credential/check/' + $scope.UserName + '/' + $scope.Password
                }).then(function successCallback(response) {
                    if (response.data) {
                        username = $scope.UserName;
                        password = $scope.Password;
                    }
                }, function errorCallback(response) {
                    console.log(response.data)
                });
            };
        }])
    .controller('listController', [
        '$base64', '$scope', '$http',
        function($base64, $scope, $http){
            $http.defaults.headers.common.Authorization = 'Basic ' + $base64.encode(username + ':' + password);
            $http({
                method: 'GET',
                url: 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/joboffer/offers/joboffer/0/-1',
                respondType: 'json'
            }).then(function successCallback(response) {
                var obj = response.data;
                $scope.jobs = obj.offers;
            }, function errorCallback(response) {
                console.log(response)
            });
        }
]);


// TODO fix bugs - Keep dropdown menu open until clicked again (add to <li class="dropdown">)
/*$('.dropdown.keep-open').on({
  "shown.bs.dropdown": function() { this.closable = false; },
  "click":             function() { this.closable = false; },
  "hide.bs.dropdown":  function() { return this.closable; }
});*/
