/*
 Managers-Util :  Utilities for Ibiza Managers
 */

// jQuery global properties
$.ibizaBrowser = (function() {
  var s = navigator.userAgent.toLowerCase();
  var match = /(webkit)[ \/](\w.]+)/.exec(s) ||
    /(opera)(?:.*version)?[ \/](\w.]+)/.exec(s) ||
    /(msie) ([\w.]+)/.exec(s) ||
    !/compatible/.test(s) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) ||
    [];
  return { name: match[1] || "", version: match[2] || "0" };
}());

$.isIE = function() {
  var isIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./);
  var isIE10 = navigator.appVersion.indexOf("MSIE 10") !== -1;
  //alert("ie val - 11: " + isIE11 + ", 10: " + isIE10);
  return (isIE11 || isIE10);
};

// jQuery extending methods
jQuery.fn.extend({
  ibizaHide: function() {
    return this.each(function() {
      jQuery(this).addClass("hidden");
    });
  },
  ibizaShow: function() {
    return this.each(function() {
      jQuery(this).removeClass("hidden");
    });
  },
  ibizaToggleDisabled: function(textInputElement) {
    var $thisObj = this;
    return this.each(function() {
      if (textInputElement.length > 0) {
        textInputElement.keyup(function() {
          $thisObj.prop("disabled", textInputElement.val().length <= 0);
        });
      }
    });
  },
  ibizaCenter: function(layerHeight) {
    var windowHeight = $(window).height(), scrollTop = $(window).scrollTop();
    var val = (scrollTop + windowHeight / 2 - layerHeight / 2);
    this.css("top", Math.max(0, val) + "px");
  },

  // <img> element 상위 element의 style이 "position:relative; overflow:hidden; display:[block|inline-block]; height:000px; width:000px;" (고정크기의 relative 위치속성을 갖는 element)
  //    ex. <span style="position:relative; overflow:hidden; display:inline-block; height:120px; width:120px;"><img src="http://sandbox-yellowid.kakao.com/attach/4/32/0H2.jpg"></span>
  // both : boolean 타입이며, 가로 세로 양방향 crop을 의미함, 기본동작은 세로 crop
  cropImage: function(both) {

    this.each(function () {
      if(this.tagName.toLowerCase() != 'img') return false;

      var $img = $(this);
      var $parent = $img.parent();

      var top = 0;
      var width = $parent.width();
      var height = $parent.height();
      if(both) { // 양방향 crop
        var naturalRatio = this.naturalWidth / this.naturalHeight;
        var ratio = width / height;
        if (naturalRatio > ratio) {
          var newWidth = (naturalRatio / ratio) * width;
          var left = (newWidth - width) / 2;
          $img.attr('style', 'width:' + newWidth + 'px; height:' + height + 'px; left:-' + left + 'px; position:relative;');

        } else if (naturalRatio < ratio) {
          var newHeight = (ratio / naturalRatio) * height;
          top = (newHeight - height) / 2;
          $img.attr('style', 'width:' + width + 'px; height:' + newHeight + 'px; top:-' + top + 'px; position:relative;');
        }

      } else { // 세로 crop
        top = ($img.height() - $parent.height()) / 2;
        if (top > 0) $img.attr('style', 'width:' + width + 'px; top:-' + top + 'px; position:relative;');
      }
    });
  }
});

// apply jquery-tooltip functionality
$(function() {
  var $document = $(document);
  if($document.tooltip) $document.tooltip();
});

function checkBrowser() {
  var ua = window.navigator.userAgent;
  if(!jQuery.cookie("_checkBrowser")) {
    if (ua.indexOf('Trident/4.0') >= 0 || ua.indexOf('MSIE 6') >= 0 || ua.indexOf('MSIE 7') >= 0 || ua.indexOf('MSIE 9') >= 0) {
      if(window.richAlert)
        richAlert('접속하신 브라우저는 옐로아이디에서 지원하지 않습니다.\n원활한 사용을 위하여 크롬브라우저 사용을 권장해드립니다.\n\n<a style="text-decoration: underline; color:blue;" href="https://www.google.com/intl/ko/chrome/browser/features.html">크롬 다운로드 바로가기</a>');
      else
        alert('접속하신 브라우저는 옐로아이디에서 지원하지 않습니다.\n원활한 사용을 위하여 크롬브라우저 사용을 권장해드립니다.\n\n크롬 다운로드 바로가기\nhttps://www.google.com/intl/ko/chrome/browser/features.html');
    }
    jQuery.cookie('_checkBrowser', 'true');
  }
}

function ibizaFindUrlPatterns(str) {
  var ptnHttp = new RegExp("(http|ftp|https)://\\S+");
  var res = str.match(ptnHttp);
  if (res == null) {
    var ptn = new RegExp("((http|ftp|https)://){0,1}[\\w-]+(\\.[\\w-]+)*(\\.[a-zA-Z]+)([\\w.,@@?^=%&amp;:/~+#-]*[\\w@@?^=%&amp;/~+#-])?");
    res = str.match(ptn);
  }
  return res != null && res.length > 0 ? res[0] : null;
}
