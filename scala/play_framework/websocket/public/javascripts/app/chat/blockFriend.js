$(function() {
  var $popup = $('#blockFriendPopup');
  var $phoneNumber = $('#phoneNumber');

  $("#blockFriendBtn").click(function() {
    $popup.bPopup({position: ['50%', 'auto']});
    $('#chatTypeSelectMenu').hide();
    $('#chatRooms .sel_group').removeClass('on');
  });

  $popup.find("button").click(function() {
    var phoneNumber = $phoneNumber.val().replace(/[\s-]/g, "").trim();
    if(phoneNumber) {
      $.ajax({
        'url': '/json/friends/block/' + phoneNumber,
        'type': 'POST',
        'success': function (data) {
          if(data.code == '0000') {
            richAlert("친구 차단이 완료되었습니다.");
          } else if(data.code == '4002') {
            richAlert($('#phoneNumber').val() + " 전화번호 사용자와<br/>친구관계가 아닙니다.");
          } else {
            richAlert(data.message || "시스템 에러가 발생하였습니다. 잠시 후 다시시도하여 주세요.");
          }
        },
        'error': function () {
          richAlert("시스템 에러가 발생하였습니다. 잠시 후 다시시도하여 주세요.");
        },
        'beforeSend': showLoading,
        'complete': hideLoading
      });

      $phoneNumber.val('');
      $popup.bPopup().close();

    } else {
      alert("전화번호를 입력해 주세요.")
    }
  });
});