'use strict';
// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['ngRoute','myApp.version','base64', 'restServices']);

app.factory('AppNotifier', function($rootScope) {
    return {
        subscribeLogin: function(scope, callback) {
            var loginHandler = $rootScope.$on('LoginEvent', callback);
            scope.$on('$destroy', loginHandler);
        },
        subscribeLogout: function(scope, callback) {
            var logoutHandler = $rootScope.$on('LogoutEvent', callback);
            scope.$on('$destroy', logoutHandler);
        },
        subscribeFilter: function(scope, callback) {
            var filterHandler = $rootScope.$on('FilterEvent', callback);
            scope.$on('$destroy', filterHandler);
        },
        notifyLogin: function() {
            $rootScope.$emit('LoginEvent');
        },
        notifyLogout: function() {
            $rootScope.$emit('LogoutEvent');
        },
        notifyFilter: function() {
            $rootScope.$emit('FilterEvent');
        }
    };
});

app.factory('Credentials', function() {
    var Credentials = {
        username: '',
        password: ''
    };

    return Credentials;
});

app.factory('List', function() {
    // populate through REST
});

app.controller('viewController', function($scope, AppNotifier, Credentials, Credential) {

    // Display content according to login, logout and filter status

    AppNotifier.subscribeLogin($scope, function() {
        $scope.showContentList = true;
        $scope.showContentWelcome = false;
        $scope.showNavbarFilter = true;
        $scope.showNavbarLogin = false;
        $scope.showNavbarLogout = true;
    });

    AppNotifier.subscribeLogout($scope, function() {
        $scope.showContentList = false;
        $scope.showContentWelcome = true;
        $scope.showNavbarFilter = false;
        $scope.showNavbarLogin = true;
        $scope.showNavbarLogout = false;
    });

    AppNotifier.subscribeFilter($scope, function() {
        // TODO load filtered list from List service
    });

    // Initial status: logged out

    AppNotifier.notifyLogout();

    // Initial model

    $scope.model = {username: '', password: ''};

    // Methods for login, logout and filter

    $scope.login = function() {
        // TODO reactivate encryption
        /*Credential.encryptedpassword($scope.username, $scope.password)
            .then(function success(encryptedpassword) {
                console.log('Encrypted password: ' + encryptedpassword);*/
                Credential.check($scope.model.username, $scope.model.password)
                    .then(function success(check) {
                        if (check) {
                            console.log('Check successful: ' + check);

                            // Login
                            Credentials.username = $scope.model.username;
                            Credentials.password = $scope.model.password;
                            AppNotifier.notifyLogin();
                        } else {
                            console.log('Check unsuccessful: ' + check);
                            alert('Login fehlgeschlagen.');
                        }
                    }, function error(error) {
                        console.log('Check unsuccessful with error: ' + error);
                        alert('Login fehlgeschlagen.');
                    });
            /*}, function error(error) {
                console.log('Encryption unsuccessful: ' + error);
                alert('Login fehlgeschlagen.');
            });*/
    };

    $scope.logout = function() {
        // Logout
        Credentials.username = '';
        Credentials.password = '';
        AppNotifier.notifyLogout();
    };

    $scope.filter = function(param_angebotsart, param_standort, param_keyword, param_merkzettel) {
        // TODO Filter list
        // - make REST call through restServices.Joboffer
        // - save filtered list in List service
        AppNotifier.notifyFilter();
    };
});