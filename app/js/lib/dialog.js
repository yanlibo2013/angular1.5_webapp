/**
* dialog 手机版
*
*/

(function(window, document, $, undefined) {
  var _winWidth   = $(window).width(),
      _winHeight  = $(window).height(),
      _globalData = {};

  var dialog = dialog || {};
  window.dialog = dialog;

  //全局配置信息
  dialog.config  = {};
  //用于弹出框的常量值
  dialog.BACK    = 0;
  dialog.RELOAD  = 1;
  dialog.inToast = 0;

  /**
   * toast
   * @name    toast
   * @return  {String}   弹出内容
  */
  dialog.toast = function(content){
    if(dialog.inToast) return;
    dialog.inToast = 1;
    var timmerAlert = null;
    var $spillEl = $(".mod-dialog-toast");
    if($spillEl) $spillEl.remove();
    var spillCon = '<div class="mod-dialog-toast"><span>'+content+'</span></div>';
    $("body").append(spillCon);
    timmerAlert = setTimeout(function(){
      if($(".mod-dialog-toast")) $(".mod-dialog-toast").remove();
      dialog.inToast = 0;
      clearTimeout(timmerAlert); 
      timmerAlert = null;
    } , 3500);
    return;
  }

  /**
   * 弹出loading
   * @name    loading
   * @param   {Function} 关闭后的回调方法
   * @param   {Object}   配置选项
   * @return  {String}   pop对象
  */
  dialog.loading = function(callback , opts){
    if(!$.isFunction(callback) && $.type(callback) === "object")
        opts = callback;
        opts = opts || {};
      opts.content = $.type(callback) === "string" ? callback : (opts.text ? opts.text : null);
      return _pop(dialog.tpl(dialog.config.loading,opts),callback,opts);
  };

  /**
   * 弹出信息
   * @name    alert
   * @param   {String}    弹出内容
   * @param   {Function}  关闭后的回调方法
   * @param   {Object}    配置选项
   * @return  {String}    pop对象
  */
  dialog.alert = function(content, callback, opts){
      if(!content) return;
      if(!$.isFunction(callback) && $.type(callback) === "object")
        opts = callback;
      opts = opts || {};

     opts.content = content;
     dialog.config.alert = _configTplTranslate(dialog.config.alert);
     return _pop(dialog.tpl(dialog.config.alert,opts),callback,opts);
  };

  /**
   * 弹出确认
   * @name    confirm
   * @param   {String}    弹出内容
   * @param   {Function || [Function,Function]}  确定后的回调方法 || [确定后的回调方法,取消后的回调方法]
   * @param   {Object}    配置选项
  */
  dialog.confirm = function(content, callback, opts) {
      if(!content) return;
      if(!$.isFunction(callback) && $.type(callback) === "object")
        opts = callback;
      opts = opts || {};

      opts.content = content;
      dialog.config.confirm = _configTplTranslate(dialog.config.confirm);

      opts.shown = function(){
          $("#Js-confirm-ok").click(function(){
              dialog.popClose();
              if($.isFunction(callback))
                  callback();
              else if($.isFunction(callback[0]))
                    callback[0]();
          });
          if($.isFunction(callback[1])){
              $(".Js-pop-close").click(function(){
                callback[1]();
              });
          }
      };
      return _pop(dialog.tpl(dialog.config.confirm,opts),opts);
  };

  /**
   * 自定义弹框
   * @name    pop
   * @param   {String}    弹出内容
   * @param   {Function}  关闭后的回调方法
   * @param   {Object}    配置选项
   * @return  {String}    pop对象
  */
  dialog.pop = function(content, callback, opts) {
      if(!content) return;
      if(!$.isFunction(callback) && $.type(callback) === "object")
        opts = callback;
      opts = opts || {};
      var temp;
      if(/^#/.test(content)){
        if(!$(content).length) return;
        temp = '<div class="mod-pop" '+(opts.width ? 'style="width:'+opts.width+'"': '')+'>'+$(content).html()+'</div>';
        if(opts.removeAfterShow)
         $(content).remove();
      } else{
        temp = '<div class="mod-pop" '+(opts.width ? 'style="width:'+opts.width+'"': '')+'>'+content+'</div>';
      }
      return _pop(temp,callback,opts);
  };

  /**
   * 弹框关闭
   * @name    popClose
  */
  dialog.popClose = function() {
      if(_globalData.currentPop)
        _globalData.currentPop.close();
  };

  //解决弹出模板问题
  function _configTplTranslate(string){
      return string.replace('<%',dialog.config.tplOpenTag).replace('%>',dialog.config.tplCloseTag);
  };

  // dialog 核心方法
  function _pop(content , callback , opts){
    if(!content) return;
      if(!$.isFunction(callback) && $.type(callback) === "object")
      opts = callback;
      opts = opts || {};
    if(callback === dialog.RELOAD){
        callback = function(){
          location.reload();
        };
      } else if(callback === dialog.BACK){
        callback = function(){
          history.back(-1);
        };
      } else if(callback && $.type(callback) === "string"){
        var jumpUrl = callback;
        callback = function(){
          location.href = jumpUrl;
        };
      };
      //执行回调函数 不弹出
      if(opts.notPop){
        callback();
          return;
      };

      $(".Js-pop").remove();

      var htmlContent = content;

      var temp = _getShadeLayer("Js-pop")+
                "<div id='js-layer-main' class='Js-pop pop-container'>"+
                  htmlContent+
                "</div>";
      $("body").append(temp);
      //设置居中
      _setEleToCenter("#js-layer-main",opts);
      // resize下居中
      $(window).on('resize',function(){
        _setEleToCenter("#js-layer-main",opts);
      });

      //关闭dialog
      function _close(){
        if(opts.attachBg) $("body").css({"overflow":"auto","position":"static","height":"auto"});
        $("body").off("keyup");
        $(".Js-pop-close").off("click");
        $(".Js-pop").hide().remove();
        _globalData.currentPop = null;
      };

      //点击遮罩层关闭
      if(opts.layerClick){
        $("#js-layer-bg").off('click').click(function(){
          _close();
        });
      };

      //当弹出框弹出时禁止页面滚动
      if(opts.attachBg){
        $("body").css({"overflow":"hidden","position":"relative","height":$(window).height()});
      };


      $(".Js-pop-close").click(function(){
         _close();
         if($.isFunction(callback))
            callback();
         else if($.isFunction(opts.close))
            opts.close();
      });

      //弹出框弹出后的回调方法
      if($.isFunction(opts.shown)){
          opts.shown();
      };

      //根据autoCloseTime 后自动关闭弹出框
      if(opts.autoCloseTime){
        if(!opts.autoCloseTime) opts.autoCloseTime = 3000;
          window.setTimeout(function(){
            _close();
          },opts.autoCloseTime || 3000);
      };

      //记录当前dialog
      _globalData.currentPop = {
        close : _close,
        open  : function(){
          _pop(htmlContent,callback,opts);
        }
      };

      return _globalData.currentPop;
  };  

  //获得dialog蒙版层
   function _getShadeLayer(layerClass) {
      var window_height = $('body').outerHeight() > _winHeight?$('body').outerHeight() : _winHeight;
      return '<div id="js-layer-bg" class="'+layerClass+' mod-dialog"></div>';
   };

  function _setEleToCenter(eleId, opts) {
      opts = opts || {};
      var _winWidth  =  $(window).width(),
          _winHeight =  $(window).height(),
        y          =  opts.offsetY || -50,   //设置向上偏移
          $el        =  $(eleId),
          width      =  $el.width(),
          height     =  $el.height();
      y += _winHeight/2-height/2;
      $el.css({
              "margin-left" : '-' + width/2 + 'px',
              "margin-top" : '-' + height/2 + 'px'});
  };

  /**
   * 模板引擎
   * @name    tpl
   * @param   {String}  所要使用的模板，可以是id也可以是字符串
   * @param   {String}  需要结合的数据
   * @param   {String}  模板和数据结合后将append到这个元素里
  */
  dialog.tpl = function(template,data,appendEle){
      dialog.tpl.cache = dialog.tpl.cache || {};
      if(!dialog.tpl.cache[template]){
        var content    = template,
            match      = null,
            lastcursor = 0,
            codeStart  = 'var c = [];',
            codeEnd    = 'return c.join("");',
            param      = "",
            compileTpl = "",
            checkEXP   = /(^( )?(if|for|else|switch|case|continue|break|{|}))(.*)?/g,
            searchEXP  = new RegExp(dialog.config.tplOpenTag+"(.*?)"+dialog.config.tplCloseTag+"?","g"),
            replaceEXP = /[^\w$]+/g;
        if(template.charAt(0) === "#")
          content = $(template).html();
        else
          content = template;

        while(match = searchEXP.exec(content)){
          var b = RegExp.$1;
          var c = content.substring(lastcursor,match.index);
          c = _formatString(c);
          compileTpl += 'c.push("'+c+'");\n';
          if(checkEXP.test(b)){
            compileTpl += b;
          }
          else{
            compileTpl += 'c.push('+b+');\n';
          }
          _setVar(b);
          lastcursor = match.index+match[0].length;
        }
        compileTpl+= 'c.push("'+_formatString(content.substring(lastcursor))+'");';
        dialog.tpl.cache[template] = new Function('data','helper',param+codeStart+compileTpl+codeEnd);
      }

      var result = dialog.tpl.cache[template].call(null,data,dialog.tpl.helperList);
      if(appendEle){
       $(appendEle).append(result);
      }

      function _formatString(s){
        return s.replace(/^\s*|\s*$/gm, '').replace(/[\n\r\t\s]+/g, ' ').replace(/"/gm,'\\"');
      }

      function _setVar(code){
        code = code.replace(replaceEXP,',').split(',');
        for(var i=0,l=code.length;i<l;i++){
          code[i] = code[i].replace(checkEXP,'');
          if(!code[i].length || /^\d+$/.test(code[i])) continue;
          if(dialog.tpl.helperList && code[i] in dialog.tpl.helperList)
            param += code[i]+' = helper.'+code[i]+';';
          else
            param += 'var '+code[i]+' = data.'+code[i]+';';
        }
      }
    return result;
  };
})(window, document, jQuery);

if(typeof dialog !== "undefined" && typeof jQuery !== "undefined"){
  $.extend(dialog.config, {
     //模板引擎解析时使用的开始标示符
    tplOpenTag : "<%",

    //模板引擎解析时使用的结束标示符
    tplCloseTag : "%>",

    //弹出框loading结构
    loading: '<div class="mod-dialog-notice-container">\
      <i class="mod-dialog-loading-white"></i>\
      <%if(content){%>\
      <p><%content%></p>\
      <%}%>\
    </div>',

    //弹出框alert结构
    alert: '<div class="mod-dialog-content">\
      <div class="mod-inner">\
      <%if(title){%><div class="mod-tit"><%title || "提示"%></div><%}%>\
      <div class="mod-txt tc"><%content%></div>\
      </div>\
      <div class="mod-btn">\
        <%if(!noBtn){%>\
          <button class="embed-btn-mod Js-pop-close" type="button"><%okText||"确 定"%></button>\
        <%}%>\
      </div>\
    </div>',

    //弹出框confirm结构
    confirm: '<div class="mod-dialog-content">\
      <div class="mod-inner">\
      <%if(title){%><div class="mod-tit"><%title || "消息"%></div><%}%>\
      <div class="mod-txt tc"><%content%></div>\
      </div>\
      <div class="mod-btn">\
        <button class="Js-pop-close embed-btn-mod" type="button"><%cancelText||"取消"%></button>\
        <button id="Js-confirm-ok" class="embed-btn-mod" type="button"><%okText||"确定"%></button>\
      </div>\
    </div>'

  });
}