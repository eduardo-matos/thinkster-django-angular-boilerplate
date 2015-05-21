describe('Authentication services', function() {
    var $scope, $httpBackend, $cookies, Authentication, $log, $location;

    beforeEach(module('thinkster.authentication.services'))
    beforeEach(inject(function($rootScope, _$cookies_, _$httpBackend_, _Authentication_, _$log_, _$location_) {
        // Create a new scope that's a child of the $rootScope
        $scope = $rootScope.$new();
        $cookies = _$cookies_;
        $httpBackend = _$httpBackend_;
        Authentication = _Authentication_;
        $log = _$log_;
        $location = _$location_;
    }));

    describe('Register', function () {

        it('should post to api with correct params', function () {
            $httpBackend.when('POST', '/api/v1/accounts/').respond(200);

            $httpBackend.expectPOST('/api/v1/accounts/', {username: 'eduardo', password: 'spam', email: 'some@email.com'});
            Authentication.register('some@email.com', 'spam', 'eduardo');
            $httpBackend.flush();
        });

        it('should set cookie with authenticated user', function () {
            $httpBackend.when('POST', '/api/v1/accounts/').respond(200, {username: 'edu', email: 'spam@ham.com'});

            Authentication.register('some@email.com', 'spam', 'eduardo');
            $httpBackend.flush();

            expect(JSON.parse($cookies.authenticatedAccount)).toEqual({username: 'edu', email: 'spam@ham.com'});
        });

        it('should log message on fault response', function () {
            $httpBackend.when('POST', '/api/v1/accounts/').respond(400);
            spyOn($log, 'info');

            Authentication.register('some@email.com', 'spam', 'eduardo');
            $httpBackend.flush();

            expect($log.info).toHaveBeenCalledWith('Epic fail!');
        });

    });

    describe('Login', function () {

        it('should post to api with correct params', function () {
            $httpBackend.when('POST', '/api/v1/auth/login/').respond(200, {username: 'eduardo'});

            $httpBackend.expectPOST('/api/v1/auth/login/', {email: 'some@email.com', password: 'spam'});
            Authentication.login('some@email.com', 'spam');
            $httpBackend.flush();
        });

        it('should set cookie with authenticated user', function () {
            $httpBackend.when('POST', '/api/v1/auth/login/').respond(200, {username: 'eduardo'});

            Authentication.login('some@email.com', 'spam');
            $httpBackend.flush();

            expect(JSON.parse($cookies.authenticatedAccount)).toEqual({username: 'eduardo'});
        });

        it('should broadcast user info and redirect to home', inject(function ($rootScope) {
            $httpBackend.when('POST', '/api/v1/auth/login/').respond(200, {username: 'eduardo'});
            spyOn($rootScope, '$broadcast').and.callThrough();
            spyOn($location, 'url');

            Authentication.login('some@email.com', 'spam', 'eduardo');
            $httpBackend.flush();

            expect($location.url).toHaveBeenCalledWith('/');
            expect($rootScope.$broadcast).toHaveBeenCalledWith('account.login', {
                username: 'eduardo'
            });
        }));

        it('should log info if some error occur', function () {
            $httpBackend.when('POST', '/api/v1/auth/login/').respond(500);
            spyOn($log, 'info');

            Authentication.login('some@email.com', 'spam');
            $httpBackend.flush();

            expect($log.info).toHaveBeenCalledWith('Epic fail!');
        });

    });
});

