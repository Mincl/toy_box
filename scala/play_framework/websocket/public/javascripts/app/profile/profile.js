$(function() {
  $('.toggle_comment').click(function () { $(this).parent().toggleClass('on') });

  var $bgImageView = $('#bgImageView');
  if($bgImageView.attr('src').indexOf('/assets/img/bg_noimage2.png') == -1) {
    $bgImageView.cropImage(true);
  }

  $bgImageView.on('load', function() { $bgImageView.cropImage(true); });

  var canClose = $('.canClose').text().trim() == "true";
  var $openBtn = $('#openBtn, #openBtnInCheckList');
  $openBtn.click(function () {
    var isOpen = $openBtn.hasClass("on");
    if (isOpen) {
      if (canClose) {
        richConfirm({
          question: '옐로아이디를 Close 상태로 전환하시겠습니까?<br/>Close 시, 아이디 검색 및 친구추가가 불가능합니다.',
          ok: closeProfile
        })
      } else {
        richAlert('친구추천을 취소하고, 일대일 대화 기능을 OFF 한 후에<br/>Close 상태로 전환이 가능합니다.');
      }

    } else {
      richConfirm({
        question: '옐로아이디를 Open 상태로 전환하시겠습니까?<br/>Open 시, 아이디 검색 및 친구추가가 가능합니다.',
        ok: openProfile
      })
    }
  });

  function closeProfile() {
    $.ajax("/json/profile/close", {
      type: 'POST',
      success: function (data) {
        if (data.code == '0000') {
          $openBtn.addClass("off").removeClass("on");
          $('#profileOpenIcon').addClass('s_aclose').removeClass('s_aopen');

          if($('.pf_article[data-articleId]').length == 0) {
            $('#openCheckList').show();   // homeArticle.scala.html 파일의 "옐로아이디 오픈 준비 checkList" 관련 처리 로직!!!
            $('#emptyArticle').hide();
          }
        } else {
          richAlert(data.message || "시스템 에러가 발생하였습니다. 잠시 후 다시시도해 주세요.");
        }
      },
      'beforeSend': showLoading,
      'complete': hideLoading
    })
  }

  function openProfile() {
    $.ajax("/json/profile/open", {
      type: 'POST',
      success: function (data) {
        if (data.code == '0000') {
          $openBtn.addClass("on").removeClass("off");
          $('#profileOpenIcon').addClass('s_aopen').removeClass('s_aclose');
          $('#openCheckList').hide();   // homeArticle.scala.html 파일의 "옐로아이디 오픈 준비 checkList" 관련 처리 로직!!!
          if($('.pf_article[data-articleId]').length == 0) {
            $('#emptyArticle').show();
          }
        } else {
          richAlert(data.message || "시스템 에러가 발생하였습니다. 잠시 후 다시시도해 주세요.");
        }
      },
      'beforeSend': showLoading,
      'complete': hideLoading
    })
  }

  var $profilePopup = $('#profilePopup');
  var $profileForm = $('#profileForm');
  var $siteUrl = $('#siteUrl');

  var urlRegx = /^http[s]?:\/\//;
  $siteUrl.blur(function() {
    var url = $siteUrl.val().trim();
    if(url.length > 0 && !urlRegx.test(url)) {
      $siteUrl.val('http://' + url);
      validator.form();
    }
  });

  $('.openProfilePopup').click(function() { $profilePopup.bPopup({position: ['50%', 'auto']}); });

  var validator = $profileForm.validate();

  var $introMessage = $('#introMessage');
  var $introMessageLength = $('#introMessageLength');
  $introMessage.keyup(function() { $introMessageLength.text($introMessage.val().length); });

  $('#saveProfileBtn').click(function() {
    if(!validator.form()) return;

    $profileForm.ajaxSubmit({
      'success' : function(data) {
        if(data.code == "0000") { // 성공
          location.reload();
        } else {
          richAlert(data.message || "시스템 에러가 발생하였습니다. 잠시 후 다시시도해 주세요.");
        }
      },
      'beforeSend': showLoading,
      'complete': hideLoading
    });
  });

  $('#profileImageFile').fileupload({
    acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
    done: function (e, data) {
      if(data.result.success) {
        var uploadFile = data.result.uploadFile;
        $('.profileImage').attr("src", uploadFile.fileUrl).parent().attr('href', uploadFile.fileUrl);
        $('#profileImageFileId').val(uploadFile.id);
      } else {
        richAlert(data.result.message || "파일 업로드를 실패하였습니다.");
      }
    },
    fail: function() { richAlert("파일 업로드를 실패하였습니다."); },
    submit: function(e, data) { showLoading(); },
    always: function(e, data) { hideLoading(); }
  });

  $('#bgImageFile').fileupload({
    acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
    done: function (e, data) {
      if(data.result.success) {
        var uploadFile = data.result.uploadFile;
        $('.bgImage').attr("src", uploadFile.fileUrl).parent().attr('href', uploadFile.fileUrl);
        $('#bgImageFileId').val(uploadFile.id);
      } else {
        richAlert(data.result.message || "파일 업로드를 실패하였습니다.");
      }
    },
    fail: function() { richAlert("파일 업로드를 실패하였습니다."); }
  });

  $('.openZipCodePopup').click(function() {
    new daum.Postcode({
      oncomplete: function(data) {
        $('#zipCode').val(data.postcode1 + '-' + data.postcode2);
        $('#address').val(data.address);
        $('#addressDetail').focus();
      }
    }).open();
  });

});