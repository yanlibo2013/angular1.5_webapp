define(['app', 'css!/css/home/home.css'], function (app) {
    app.controller('HomeCtrl', ['$rootScope', '$location', '$scope', '$http', '$window', '$sce', 'gqConfig', '$timeout', 'gqTools', '$state', function ($rootScope, $location, $scope, $http, $window, $sce, gqConfig, $timeout, gqTools, $state) {

        $scope.tap = function () {

            $http({
                method: 'GET',
                url: "data/data.json"
            }).success(function (response) {
                console.log(response);
            }).error(function (response) {
                dialog.toast("服务器异常，请稍后再试!");
            });
        }

    }]);
    return app;
});