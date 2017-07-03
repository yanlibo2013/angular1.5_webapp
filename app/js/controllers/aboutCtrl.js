define(['app', 'css!/css/about/about.css'], function (app) {
    app.controller('AboutCtrl', ['$scope', '$http', function ($scope, $http) {
        $http({
            method: 'GET',
            url: "data/data.json"
        }).success(function (response) {
            console.log(response);
            $scope.list = response;
        }).error(function (response) {
            //dialog.toast("服务器异常，请稍后再试!");
        });

    }]);
    return app;
});


// define(['app'], function (app) {
//     app.controller('ListCtrl', ['$scope', '$http', function ($scope, $http) {
//         $http({
//             method: 'GET',
//             url: "data/data.json"
//         }).success(function (response) {
//             $scope.list = response;
//         }).error(function (response) {
//             //dialog.toast("服务器异常，请稍后再试!");
//         });

//     }]);
//     return app;
// });