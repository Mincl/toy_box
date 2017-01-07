(function($) {

  $.fn.ibizaSelect = function(opts) {
    var setting = opts || {};

    var selects = [];

    this.each(function () {
      var $select = $(this).hide();
      var name = $select.attr('name');

      $select.parent().children('div.sel_group._' + name).remove();

      var css = { maxHeight: '500px'};
      if(setting.width) css.width = setting.width;

      var $comboBox = $(
        '<div class="sel_group _'+name+'">' +
          '<a class="bn bn_type clickable">' +
            '<span class="tx">' + $select.find('option:selected').html() + '</span>' +
            '<span class="select_action"><span class="sp ico_select"></span></span>' +
          '</a>' +
          '<div class="sel_wrap" style="overflow: auto; max-height: '+ setting.maxHeight +';">' +
            '<ul class="lst_sel"></ul>' +
          '</div>' +
        '</div>'
      );
      $comboBox.css(css).addClass($select.attr('class'));
      selects.push($comboBox[0]);

      var $optionWrap = $comboBox.find('.lst_sel');

      $select.before($comboBox);
      var selectedVal = $select.val();
      var $options = $select.children("option");
      for(var i = 0; i < $options.length; i++) {
        var $option = $($options[i]);
        var label = $option.html();
        var optionVal = $option.attr('value');
        if(optionVal == selectedVal) {
          $optionWrap.append('<li data-value="'+optionVal+'"><a class="clickable selected">'+label+'<span class="sp sel_chkd">선택됨</span></a></li>')
        } else {
          $optionWrap.append('<li data-value="'+optionVal+'"><a class="clickable">'+label+'<span class="sp sel_chkd">선택됨</span></a></li>')
        }
      }

      $comboBox.find('a').click(function() { $comboBox.find('.sel_wrap').toggle(); });

      $optionWrap.children().click(function() {
        var $this = $(this);
        $optionWrap.find('.selected').removeClass('selected');
        $this.addClass('selected');

        var value = $this.attr('data-value');
        $comboBox.find('span.tx').html($this.text().replace("선택됨", ""));
        $select.val(value);
        if(setting.change && typeof setting.change == 'function') {
          setting.change.call($select[0], value);
        }
      });
    });

    return $(selects);
  };
})(jQuery);