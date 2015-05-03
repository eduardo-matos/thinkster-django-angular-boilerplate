(function () {
    'use strict';

    angular
        .module('thinkster.authentication.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ['$rootScope', '$location', '$cookies', '$http'];

    function Authentication ($rootScope, $location, $cookies, $http) {
        return {
            register: register,
            login: login,
            logout: logout,
            unauthenticate, unauthenticate,
            isAuthenticated: isAuthenticated,
            getAuthenticatedAccount: getAuthenticatedAccount,
            setAuthenticatedAccount: setAuthenticatedAccount
        };

        ///////////////

        function register (email, password, username) {
            return $http.post('/api/v1/accounts/', {
                username: username,
                password: password,
                email: email
            }).then(registerSuccess, registerFailure);

            function registerSuccess (data, status, headers, config) {
                setAuthenticatedAccount(data.data);
            }

            function registerFailure (data, status, headers, config) {
                console.log('Epic fail!');
            }
        }

        function login (email, password) {
            return $http.post('/api/v1/auth/login/', {
                email: email,
                password: password
            }).then(loginSuccess, loginFailure);

            function loginSuccess (data, status, headers, config) {
                setAuthenticatedAccount(data.data);
                $rootScope.$broadcast('account.login', {
                    username: data.data.username
                });
                $location.url('/');
            }

            function loginFailure (data, status, headers, config) {
                console.log('Epic fail!');
            }
        }

        function logout () {
            return $http.post('/api/v1/auth/logout/')
                .then(logoutSuccess, logoutFailure);

            function logoutSuccess (data, status, headers, config) {
                unauthenticate();
                $rootScope.$broadcast('account.logout');
                $location.url('/');
            }

            function logoutFailure (data, status, headers, config) {
                console.log('Epic failure!');
            }
        }

        function getAuthenticatedAccount () {
            if(!$cookies.authenticatedAccount) {
                return;
            }

            return JSON.parse($cookies.authenticatedAccount);
        }

        function isAuthenticated () {
            return !!$cookies.authenticatedAccount;
        }

        function setAuthenticatedAccount (account) {
            $cookies.authenticatedAccount = JSON.stringify(account);
        }

        function unauthenticate () {
            delete $cookies.authenticatedAccount;
        }
    }
}());
