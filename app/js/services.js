var restServices = angular.module('restServices', ['base64']);

restServices.factory('Credential', function($http, $q, $base64) {
    return {
        encryptedpassword: function(username, password) {
            var config = {
                method: 'GET',
                url: 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/credential/encryptedpassword',
                headers: {
                    'Authorization': 'Basic ' + $base64.encode(username + ':' + password)
                },
                transformResponse: [function (data) {
                    // do nothing, simply pass the encrypted password
                    return data;
                }]
            };
            return $http(config)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return $q.reject(response.statusText);
                });
        },
        check: function(username, password) {
            var config = {
                method: 'GET',
                url: 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/credential/check/' + username + '/' + password
            }
            return $http(config)
                .then(function success(response) {
                    return response.data;
                }, function error(response) {
                    return $q.reject(response.statusText);
                });
        }
    };
});

restServices.factory('Joboffer', function($http, $q, $base64) {
    return {
        offers: function(username, password) {
            var config = {
                method: 'GET',
                url: 'https://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/joboffer/offers/joboffer/0/0/-1',
                headers: {
                    'Authorization': 'Basic ' + $base64.encode(username + ':' + password)
                }
            };
            return $http(config)
                .then(function success(response) {
                    return response.data.offers;
                }, function error(response) {
                    return $q.reject(response.statusText);
                });
        }
    }
});

// TODO add REST call for joboffer list
/*var config = {
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
});*/
