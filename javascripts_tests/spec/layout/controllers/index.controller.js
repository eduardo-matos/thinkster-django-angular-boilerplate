describe('Layout Index Controller', function() {
    var Authentication, $controller, $rootScope, Posts, Snackbar;

    beforeEach(module('thinkster.authentication.services'))
    beforeEach(module('thinkster.layout.controllers'))
    beforeEach(module('thinkster.posts.services'))
    beforeEach(module('thinkster.utils.services'))

    beforeEach(inject(function(_Authentication_, _$rootScope_, _$controller_, _Posts_, _Snackbar_) {
        Authentication = _Authentication_;
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Posts = _Posts_;
        Snackbar = _Snackbar_;

        Authentication.isAuthenticated = function () { return true; };
    }));

    it('should initialize variables', function () {
        var scope = $rootScope.$new();
        controller = $controller('IndexController', {
            $scope: scope,
            Authentication: Authentication,
            Posts: Posts
        });

        expect(controller.posts).toEqual([]);
        expect(controller.isAuthenticated).toEqual(Authentication.isAuthenticated());
    });

    it('should update posts on successful posts retrieval', function () {
        Posts.all = function() {
            return {
                then: function (onSuccess, onFail) {
                    onSuccess({data: 'it works!'});
                }
            };
        };

        var scope = $rootScope.$new();
        controller = $controller('IndexController', {
            $scope: scope,
            Authentication: Authentication,
            Posts: Posts
        });

        expect(controller.posts).toEqual('it works!');
    });

    it('should call snackbar.error on post failure', function () {
        Posts.all = function() {
            return {
                then: function (onSuccess, onFail) {
                    onFail({error: '=('});
                }
            };
        };

        spyOn(Snackbar, 'error');

        var scope = $rootScope.$new();
        controller = $controller('IndexController', {
            $scope: scope,
            Authentication: Authentication,
            Posts: Posts,
            Snackbar: Snackbar
        });

        expect(Snackbar.error).toHaveBeenCalledWith('=(');
    });

    describe('Broadcasting', function () {
        var controller;

        beforeEach(function () {
            Posts.all = function() { return {then: function () {} };};

            var scope = $rootScope.$new();
            controller = $controller('IndexController', {
                $scope: scope,
                Authentication: Authentication,
                Posts: Posts,
                Snackbar: Snackbar
            });
        });

        it('should remove first post on creation error', function () {
            controller.posts = [3, 2, 1];
            $rootScope.$broadcast('post.created.error');

            expect(controller.posts).toEqual([2, 1]);
        });

        it('should prepend post on creation success', function () {
            controller.posts = [2, 1];
            $rootScope.$broadcast('post.created', 3);

            expect(controller.posts).toEqual([3, 2, 1]);
        });

    });

});
