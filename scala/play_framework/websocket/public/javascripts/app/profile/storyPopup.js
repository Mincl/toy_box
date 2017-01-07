$(function() {
  var $storyBtn = $('#storyBtn');
  var $storyPopup = $('#storyPopup');
  var $storyId = $('#storyId');
  var $email = $('#email');
  var $password = $('#password');

  $storyBtn.click(function() {
    var isConnected = $storyBtn.hasClass("on");
    if(isConnected) {
      richConfirm({
        question: '스토리채널 연결을 해제하시겠습니까?<br/>해제 시, 스토리채널 게시물이 미니홈에 노출되지 않습니다.',
        ok : disconnectStory
      });
    } else {
      $storyPopup.bPopup({position: ['50%', 'auto']});
    }
  });

  $('#authStoryBtn').click(function() {
    // 스토리채널 공식 오픈후 적용 예정!!!
    var storyId = $storyId.val();
    var email = $email.val();
    var password = $password.val();

    storyId ? $storyId.removeClass('error') : $storyId.addClass('error');
    email ? $email.removeClass('error') : $email.addClass('error');
    password ? $password.removeClass('error') : $password.addClass('error');

    if(!storyId || !email || !password) return;

    var authData = {
      storyId: storyId,
      email: email,
      password: password
    };

    $.ajax('/json/profile/story/connect', {
      type: 'post',
      data: authData,
      success: function(data) {
        if(data.code == '0000') {
          $storyBtn.addClass("on").removeClass("off");
          richAlert('<em>' + data.storyPlus.name + '</em><br/>스토리채널과 연결이 완료되었습니다.');
        } else {
          richAlert(data.message || "시스템 에러가 발생하였습니다. 잠시 후 다시시도해 주세요.");
        }
      },
      'beforeSend': showLoading,
      'complete': hideLoading
    });

    $storyPopup.bPopup().close();
  });

  function disconnectStory() {
    $.ajax('/json/profile/story/disconnect', {
      type: 'post',
      success: function(data) {
        if(data.code == '0000') {
          $storyBtn.addClass("off").removeClass("on");
        } else {
          richAlert(data.message || "시스템 에러가 발생하였습니다. 잠시 후 다시시도해 주세요.");
        }
      },
      'beforeSend': showLoading,
      'complete': hideLoading
    });
  }
});