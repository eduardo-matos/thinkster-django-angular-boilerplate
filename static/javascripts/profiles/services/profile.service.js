(function () {
    'use strict';

    angular
        .module('thinkster.profiles.services')
        .factory('Profile', Profile);

    Profile.$inject = ['$http'];

    function Profile ($http) {
        return {
            destroy: destroy,
            get: get,
            update: update
        };

        function destroy (username) {
            return $http.delete('/api/v1/accounts/' + username + '/');
        }

        function get (username) {
            return $http.get('/api/v1/accounts/' + username + '/');
        }

        function update (profile) {
            return $http.put('/api/v1/accounts/' + profile.username + '/', profile);
        }
    }
}());
