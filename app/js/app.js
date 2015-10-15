'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {

}]);

// Keep dropdown menu open until clicked again
$('.dropdown.keep-open').on({
  "shown.bs.dropdown": function() { this.closable = false; },
  "click":             function() { this.closable = true; },
  "hide.bs.dropdown":  function() { return this.closable; }
});
