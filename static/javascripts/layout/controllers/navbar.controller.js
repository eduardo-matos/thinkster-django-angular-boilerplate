(function () {
    'use strict';

    angular
        .module('thinkster.layout.controllers')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', 'Authentication'];

    function NavbarController ($scope, Authentication) {
        var vm = this;
        vm.logout = logout;
        vm.username = '';
        vm.isAuthenticated = false;

        $scope.$on('account.login', function (evt, args) {
            vm.username = args.username;
            vm.isAuthenticated = true;
        });

        $scope.$on('account.logout', function (evt) {
            vm.username = '';
            vm.isAuthenticated = false;
        });

        activate();

        function activate () {
            var account = Authentication.getAuthenticatedAccount();
            vm.isAuthenticated = !!account;

            if(account && account.username) {
                vm.username = account.username;
            }
        }

        function logout () {
            Authentication.logout();
        }
    }
}());
