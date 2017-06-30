define([], function () {
    'use strict';

    var services = angular.module('App.services', [])
        .factory('gqTools',function($cookieStore , $location , $rootScope , cookieOperation){
            function getUserInfo() {
                return {
                    uuid    :$cookieStore.get("uuid") || null,
                    token   :$cookieStore.get("token") || null,
                    username:$cookieStore.get("username") || null,
                };
            }
            
            function isLogin() {
                if ($rootScope.token) {
                    return true;
                }
                if ($cookieStore.get('token')) {
                    return true;
                }
                return false;
            }
            /**
             * 金额格式化
             * @param  {[Number]} num [需要格式化的数字]
             * @return {[type]}     [description]
             */
            function formatMoney(num){
                if(num == undefined) num = '0';
                num = num.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '').replace(/\s/g, ""); //trim
                num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');  //保留两位小数 三位之后舍弃
                if(isNaN(num) || num =='' || num.length > 12){
                  return num;
                };
                var cents = num.replace(/^\w*/ig,'');
                if(cents.length === 0) cents = '.00';
                if(cents.length === 2) cents = cents + '0';
                num = parseInt(num).toString();
                for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++){
                num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
                };
                return num+cents;
            };

            /**
             * 日期格式化
             * @param  {[type]} dateString [description]
             * @return {[type]}            [description]
             */
            function formatDate(dateString) {
                if (angular.isNumber(dateString)) {
                    return dateString;
                } else if (angular.isString(dateString)) {
                    var regx = /^\d{4}-\d{2}-\d{2}$/g;
                    if (dateString.length < 11 && regx.test(dateString)) {
                        try {
                            var timestamp = new angular.mock.TzDate(0, dateString
                                    + 'T00:00:00Z');
                            return timestamp.getTime() - 28800000;
                        } catch (e) {
                            console.info(e);
                        }
                    }
                    return dateString;
                }
            };

            /**
             * 判断对象是否为空
             * @param  {[type]}  obj [description]
             * @return {Boolean}     [description]
             */
            function isEmpty( value ) {
            	return (Array.isArray(value) && value.length === 0) 
                 || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0) 
                 || !value 
                 || typeof(value) == "undefined" 
                 || !value.toString().trim();
            }

            /**
             * 跨页面传参
             * @return {Object}
             */
            var saveData = (function(){
                var _date = {};
                return {
                    //传值使用saveData.setKeyVal方法，参数为{key1:val1,key2:val2...}
                    setKeyVal:function(options){
                        _date = options;
                    },
                    //取值使用saveData.getKeyVal方法，参数为{key1，key2...}返回的为所取值组成的对象
                    getKeyVal:function(){
                        var _tempDate={};
                        if(!arguments.length){
                            return false;
                        }
                        for(var i in arguments){
                            _tempDate[arguments[i]] = _date[arguments[i]];
                        }
                        return _tempDate;
                    }
                };
            })();
            /**
             * 节流
             */
            var throttle = function(func,time){
                var timer;
                return function(){
                    clearTimeout(timer);
                    timer = setTimeout(func,time);
                }
            }
            
            function getCookie(name) {
                var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                if(arr=document.cookie.match(reg)) {
                    return unescape(arr[2]);
                }
                else {
                    return null;
                }
            }

            function delCookie(name) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval=getCookie(name);
                if(cval!=null) {
                    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
                }
            }

            function setCookie(name,value) {
                var Days = 30;
                var exp = new Date();
                exp.setTime(exp.getTime() + Days*24*60*60*1000);
                document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
            }

            /*发送短信倒计时*/
            function updateClock(element){
                var times=60;
                var updateClock = function(element) {
                    if(times>-1){
                        element.SMSCode = 'SMSCode-disabled';
                        element.msgcode='重新获取('+times+')';
                        times--;
                    }else{
                        element.inSendMsg = false;
                        element.SMSCode = 'SMSCode';
                        element.msgcode='获取验证码';
                        clearInterval(timer);
                    }
                };
                var timer=setInterval(function() {
                   element.$apply(updateClock);
                }, 1000);
            }
            
            //获取pageId
            function getUuid(){
          			var len=32;//32长度
          			var radix=16;//16进制
          			var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
          			var uuid=[],i;
          			radix=radix||chars.length;
          			if(len){
          			    for(i=0;i<len;i++){
          			      uuid[i]=chars[0|Math.random()*radix];
          			    }
          			}else{
          			    var r;
          			    uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';
          			    uuid[14]='4';
          			    for(i=0;i<36;i++){
          			      if(!uuid[i]){
          			        r=0|Math.random()*16;
          			        uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];
          			      }
          			    }
          			}
          			return uuid.join('');
        		}
            
            /*还款方式*/
            function repaymentType(type){
                var repayment = " ";
                if(type == 1){
                    repayment = "等额本息";
                }
                else if(type == 2){
                    repayment = "先息后本";
                }
                else if(type == 7){
                    repayment = "按月还本付息";
                }
                else if(type == 8){
                    repayment = "一次性还本付息";
                }
                return repayment;
            }

            function getCookieDomain() {
                var host = $location.host();
                var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
                if (re.test(host)) {
                    return host;
                }
                var hostElements = $location.host().split('.');
                var cookieDomain = null;
                if (hostElements.length > 1) {
                  cookieDomain =  hostElements[hostElements.length - 2] + '.' + hostElements[hostElements.length-1];
                } else {
                  cookieDomain =  hostElements[hostElements.length-1];
                }
                return cookieDomain;
            }

            function checkMobile(value) {
                var r = /\d{11}$/;
                if(isEmpty(value)) {
                  return false;
                }
                return r.test(value);
            }

            function checkPassword(password) {
                if (6 > password.length || password.length > 20 || !/^[\w~`!@#$%&*()_+<>?:."'+*\/\-\^\\\][{}]{6,20}$/.test(password)) {
                  return false;
                }
                return true;
            }

            //获取浏览器UserAgent
            function getBrowser() {
              var UA = navigator.appVersion;
              return UA;
            }

            function isWeChatBrowser() {
              return getBrowser().split("MicroMessenger/").length > 1
            }

            function isUcBrowser() {
              return getBrowser().split("UCBrowser/").length > 1
            }

            function isIOS() {
              return !!getBrowser().match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); 
            }

            function isAndroid() {
             return /Android/.test(getBrowser()); 
            }
            
            /**
             * 冠e通app webView userAgent标识
             */
            function isGetApp() {
            	return /GETINTEGRALMALL/.test(getBrowser()) || cookieOperation.get("appToken") || cookieOperation.get("appVer");
            }

            /**
             * 钱包app webView userAgent标识
             */
            function isQbApp() {
                return /VJ_WALLET_/.test(getBrowser());
            }
            

            function toLogin() {
              var timmer = setTimeout(function(){
                  clearTimeout(timmer);
                  $location.path('/login');
              },100);
            }
            
            function releaseLocalStatus() {
            	//清理token
            	var cookieDomain =  getCookieDomain();
                cookieOperation.remove("token"    ,{domain: cookieDomain});
                $rootScope.token = null;
            }
            
            /**
             * 初始化页面fond-size值
             */
            function adaptiveLoad(n){
           	 var s=n?n:6.4;
            	var w_w=window.innerWidth;
	           	if(typeof w_w!="number"){
	           		if(document.compatMode=="CSS1Compat"){
	           			w_w=document.documentElement.clientWidth;
	           		}else{
	           			w_w=document.body.clientWidth;
	           		}
	           	}
	           	var _fod=w_w/s;
	           	document.getElementsByTagName("html")[0].style.fontSize=_fod+"px";
	           	window.onresize = function (){//页面大小改变时重新触发事件
	           		adaptiveLoad(s);
	           	}
            }

            var APPCommon = {
                iphoneSchema: 'GQApp://',
                iphoneDownUrl: 'https://itunes.apple.com/us/app/ling-hao-xian/id998259250?ls=1&mt=8',
                androidSchema: 'schemedemo://pszh.com/test/scheme?name=google&page=1',
                androidDownUrl: 'https://dl.gqget.com/dl/pkg/apk/get_android/GqiP2p.apk',
                openApp: function(t) {
                    var this_ = this,
                        openUrl = "";
                    if(navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                        if(t === 0) {
                            openUrl = this_.iphoneDownUrl; //ios下载地址
                        } else if(t === 1) {
                            if(this_.isWeixin()) {
                                dialog.toast("微信不能打开APP，请点击左上角，选择在浏览器中打开");
                                return;
                            }
                            openUrl = this_.iphoneSchema; //ios打开地址
                        }
                    } else if(navigator.userAgent.match(/android/i)) {
                        if(this_.isWeixin()) {
                            dialog.toast("微信中不能下载或打开，请点击左上角，选择在浏览器中打开");
                            return;
                        }
                        if(t === 0) {
                            openUrl = this_.androidDownUrl; //android下载地址
                        } else if(t === 1) {
                            openUrl = this_.androidSchema; //android打开地址
                        }
                    }
                    if(openUrl) {
                        document.location = openUrl;
                    }
                },
                isWeixin: function() { //判断是否是微信
                    var ua = navigator.userAgent.toLowerCase();
                    if(ua.match(/MicroMessenger/i) == "micromessenger") {
                        return true;
                    } else {
                        return false;
                    }
                }

            };

            var openApp = function(){
                APPCommon.openApp(1);
            };
            var downApp = function(){
                APPCommon.openApp(0);
            };

            /**
             * 暴露给外部调用的方法
             */
            return {
                getBrowser: getBrowser,
                formatMoney : formatMoney,
                formatDate : formatDate ,
                userInfo : getUserInfo ,
                saveData:saveData,
                getCookie : getCookie ,
                delCookie : delCookie ,
                setCookie : setCookie ,
                throttle : throttle,
                updateClock : updateClock ,
                getUuid : getUuid,
                repaymentType : repaymentType,
                getCookieDomain : getCookieDomain,
                checkMobile : checkMobile ,
                checkPassword : checkPassword ,
                isEmpty : isEmpty,
                isLogin : isLogin,
                isWeChatBrowser: isWeChatBrowser,
                isUcBrowser : isUcBrowser ,
                isIOS : isIOS ,
                isAndroid : isAndroid,
                isGetApp : isGetApp,
                toLogin : toLogin,
                releaseLocalStatus : releaseLocalStatus,
                adaptiveLoad : adaptiveLoad,
                isQbApp: isQbApp,
                openApp: openApp,
                downApp: downApp
            };
        }).service('cookieOperation', ["$document" , function($document) {
            function hasItem(key) {
              return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test($document[0].cookie);
            }
            return {
              get: function(key) {
                var value = $document[0].cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1");
                return decodeURIComponent(value) || null;
                //return value;
              },

              /**
               * options:
               *  - end (Infinity|String|Date)
               *  - path
               *  - domain
               *  - secure
               */
              put: function(key, value, options) {
                if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
                  return false;
                }
                var expires = "",
                  domain = (options && options.domain) || '',
                  path = (options && options.path) || '',
                  secure = (options && options.secure) || false;

                if (options && options.end) {
                  switch (options.end.constructor) {
                    case Number:
                      expires = options.end === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + options.end;
                      break;
                    case String:
                      expires = "; expires=" + options.end;
                      break;
                    case Date:
                      expires = "; expires=" + options.end.toUTCString();
                      break;
                  }
                }
                $document[0].cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value)
                  + expires
                  + (domain ? "; domain=" + domain : "")
                  + (path ? "; path=" + path : "")
                  + (secure ? "; secure" : "");

                return true;
              },
              remove: function(key, options) {

                if (!key || !hasItem(key)) {
                  return false;
                }
                var domain = (options && options.domain) || '',
                  path = (options && options.path) || '';
                $document[0].cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                  + ( domain ? "; domain=" + domain : "")
                  + ( path ? "; path=" + path : "");
                return true;
              }
            };
        }]
    );
    return services;
});

