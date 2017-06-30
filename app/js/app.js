define(['routes' , 'angular-ui-router' , 'directives' , 'services', 'filters' , 'angular-cookies' , 'swiper-animate', 'swiper'], function (config) {
    'use strict';

    var app = angular.module('app', ['ui.router' , 'ngCookies' , 'App.directives' , 'App.services' , 'App.filters' , 'chieffancypants.loadingBar' , 'services.config' , 'angulartics' , 'angulartics.piwik','ngSanitize']);

    app.config(
        [
            '$locationProvider',
            '$controllerProvider',
            '$compileProvider',
            '$filterProvider',
            '$provide',
            '$stateProvider',
            '$urlRouterProvider',
            '$httpProvider',
            'cfpLoadingBarProvider',
            '$analyticsProvider',
            function($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider , $urlRouterProvider , $httpProvider ,cfpLoadingBarProvider,$analyticsProvider)
            {
                cfpLoadingBarProvider.includeSpinner = true;
                cfpLoadingBarProvider.latencyThreshold = 100;
                app.controller = $controllerProvider.register;
                app.directive  = $compileProvider.directive;
                app.filter     = $filterProvider.register;
                app.factory    = $provide.factory;
                app.service    = $provide.service;
                $analyticsProvider.virtualPageviews(true);
                //$locationProvider.html5Mode(true);
                $httpProvider.interceptors.push('UserInterceptor');
                if(config.states !== undefined)
                {
                    angular.forEach(config.states, function(states, path)
                    {
                        //console.log(route);
                        //$urlRouterProvider.when(path, {templateUrl:route.templateUrl, resolve:dependencyResolverFor(route.dependencies)});
                        $stateProvider.state(states.name,states.data);
                    });
                }

                if(config.defaultRoutePath !== undefined)
                {
                    $urlRouterProvider.otherwise(config.defaultRoutePath);
                }
            }
        ]);
    app.config(["$httpProvider", function ($httpProvider) {
        //更改 Content-Type
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
        $httpProvider.defaults.headers.post["Accept"] = "*/*";
        $httpProvider.defaults.transformRequest = function (data) {
            //把JSON数据转换成字符串形式
            if (data !== undefined) {
                return $.param(data);
            }
            return data;
        };
    }])
    app.factory('UserInterceptor', ["$q","$rootScope","$location",'cookieOperation' , 'gqTools', 'gqConfig', function ($q,$rootScope,$location,cookieOperation,gqTools,gqConfig) {

        return {
            request:function(config){
                //console.log($rootScope.token);
                //config.headers["Content-Type"]  = "application/json; charset=utf-8";
                config.headers["GQGET-Token"] = $rootScope.token ||"";
                config.headers["Client-Type"] = $rootScope.clientType || 8;
                return config;
            },
            responseError : function(response){
                //判断错误码，如果是未登录
                if(response.status == 401 || response.status == 408){
                    $rootScope.token = null;
                    $rootScope.clientType = "";
                    $rootScope.path = "";
                    // location doMain
                    var cookieDomain =  gqTools.getCookieDomain();
                    cookieOperation.remove("token"    ,{domain: cookieDomain});
                    dialog.toast("请您先登录");
                    $rootScope.$emit("userIntercepted","notLogin",response);
                }
                return $q.reject(response);
            }
        };
    }]);
    app.run(['$rootScope' , '$location' , '$window', '$state', '$stateParams' , 'cookieOperation','gqConfig','gqTools' ,function($rootScope , $location , $window , $state, $stateParams , cookieOperation,gqConfig,gqTools){

        function browserRedirect() {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            } else {
                location.href = "http://www.gqget.com";
            }
        }

        browserRedirect();
        // 处理错误请求事件
        $rootScope.$on('userIntercepted',function(errorType){
            cookieOperation.put('back_url',$location.path());
            //获取客户端类型
            var clientType =  gqTools.getCookie("clientType");
            var timmer = setTimeout(function(){
                clearTimeout(timmer);
                if (clientType == 7) {
                    var path = $location.path().split("/").join('_');
                    location.href = gqConfig.wechatUrl + "/openIdIndex/toLogin?loginType=jf_" + path;
                } else if (clientType == 3 || clientType == 4) {
                    location.href = "action/login";
                } else {
                    $location.path('/login');
                }
            },100);
        });
        //console.log('cookie==>' + cookieOperation.get('token'));
        $rootScope.token = cookieOperation.get('token');
        $rootScope.clientType = cookieOperation.get('clientType');
        $rootScope.path = cookieOperation.get('path');
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);

    return app;
});
