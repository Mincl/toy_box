$(function() {
  var $welcomeBtn = $('#welcomeBtn, #addWelcomeImageAndLink');
  var $welcomePopup = $('#welcomePopup');
  var $welcomeEdit = $('#welcomeEdit');
  var $welcomePreview = $('#welcomePreview');

  var $saveBtn = $welcomePopup.find('.add_save');
  var $welcomeMessage = $('#welcomeMessage');
  var $welcomeMsgLength = $('#welcomeMsgLength');

  var $addImgBtn = $welcomePopup.find('.addImgBtn');
  var $imgWrap = $welcomePopup.find('.f_img');
  var $welcomeImage = $('#welcomeImage');
  var $welcomeImageUpload = $('#welcomeImageUpload');
  var $welcomeImageFileId = $('#welcomeImageFileId');
  var $welcomeImageUrl = $('#welcomeImageUrl');
  var $welcomeImageWidth = $('#welcomeImageWidth');
  var $welcomeImageHeight = $('#welcomeImageHeight');

  var $addLinkBtn = $welcomePopup.find('.addLinkBtn');
  var $welcomeLinkPopup = $('#welcomeLinkPopup');
  var $welcomeLinkName = $('#welcomeLinkName');
  var $welcomeLinkUrl = $('#welcomeLinkUrl');
  var $welcomeLinkShortenKey = $('#welcomeLinkShortenKey');

  var $vTextArea = $('<textarea/>');
  var brRegx = /\<br\>/gi;
  var spanRegx = /\<\/?span\>/gi;
  var pStartRegx = /\<p\>/gi;
  var pEndRegx = /\<\/p\>/gi;
  function getWelcomeMsg() {
    var refinedText = $vTextArea.html($welcomeMessage.html()).val().replace(brRegx, "\n");
    if($.isIE()) {
      refinedText = refinedText.replace(spanRegx, "").replace(pStartRegx, "").replace(pEndRegx, "\n");
    }
    return refinedText;
  }

  $welcomeMessage.focus(function() {
    $welcomeMessage.css("color", '#fff');
    $welcomeMessage.css("background", '#393939');
  });

  $welcomeMessage.blur(function() {
    $welcomeMessage.css("color", '#444');
    $welcomeMessage.css("background", 'transparent');
  });

  $welcomeMessage.keydown(function(e) {
    var msg = getWelcomeMsg();
    if (msg.length >= 200 && $.inArray(e.which, [8, 16, 17, 18, 27, 37, 38, 39, 40, 46]) < 0) {
      e.preventDefault();
    }
  });

  $welcomeMessage.keyup(function() {
    $welcomeMsgLength.text(getWelcomeMsg().length);
  }).keyup();

  $welcomeMessage.on("paste", function(e) {
    e.preventDefault();
    var text;
    var clp = (e.originalEvent || e).clipboardData;
    if (clp === undefined || clp === null) {
      // IE 호환 코드
      text = window.clipboardData.getData("text") || "";
      if (text !== "") {
        if (window.getSelection) {
          var newNode = document.createElement("span");
          newNode.innerHTML = text.replace(/\r\n/g, "<br/>");
          window.getSelection().getRangeAt(0).insertNode(newNode);
        } else {
          document.selection.createRange().pasteHTML(text);
        }
      }
    } else {
      text = clp.getData("text/plain") || "";
      if (text !== "") document.execCommand("insertText", false, text);
    }

    var msg = getWelcomeMsg();
    $welcomeMsgLength.text(msg.length);
  });

  var savedWelcomeMsg = getWelcomeMsg();
  $welcomeBtn.click(function() {
    toggelPopupMode(false);
    $welcomePopup.bPopup({
      position: ['50%', 50],
      zIndex: 90,
      onClose : function() {
        $welcomeMessage.html(savedWelcomeMsg);
      }
    });
    $welcomeMessage.focus();
  });

  $welcomeImage.load(function() { $welcomeImage.cropImage(); });

  var $welcomeMessageView = $('#welcomeMessageDiv');
  $saveBtn.click(function() {
    var msg =  getWelcomeMsg();
    if(msg.trim().length == 0) {
      richAlert("텍스트 메시지를 입력해주세요.");
      return false;
    } else if(msg.length > 200) {
      richAlert("텍스트는 최대 200자까지 입력 가능합니다.");
      return false;
    }

    var url = ibizaFindUrlPatterns(msg);
    if (url != null) {
      richAlert("텍스트 입력창 내에 링크주소를 입력할 수 없습니다.<br/>(" + (url.length > 45 ? url.substring(0, 45) + "..." : url) + ")<br/>링크 첨부를 원하실 경우, 링크버튼 넣기 기능을 이용해 주세요.");
      return false;
    }

    var welcomeData = { message: msg };

    var attachment = {};
    if($welcomeImageFileId.val()) {
      attachment.image = {
        fileId: Number($welcomeImageFileId.val()),
        imageUrl: $welcomeImageUrl.val(),
        width: $welcomeImageWidth.val(),
        height: $welcomeImageHeight.val()
      }
    }

    if($welcomeLinkName.val() && $welcomeLinkUrl.val() && $welcomeLinkShortenKey.val()) {
      if($welcomeLinkName.val().length > 10) {
        richAlert("링크버튼 이름은 최대 10자까지 입력 가능합니다.");
        return false;
      }

      if($welcomeLinkUrl.val().length > 1024) {
        richAlert("링크주소는 최대 1024자까지 입력 가능합니다.");
        return false;
      }

      attachment.link = {
        linkName: $welcomeLinkName.val(),
        linkUrl: $welcomeLinkUrl.val(),
        shortenKey: $welcomeLinkShortenKey.val()
      }
    }

    if(attachment.image || attachment.link) welcomeData.attachment = attachment;

    $.ajax('/json/profile/welcome', {
      type: 'post',
      contentType : "application/json; charset=UTF-8",
      data: JSON.stringify(welcomeData),
      success: function(data) {
        if(data.code == '0000') {

          $welcomeMessageView.text(msg);
          if(attachment.image || attachment.link) {
            $welcomeMessageView.find('.etc_more').hide();
          } else {
            $welcomeMessageView.find('.etc_more').show();
          }

          if(attachment.image || attachment.link) $('#addWelcomeImageAndLink').hide();
          else $('#addWelcomeImageAndLink').show();

          $welcomeMessage.html(msg);
          savedWelcomeMsg = msg;
          toggelPopupMode(true);
        } else {
          richAlert(data.message || "시스템 에러가 발생하였습니다. 잠시 후 다시시도해 주세요.");
        }
      },
      'beforeSend': showLoading,
      'complete': hideLoading
    });
  });

  $('#welcomeEditIcon').click(function() { toggelPopupMode(false); });

  function toggelPopupMode(isPreview) {
    if(isPreview) {
      $welcomePreview.find('.welcome_message').html(getWelcomeMsg());

      if($welcomeImageUrl.val()) {
        $welcomePreview.find('.welcome_image').attr('src', $welcomeImageUrl.val());
        $welcomePreview.find('.f_img').show();
      } else {
        $welcomePreview.find('.f_img').hide();
      }

      if($welcomeLinkName.val()) {
        $welcomePreview.find('.welcome_link').text($welcomeLinkName.val());
        $welcomePreview.find('.f_link').show().find('a').attr('href', $welcomeLinkUrl.val());
      } else {
        $welcomePreview.find('.f_link').hide();
      }

      $welcomeEdit.hide();
      $welcomePreview.show();
      $welcomePopup.children('div.phone').addClass("complete");

    } else {  // edit mode
      if($welcomeImageUrl.val()) {
        $welcomeEdit.find('.welcome_image').attr('src', $welcomeImageUrl.val());
        $welcomeEdit.find('.f_img').show();
      } else {
        $welcomeEdit.find('.f_img').hide();
      }

      if($welcomeLinkName.val()) {
        $welcomeEdit.find('.f_link').show().find('a').attr('href', $welcomeLinkUrl.val());
      } else {
        $welcomeEdit.find('.f_link').hide();
      }

      updateEditLayout();

      $welcomeEdit.show();
      $welcomePreview.hide();
      $welcomePopup.children('div.phone').removeClass("complete");
    }
  }

  function updateEditLayout() {
    var height = 549;
    var $frameText = $('#frame_txt');
    if($welcomeImageFileId.val()) {
      height -= 160;
      $frameText.css("margin-top", "0px");
    } else {
      $frameText.css("margin-top", "21px");
    }

    if($welcomeLinkName.val()) height -= 70;

    $frameText.find(".comp_edit_text_cont").css("height", (height-10) + 'px');
    $frameText.css("height", height);
  }

  $addImgBtn.hover(function() {
    if($addImgBtn.hasClass('del_img')) {
      $addImgBtn.attr('title', '이미지 삭제');
    } else {
      $addImgBtn.attr('title', '이미지 추가\n권장사이즈 720X630px, 최대 500KB(jpg, png)');
    }
  });

  $addImgBtn.click(function() {
    if($addImgBtn.hasClass('del_img')) deleteImage();
    else $('#welcomeImageUploadLabel').click(); // $welcomeImageUpload.click() 을 사용하는 경우 첫번째 업로드만 정상적으로 동작함... 이유는 ???
  });

  $welcomeImageUpload.fileupload({
    acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
    done: function (e, data) {
      if(data.result.success) {
        addImage(data.result.uploadFile);
      } else {
        richAlert(data.result.message || "파일 업로드를 실패하였습니다.");
      }
    },
    fail: function() { richAlert("파일 업로드를 실패하였습니다."); }
  });

  function addImage(uploadFile) {
    $imgWrap.show();
    $welcomeImage.attr("src", uploadFile.fileUrl);
    $welcomeImageFileId.val(uploadFile.id);
    $welcomeImageUrl.val(uploadFile.fileUrl);
    $welcomeImageWidth.val(uploadFile.width);
    $welcomeImageHeight.val(uploadFile.height);
    $addImgBtn.removeClass('add_img').addClass('del_img');
    updateEditLayout();
  }

  function deleteImage() {
    $imgWrap.hide();
    $welcomeImageFileId.val('');
    $welcomeImageUrl.val('');
    $welcomeImageWidth.val('');
    $welcomeImageHeight.val('');
    $addImgBtn.removeClass('del_img').addClass('add_img');
    updateEditLayout();
  }

  $addLinkBtn.hover(function() {
    if($addLinkBtn.hasClass('del_link')) {
      $addLinkBtn.attr('title', '링크버튼 제거');
    } else {
      $addLinkBtn.attr('title', '링크버튼 넣기');
    }
  });

  $addLinkBtn.click(function() {
    if($addLinkBtn.hasClass('del_link')) deleteLink();
    else $welcomeLinkPopup.bPopup({position: ['50%', 'auto']});
  });

  $welcomeLinkPopup.find(".apply_add_link").click(function() {
    var linkName = $welcomeLinkName.val();
    var linkUrl = $welcomeLinkUrl.val();
    $.ajax("/json/messages/shortenLink", {
      type: 'post',
      data: { 'url': linkUrl },
      success: function(data) {
        if (data.code == "0000") {
          addLink(linkName, linkUrl, data.shortenKey);
        } else {
          richAlert("단축 URL 변환 중 오류가 발생했습니다.");
        }
      },
      'beforeSend': showLoading,
      'complete': hideLoading
    });
  });

  function addLink(linkName, linkUrl, shortenKey) {
    $welcomeLinkShortenKey.val(shortenKey);
    $welcomePopup.find('.f_link').show().find('a').attr('href', linkUrl);
    $('#welcomeLinkView').text(linkName);
    $addLinkBtn.removeClass('add_link').addClass('del_link');
    $welcomeLinkPopup.bPopup().close();
    updateEditLayout();
  }

  function deleteLink() {
    $welcomeLinkName.val('');
    $welcomeLinkUrl.val('');
    $welcomeLinkShortenKey.val('');
    $addLinkBtn.removeClass('del_link').addClass('add_link');
    $welcomePopup.find('.f_link').hide();
    updateEditLayout();
  }

  var $linkNameLength = $welcomeLinkPopup.find('#linkNameLength');
  $welcomeLinkName.keyup(function() {
    var nameLength = $welcomeLinkName.val().trim().length;
    var urlLength = $welcomeLinkUrl.val().trim().length;
    $welcomeLinkPopup.find(".apply_add_link").prop("disabled", (nameLength == 0 || urlLength == 0));
    $linkNameLength.text($welcomeLinkName.val().length);
  }).keyup();

  $welcomeLinkUrl.keyup(function() {
    var nameLength = $welcomeLinkName.val().trim().length;
    var urlLength = $welcomeLinkUrl.val().trim().length;
    $welcomeLinkPopup.find(".apply_add_link").prop("disabled", (nameLength == 0 || urlLength == 0));
  });

  var urlRegx = /^http[s]?:\/\//;
  $welcomeLinkUrl.blur(function() {
    var url = $welcomeLinkUrl.val().trim();
    if(!urlRegx.test(url)) $welcomeLinkUrl.val('http://' + url);
  });

  $welcomeLinkPopup.find(".check_link_available").click(function() {
    var linkUrl = $welcomeLinkUrl.val().trim();
    if (linkUrl.length <= 0) richAlert("URL을 입력해 주세요.");
    else window.open(linkUrl);
  });
});
