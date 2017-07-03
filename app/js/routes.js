define([], function () {
    var loadController = function (controllerName) {
        return ["$q", function ($q) {
            var deferred = $q.defer();
            require([controllerName], function () {
                deferred.resolve();
            });
            return deferred.promise;
        }];
    };

    return {
        defaultRoutePath: '/home',
        states: [{
                name: "home",
                data: {
                    url: '/home',
                    templateUrl: 'views/home.html',
                    controller: 'HomeCtrl',
                    resolve: {
                        HomeCtrl: loadController("controllers/homeCtrl")
                    }
                }
            },
            {
                name: "about",
                data: {
                    url: '/about',
                    templateUrl: 'views/about.html',
                    controller: 'AboutCtrl',
                    resolve: {
                        AboutCtrl: loadController("controllers/aboutCtrl")
                    }
                }
            },
            // {
            //     name: "list",
            //     data: {
            //         url: '/list',
            //         templateUrl: 'views/list.html',
            //         controller: 'ListCtrl',
            //         resolve: {
            //             ListCtrl: loadController("controllers/ListCtrl")
            //         }
            //     }
            // }

        ]
    };
});