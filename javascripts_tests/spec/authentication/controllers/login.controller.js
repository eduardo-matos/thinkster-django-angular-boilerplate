describe('Authentication Login Controller', function() {
    var Authentication, $location, $controller, $rootScope;

    beforeEach(module('thinkster.authentication.services'))
    beforeEach(module('thinkster.authentication.controllers'))

    beforeEach(inject(function(_Authentication_, _$location_, _$rootScope_, _$controller_) {
        Authentication = _Authentication_;
        $location = _$location_;
        $rootScope = _$rootScope_;
        $controller = _$controller_;
    }));

    it('should redirect to root if user is authenticated', function () {
        Authentication.isAuthenticated = function() { return true; };
        spyOn($location, 'url');

        var scope = $rootScope.$new();
        controller = $controller('LoginController', {
            $scope: scope,
            Authentication: Authentication,
            $location: $location
        });

        expect($location.url).toHaveBeenCalledWith('/');
    });

    it('should not redirect to root if user is not authenticated', function () {
        Authentication.isAuthenticated = function() { return false; };
        spyOn($location, 'url');

        var scope = $rootScope.$new();
        controller = $controller('LoginController', {
            $scope: scope,
            Authentication: Authentication,
            $location: $location
        });

        expect($location.url).not.toHaveBeenCalled();
    });

    it('should call Authentication.login on login method', function () {
        spyOn(Authentication, 'login');

        var scope = $rootScope.$new();
        scope.email = 'ham@spam.co';
        scope.password = 'not a secret';

        controller = $controller('LoginController', {
            $scope: scope,
            Authentication: Authentication
        });

        controller.login();

        expect(Authentication.login).toHaveBeenCalledWith(controller.email, controller.password);
    });

});
