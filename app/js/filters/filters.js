define(["app"],function(){
    'use strict';
    var filters = angular.module('App.filters', []);

    filters.filter('time',function(){
    	return function(value){
    			var s = ~~(value/1000%60),
    				m = ~~(value/1000/60%60),
    				h = ~~(value/1000/3600%24);
    				d = ~~(value/1000/3600/24%365);
    			return d+"天"+h+"时"+m+"分"+s+"秒";
    	}
    });

    // 日期格式化过滤器
    filters.filter('formatTimestamp' , function(){
        return function(str){
            return new Date(Date.parse(str));
        };
    });

    //过滤a标签
    filters.filter('formatString' , function(){
        return function(str){ 
           return str.replace(/(<\/?a[^>]*>)(?!.*\1)/ig,"");
        };
    });

    //截取银行卡后四位
    filters.filter('subBankNum',function(){
    	return function(str){
    		return str.substr(str.trim().length-4,str.trim().length);
    	};
    });

    //日期转化为距离现在天-小时
    filters.filter('formatdate' , function(){
        return function(str){ 
        	var today = new Date();
    		var ms;
    		var time="";
    		if(today.getTime()>parseInt(str)){
    			ms=today.getTime()-parseInt(str);
    			var theTime = parseInt(ms/1000);// 秒
    		    var theTime1 = 0;// 分
    		    var theTime2 = 0;// 小时
    		    var day = 0;//天
    		    
    		    if(theTime > 60) {
    		        theTime1 = parseInt(theTime/60);
    		        theTime = parseInt(theTime%60);
    		        if(theTime1 > 60) {
    		            theTime2 = parseInt(theTime1/60);
    		            theTime1 = parseInt(theTime1%60);
    		        }
    		        if(theTime2 > 24){
    		        	day = parseInt(theTime2/24);
    		       		theTime2 = parseInt(theTime2%24);
    		        }
    		    }
    		    if(theTime2>0){
    		    	time=theTime2+"小时";
    		    }
    		    if(day>0){
    		    	time=day+"天"+time;
    		    }
    		}
           return time;
        };
    });

    filters.filter('separate',function(){
    	return function(value,catagory){
    		value = value || '';
    		var _data = {
    			zh:function(){ return value.replace(/\w*/g,'')},
    			us:function(){ return value.replace(/[^\w*]/g,'')}
    		}
    		return _data[catagory]();
    	}
    });
    //金额过滤 保留两位小数，且不四舍五入
    filters.filter('filterMoney',function(){
    	return function(value){
            if (!value) {
                return '0.00';
            }
    		value = value + "" || '';
            var arr = value.split('.');
            if (arr.length ==  1) {
                value += '.00';
            }
            if (arr.length > 1) {
                if (arr[1].length == 1) {
                    value += "0";
                }
            }
    		return value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    	}
    });
    //金额过滤 保留一位小数，且不四舍五入 
    filters.filter('filterAnnualYield',function(){
    	return function(value){
    		value=value+"" || '';
    		return value.replace(/(\.\d)\d+/ig,"$1") ;
    	}
    });

    //格式化为三位分隔
    filters.filter("formatThousand",function(){
        return function(value){
            var values = String(value).split(".");
            var newValue = "";
            for(var i=0;i<values[0].length;i++){
                newValue += values[0][i] + (i%3==(values[0].length-1)%3 && i!=values[0].length-1 ? "," : "");
            }
            return newValue + (values[1] ? "."+values[1] : "");
        }
    });

    filters.filter('tofix',function(){
    	return function(value){
    		value = value * 100 || 0;
    		return value.toFixed(2);
    	}
    });
    /*保留两位并四舍五入*/
    filters.filter('tofixed',function(){
    	return function(value){
    		value = value;
    		return value.toFixed(2);
    	}
    });
    /*万与元的单位转换*/
    filters.filter('money', function() {
    	var moneyFilter = function(number) {
    		var num = parseInt(number/10000);
    		return num;
    	};
    	return moneyFilter;
    });
    /*手机号中间加*号*/
    filters.filter('mobile', function() {
    	var mobileFilter = function(mobile) {
    		var mobile = mobile.substr(0, 3) + '****' + mobile.substr(7);
    		return mobile;
    	};
    	return mobileFilter;
    });

    filters.filter('repaymentType', function() {
        var repaymentTypeFilter = function(value) {
            var states = "";
            if (value=='1') {
                states = "等额本息"
            } else if(value=='2') {
                states = "先息后本"
            } else if(value=='7') {
                states = "按月还本付息"
            } else if(value=='8') {
                states = "一次性还本付息"
            }
            return states;
        }
        return repaymentTypeFilter;
    });

    filters.filter('productState', function() {
        var repaymentStateFilter = function(value) {
            var states = "";
            if(value == 7){
                states = "还款中";
            }else if (value == 5 || value == 6 ) {
                states = "出借中";
            }else if (value == 8 ) {
                states = "已结清";
            }
            return states;
        }
        return repaymentStateFilter;
    });
    filters.filter('trustHtml', function($sce) {
    	return function(input) {
    	   return $sce.trustAsHtml(input);
    	}
    });

});

