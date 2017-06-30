define([], function () {
    'use strict';

    var directives = angular.module('App.directives', [])
        .directive('appFooter', function () {
            function footerCtrl($rootScope,$location,$scope,$window,$document,$element,$attrs,gqTools) {
                var profileUrl = "#/login";
                if (gqTools.isLogin()) {
                    profileUrl = "#/profile";
                }
                $scope.menuList = [
                   {'name' : '首页' , 'uri' : '#/index' , 'theme' : 'weui_icon_shouye'},
                   {'name' : '出借' , 'uri' : '#/lendlist' , 'theme' : 'weui_icon_chujie'},
                   {'name' : '活动' , 'uri' : '#/activityIndex' , 'theme' : 'weui_icon_huodong'},
                   {'name' : '我的' , 'uri' : profileUrl , 'theme' : 'weui_icon_wode'}
               ];
                /*春节icon*/
                /*$scope.menuList = [
                   {'name' : '首页' , 'uri' : '#/index' , 'theme' : 'icon_shouye'},
                   {'name' : '出借' , 'uri' : '#/lendlist' , 'theme' : 'icon_chujie'},
                   {'name' : '活动' , 'uri' : '#/activityIndex' , 'theme' : 'icon_huodong'},
                   {'name' : '我的' , 'uri' : profileUrl , 'theme' : 'icon_wode'}
               ];*/

                $scope.activeTab = function(path) {
                    var reg = new RegExp('^' + path + '.*', 'i');
                    var lp = $location.path();
                    lp = "#" + lp;
                    return reg.test(lp);
                };   
            }
            return {
				templateUrl:"../views/common/footer.html",
				restrict: 'AE',
				replace : true ,
                controller : footerCtrl
			};
        })
        .directive('topBar',['$rootScope','$window','$location', 'gqTools' , function($rootScope,$window,$location,gqTools){
            function link($scope, element, attr) {
                //console.log($scope.ppVector);
                if (!$scope.ppVector) {
                    throw Error("missing required param.");
                }
                
                var ppVector      = angular.copy($scope.ppVector);
                $scope.title      = ppVector.title;   // 设置标题
                $scope.navLeft    = ppVector.navLeft;     // left 
                $scope.navRight   = ppVector.navRight;    // right 功能

                // 设置标题
                var docTitle = "";
                if(!$scope.title){  //默认标题
                    $scope.titleTxt = "";
                    docTitle = "触屏版";
                }else if(angular.isString($scope.title)){     //字符串标题标题
                    $scope.titleTxt = $scope.title;
                    docTitle = $scope.title;
                }else if(angular.isObject($scope.title)){
                    $scope.titleTxt       = $scope.title.txt;
                    docTitle              = $scope.title.txt;
                    $scope.titleClassName = $scope.title.class;
                    $scope.navTitleFn = function($event){
                        angular.isFunction(ppVector.title.callback) ? ppVector.title.callback($event) : '';
                    };
                }
                
                //alert(document.title);
                var $body = $('body');
                document.title = "冠e通-"+ docTitle;
                var $iframe = $('<iframe></iframe>');
                $iframe.on('load',function() {
                    setTimeout(function() {
                        $iframe.off('load').remove();
                    }, 0);
                }).appendTo($body);
                // 没有默认是返回按钮
                if(!$scope.navLeft){
                    $scope.navbarBack = true;
                }else if(angular.isString($scope.navLeft)){     //字符串标题标题
                    //显示字符串
                    $scope.leftNavClassName = $scope.navLeft;
                } else if (angular.isObject($scope.navLeft)) {
                    $scope.navLeftCallBack = true;
                    $scope.navLeftFn = function(){
                        angular.isFunction(ppVector.navLeft.callback) ? ppVector.navLeft.callback() : '';
                    };
                }
                if (!$scope.navRight) {
                    $scope.navbarRight = true;
                } else if (angular.isString($scope.navRight)){
                    $scope.navRightTxt = $scope.navRight;
                } else if (angular.isObject($scope.navRight)) {
                    $scope.navRightCallBack = true;
                    $scope.navRightTxt = $scope.navRight.txt;
                    $scope.navRightClass = $scope.navRight.class;
                    $scope.navRightFn = function(){
                        angular.isFunction(ppVector.navRight.callback) ? ppVector.navRight.callback() : '';
                    };
                }
                
            }
            function topBarCtrl($rootScope,$location,$scope,$window,$document,$element,$attrs,cookieOperation,$http){
                if (gqTools.isWeChatBrowser() || gqTools.isGetApp() || gqTools.isQbApp()) {
                    //微信浏览器不显示头，冠e通app嵌套wap不显示头部
                    $scope.showTopBar = false;
                    $(".viewport2").removeClass("viewport2");
                    $(".viewport").removeClass("viewport");
                    $(".productD").removeClass("viewport");
                    $(".productD").addClass("viewport3");
                    $(".tab_port").css("margin-top","0");
                    return false;
                }
                $scope.showTopBar = true;

                $scope.goBack = function(){
                     window.history.go(-1);
                };

                $scope.goIndex = function() {
                    $location.path("/index");
                }
                
                $scope.set = function($rootScope){
                    $rootScope.topbarPop = false;
                };

                // 处理菜单显示事件冒泡
                $scope.topbarPopEvent = function(event){
                    //event.stopPropagation();
                };
            }
            return {
                templateUrl:"./views/common/topbar.html",
                restrict: 'AE',
                replace : true ,
                scope:{
                    ppVector:"=ppVector"
                },
                link : link ,
                controller : topBarCtrl
            };
        }]).directive('onFinishRenderFilters',function($timeout){
            return {
                restrict:"A",
                link:function(scope,element,attr){
                    if(scope.$last === true){
                        $timeout(function(){
                            scope.$emit('ngRepeatFinished')
                        })
                    }
                }
            }
        }).directive('onScrolled', function($window) {
            return function(scope, element, attrs) {
                var object = element[0];
                element.bind("scroll", function() {
                    if (object.scrollTop+object.offsetHeight >= object.scrollHeight) {
                        scope.$apply(attrs.onScrolled);
                    }
                });
            };
        }).directive('inputDispose',['$window', 'gqTools' , function($window,gqTools){
            return{
                restrict : "A",
                link : function(scope, element, attrs) {
                if (gqTools.isIOS() && gqTools.isUcBrowser()) { 
                    element.find('input').bind("focus", function(){    
                        $(".module-topBar").css("position", "absolute");
                        $(".bottomfixed").css("position", "absolute");   
                    })
                    element.bind("blur",function() { //输入框失焦后还原初始状态     
                        $(".module-topBar").css("position", "fixed");
                        $("bottomfixed").css("position", "fixed");
                    })

                    }
                } 
            } 
        }]).directive('errorSrc', function () {
            var errorSrc = {
                link: function postLink(scope, element, attrs) {
                	element.bind('error', function() {
                            angular.element(this).attr("src", attrs.errorSrc);                
                    }); 	
                }        
            }        
            return errorSrc;});
    return directives;
});

