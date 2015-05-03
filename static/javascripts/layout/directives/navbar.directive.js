(function () {
    'use strict';

    angular
        .module('thinkster.layout.directives')
        .directive('navbar', navbar);

    function navbar () {
        return {
            restrict: 'E',
            scope: {},
            controller: 'NavbarController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/navbar.html'
        }
    }
}());
