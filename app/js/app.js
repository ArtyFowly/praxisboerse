'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
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
}]);

// TODO fix bugs - Keep dropdown menu open until clicked again (add to <li class="dropdown">)
/*$('.dropdown.keep-open').on({
  "shown.bs.dropdown": function() { this.closable = false; },
  "click":             function() { this.closable = false; },
  "hide.bs.dropdown":  function() { return this.closable; }
});*/
