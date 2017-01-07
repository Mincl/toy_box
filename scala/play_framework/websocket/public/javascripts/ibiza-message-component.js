/*
 Ibiza Message Component : Phone-shaped message input component
 */

function IbizaMessageComponent(profileName, attachType, isPreviewOnly) {
  var $compFrame = $("#compFrame");
  var $popupAddLink = $("#popupAddLink");
  var $popupAddImageAlbum = $("#popupAddImageAlbum");
  var $messageForm = $("#messageForm");
  var $this = this;
  var $maxTextLength = 400;
  this.maxTextLength = function() { return $maxTextLength; }
  var $maxAlbumImages = 16;
  this.maxAlbumImages = function() { return $maxAlbumImages; }
  var $maxCouponCaptionLength = 100;
  var $maxLinkUrlLength = 1024;
  var $maxImageFileSize = 2097152;

  this.profileName = profileName;
  // message type handling
  this.attachType = attachType;
  var MessageType = { DEFAULT: 1, ALBUM: 2, COUPON: 3 };
  this.messageType = MessageType.DEFAULT;
  if (this.attachType == "CA11" || this.attachType == "CA12") {
    this.messageType = MessageType.ALBUM;
  } else if (this.attachType == "CA3" || this.attachType == "CA7") {
    this.messageType = MessageType.COUPON;
  }
  // preview mode handling (no edit mode)
  this.isPreviewOnly = isPreviewOnly ? true : false;
  if (this.isPreviewOnly) {
    $compFrame.find(".comp_edit_button").ibizaHide();
  }

  // modes
  this.isCouponMode = function() {
    //return $("#couponSection").length > 0;
    return this.messageType == MessageType.COUPON;
  }

  this.setFrameClass = function() {
    switch(this.messageType) {
      case MessageType.ALBUM:
        $compFrame.addClass("t_album");
        $compFrame.removeClass("t_coupon d_view");
        break;
      case MessageType.COUPON:
        $compFrame.addClass("t_coupon");
        $compFrame.removeClass("t_album d_view");
        break;
      default:
        $compFrame.removeClass("t_album t_coupon d_view");
        break;
    }
  }

  // public functions
  this.textMessage = function() {
    this.applyMessage();
    var refinedText = $("<textarea/>").html($compFrame.find(".comp_result_textarea").html()).val().replace(/\<br\>/g, "\n");
    if ($.isIE()) {
      refinedText = refinedText.replace(/\<span\>/g, "").replace(/\<\/span\>/g, "");
    }
    return refinedText;
  }

  this.couponCaption = function() {
    if (this.isCouponMode()) {
      return jQuery.trim($compFrame.find(".comp_edit_coupon_caption").html()).replace(/\<br\>$/, "").replace(/\<br\>/g, "\n");
    } else {
      return undefined;
    }
  }

  this.checkUrlInTextMessage = function() {
    if (this.isPreviewOnly) return true;
    var url = ibizaFindUrlPatterns(this.textMessage());
    if (url != null) {
      if (!this.isCouponMode()) {
        richAlert("텍스트 입력창 내에 링크주소를 입력할 수 없습니다.<br/>(" + (url.length > 45 ? url.substring(0, 45) + "..." : url) + ")<br/>링크첨부를 원하실 경우, 링크버튼 넣기 기능을 이용해 주세요.");
      } else {
        richAlert("텍스트 입력창 내에 링크주소를 입력할 수 없습니다.<br/>(" + (url.length > 45 ? url.substring(0, 45) + "..." : url) + ")");
      }
      return false;
    }
    return true;
  }

  this.validate = function() {
    var requiredAlertMessage = "입력되지 않는 항목을 확인해주세요.";
    // checking validations of inputs
    // case 1 : no text message or over-400 letters check
    var msg = this.textMessage();
    if (msg.length <= 0) return [false, requiredAlertMessage];
    if (msg.length > $maxTextLength) return [false, "텍스트는 최대 400자까지 입력가능합니다."];
    // case 2 : 텍스트 영역에 감히 링크를 넣으려 하는 경우
    if (!this.checkUrlInTextMessage()) return [false, null];
    // case 2 : 이미지앨범에서 이미지를 입력하지 않은 경우
    if (this.messageType == MessageType.ALBUM) {
      if (this.albumImages() <= 0) return [false, requiredAlertMessage];
    }
    // case 3 : no caption or no coupon image in coupon mode
    if (this.isCouponMode()) {
      if (this.couponCaption().length == 0) return [false, requiredAlertMessage];
      else if (this.couponCaption().length > 100) return [false, "쿠폰 이름은 100자를 넘을 수 없습니다."];
      if ($("#pageImageFileId").val() == "") return [false, requiredAlertMessage];
    }
    return [true, ""];
  }

  this.showAlert = function(alertMessage) {
    if (alertMessage) {
      $compFrame.find(".comp_alert_message").text(alertMessage);
      $compFrame.find(".comp_alert").ibizaShow();
    }
  }

  this.hideAlert = function() {
    $compFrame.find(".comp_alert").ibizaHide();
  }

  this.changeCost = function() {
    var cost = 0;
    var tgcost = 0;
    switch (this.attachType) {
      case "CA1": cost = 11; tgcost = 14; break;
      case "CA5": cost = 14; tgcost = 14; break;
      case "CA9": cost = 11; tgcost = 14; break;
      case "CA10": cost = 11; tgcost = 14; break;
      case "CA11": cost = 44; tgcost = 57; break;
      case "CA12": cost = 57; tgcost = 57; break;
      case "CA3": cost = 110; tgcost = 130; break;
      case "CA7": cost = 130; tgcost = 130; break;
      default: cost = -1;
    }
    var totcost = this.targetFlag() ? tgcost : cost;
    var infoText = (this.targetFlag() ? "그룹 " : "전체 ") + "메시지 " + totcost + "캐시";
    if (this.imageFlag()) {
      infoText += "+ 이미지 추가(11 캐시)";
      totcost += 11
    }
    $("#totalCost").text(totcost);
    $("#totalCostInfo").text(infoText);
  }

  // functions
  this.textFlag = function() {
    return this.textMessage().length > 0;
  }

  this.imageFlag = function() {
    var res = $compFrame.find(".comp_result_image").length > 0 && !$compFrame.find(".comp_result_image").hasClass("hidden");
    return res;
  }

  this.linkFlag = function() {
    return $compFrame.find(".comp_result_link").length > 0 && !$compFrame.find(".comp_result_link").hasClass("hidden");
  }

  this.targetFlag = function() {
    return $("#messageTargetGroup").prop("checked");
  }

  // component mode change
  this.editMode = function() {
    this.setFrameClass();
    $compFrame.find(".comp_alert").ibizaHide();
    $compFrame.find(".p_tab").ibizaShow();
    $compFrame.removeClass("complete");

    $compFrame.find(".comp_result").ibizaHide();
    $compFrame.find(".comp_coupon_preview").ibizaHide();
    $compFrame.find(".comp_edit").ibizaShow();

    if (this.messageType == MessageType.DEFAULT) {
      if (!this.imageFlag() && !this.linkFlag()) {
        $compFrame.find(".comp_edit_text_nocont").css("height", "540px");
        $compFrame.find(".comp_edit_text_cont").css("height", "540px");
        $compFrame.find(".comp_edit_text").css("margin-top", "21px");
        $compFrame.find(".comp_edit_image").ibizaHide();
        $compFrame.find(".comp_edit_link").ibizaHide();
      } else {
        if (this.imageFlag() && !this.linkFlag()) {
          $compFrame.find(".comp_edit_text_nocont").css("height", "390px");
          $compFrame.find(".comp_edit_text_cont").css("height", "390px");
          $compFrame.find(".comp_edit_text").css("margin-top", "0px");
          $compFrame.find(".comp_edit_image").css("height", "150px");
          $compFrame.find(".comp_edit_image").ibizaShow();
          $compFrame.find(".comp_edit_link").ibizaHide();
        } else if (!this.imageFlag() && this.linkFlag()) {
          $compFrame.find(".comp_edit_text_nocont").css("height", "480px");
          $compFrame.find(".comp_edit_text_cont").css("height", "480px");
          $compFrame.find(".comp_edit_text").css("margin-top", "21px");
          $compFrame.find(".comp_edit_link").css("height", "60px");
          $compFrame.find(".comp_edit_image").ibizaHide();
          $compFrame.find(".comp_edit_link").ibizaShow();
        } else {
          $compFrame.find(".comp_edit_text_nocont").css("height", "330px");
          $compFrame.find(".comp_edit_text_cont").css("height", "330px");
          $compFrame.find(".comp_edit_text").css("margin-top", "0px");
          $compFrame.find(".comp_edit_image").css("height", "150px");
          $compFrame.find(".comp_edit_link").css("height", "60px");
          $compFrame.find(".comp_edit_image").ibizaShow();
          $compFrame.find(".comp_edit_link").ibizaShow();
        }
      }
    } else if (this.messageType == MessageType.ALBUM) {
      if (this.linkFlag()) {
        $compFrame.find(".comp_edit_text_nocont").css("height", "290px");
        $compFrame.find(".comp_edit_text_cont").css("height", "290px");
        $compFrame.find(".comp_edit_image").css("height", "150px");
        $compFrame.find(".comp_edit_link").css("height", "60px");
        $compFrame.find(".comp_edit_link").ibizaShow();
      } else {
        $compFrame.find(".comp_edit_text_nocont").css("height", "375px");
        $compFrame.find(".comp_edit_text_cont").css("height", "375px");
        $compFrame.find(".comp_edit_image").css("height", "150px");
        $compFrame.find(".comp_edit_link").ibizaHide();
      }
    } else if (this.messageType == MessageType.COUPON) {
      $compFrame.find(".comp_edit_text_nocont").css("height", "360px");
      $compFrame.find(".comp_edit_text_cont").css("height", "360px");
      $compFrame.find(".comp_edit_link").ibizaHide();
    }

    $compFrame.find(".comp_edit_textarea").focus();
  }

  this.previewMode = function(isNoTextAllow) {
    if (!this.textFlag() && !isNoTextAllow) {
      //richAlert("텍스트 메시지를 입력해 주세요.");
      this.showAlert("텍스트 메시지를 입력해 주세요.");
      return;
    } else if (this.textMessage().length > $maxTextLength) {
      this.showAlert("텍스트 메시지는 최대 400자까지 입력가능합니다.");
      return;
    } else if (!this.checkUrlInTextMessage()) {
      return;
    } else if (this.isCouponMode() && this.couponCaption().length > $maxCouponCaptionLength) {
      this.showAlert("쿠폰이름은 최대 100자까지 입력가능합니다.");
      return;
    }
    this.setFrameClass();
    $compFrame.find(".comp_alert").ibizaHide();
    $compFrame.find(".p_tab").ibizaHide();

    this.applyMessage();
    $compFrame.find(".comp_edit").ibizaHide();
    $compFrame.find(".comp_coupon_preview").ibizaHide();
    if (!this.textFlag() && !this.imageFlag() && !this.linkFlag()) {
    } else {
      $compFrame.find(".comp_result").ibizaShow();
      $compFrame.addClass("complete")
      if (this.imageFlag()) {
        $compFrame.find(".comp_result_image").ibizaShow();
      }
      if (this.linkFlag()) {
        $compFrame.find(".comp_result_link").ibizaShow();
      }
    }
    if (this.isCouponMode()) {
      $("<img/>").prop("src", $("#compCouponImage").prop("src")).load(function() {
        $("#compCouponResultImage").prop("src", $("#compCouponImage").prop("src"));
      });
      $("#compCouponCaptionResult").html(this.couponCaption());
    }
  }

  this.couponPreviewMode = function() {
    $compFrame.removeClass("t_album t_coupon complete");
    $compFrame.addClass("d_view");
    $compFrame.find(".comp_alert").ibizaHide();
    $compFrame.find(".p_tab").ibizaHide();

    $compFrame.find(".comp_coupon_preview_headline").text(this.profileName);
    if ($("#pageImageUrl").val()) {
      $compFrame.find(".comp_coupon_preview_image").prop("src", $("#pageImageUrl").val());
      $compFrame.find(".comp_coupon_preview_image_nocont").ibizaHide();
      $compFrame.find(".comp_coupon_preview_image_cont").ibizaShow();
    }
    if (this.couponCaption()) {
      $compFrame.find(".comp_coupon_preview_coupon_name").text(this.couponCaption());
    }
    if ($("#couponStartAt").val()) {
      $compFrame.find(".comp_coupon_preview_start_at").text($("#couponStartAt").val());
    }
    if ($("#couponEndAt").val()) {
      $compFrame.find(".comp_coupon_preview_end_at").text($("#couponEndAt").val());
    }
    if ($("#couponDescription").val()) {
      $compFrame.find(".comp_coupon_preview_description").html($("#couponDescription").val().replace(/\n/g, "<br/>"));
    }

    $compFrame.find(".comp_edit").ibizaHide();;
    $compFrame.find(".comp_result").ibizaHide();
    $compFrame.find(".comp_coupon_preview").ibizaShow();
  }

  this.applyMessage = function() {
    var message = jQuery.trim($compFrame.find(".comp_edit_textarea").html()).replace(/\<br\>$/, "");
    $compFrame.find(".comp_result_textarea").html(message);
    return message;
  }

  this.addText = function(s) {
    $compFrame.find(".comp_edit_textarea").html(s);
  }

  this.addImage = function(imgUrl, preserveMode) {
    // edit area
    $compFrame.find(".comp_edit_imagearea").prop("src", imgUrl);
    // crop image
    $("<img/>").prop("src", imgUrl).load(function() {
      var imgHeight = this.height;
      var resizedImgHeight = imgHeight * (298 / this.width);
      var top = -1 * (resizedImgHeight / 2 - 66);
      $compFrame.find(".comp_edit_imagearea").css("top", top);
    });
    // result area
    $compFrame.find(".comp_result_imagearea").prop("src", imgUrl);
    $compFrame.find(".comp_result_image").removeClass("hidden");
    //$compFrame.find(".comp_edit_add_img").addClass("on");
    $compFrame.find(".comp_edit_add_img").removeClass("add_img");
    $compFrame.find(".comp_edit_add_img").addClass("del_img");
    $compFrame.find(".comp_edit_add_img").prop("title", "이미지 삭제");
    this.changeCost();
    if (preserveMode === undefined || !preserveMode) {
      this.editMode();
    }
  }

  this.removeImage = function() {
    $compFrame.find(".comp_result_imagearea").text("");
    $compFrame.find(".comp_result_image").addClass("hidden");
    $compFrame.find(".comp_edit_image").addClass("hidden");
    //$compFrame.find(".comp_edit_add_img").removeClass("on");
    $compFrame.find(".comp_edit_add_img").removeClass("del_img");
    $compFrame.find(".comp_edit_add_img").addClass("add_img");
    $compFrame.find(".comp_edit_add_img").prop("title", "이미지 추가");

    this.changeCost();
    this.editMode();
  }

  this.addLink = function(title, url, shortenKey, preserveMode) {
    $compFrame.find(".comp_edit_linkarea").text(title);
    $compFrame.find(".comp_edit_linkanchor").prop("href", url);
    $compFrame.find(".comp_edit_link").ibizaShow();
    $compFrame.find(".comp_result_linkarea").text(title);
    $compFrame.find(".comp_result_link").ibizaShow();
    $compFrame.find(".comp_result_link_anchor").prop("href", url);
    $compFrame.find(".comp_edit_add_link").removeClass("add_link");
    $compFrame.find(".comp_edit_add_link").addClass("del_link");
    $compFrame.find(".comp_edit_add_link").prop("title", "링크버튼 제거");
    // add into form value
    $("#linkName").val(title);
    $("#linkUrl").val(url);
    $("#shortenKey").val(shortenKey);
    if (preserveMode === undefined || !preserveMode) {
      this.editMode();
    }
  }

  this.removeLink = function() {
    $compFrame.find(".comp_edit_link").addClass("hidden");
    $compFrame.find(".comp_result_linkarea").text("");
    $compFrame.find(".comp_result_link").addClass("hidden");
    //$compFrame.find(".comp_edit_add_link").removeClass("on");
    $compFrame.find(".comp_edit_add_link").removeClass("del_link");
    $compFrame.find(".comp_edit_add_link").addClass("add_link");
    $compFrame.find(".comp_edit_add_link").prop("title", "링크버튼 넣기");

    this.editMode();
  }

  // 쿠폰 이미지 / 캡션
  this.addCouponImage = function(url) {
    $("#compCouponImage").prop("src", url);
    $("#compCouponResultImage").prop("src", url);
    $compFrame.find(".comp_edit_coupon_image_nocont").ibizaHide();
    $compFrame.find(".comp_edit_coupon_image_cont").ibizaShow();
  }

  this.addCouponCaption = function(s) {
    if (this.isCouponMode()) {
      $compFrame.find(".comp_edit_coupon_caption").html(s);
      $("#compCouponCaptionResult").html(s);
      $compFrame.find(".comp_edit_coupon_caption_nocont").ibizaHide();
      $compFrame.find(".comp_edit_coupon_caption_cont").ibizaShow();
    }
  }

  /*
   * 이미지앨범
   */

  this.albumImages = function() {
    var ids = new Array();
    $.each($popupAddImageAlbum.find(".album_image"), function(idx, val) {
      var id = val.id.split("_")[1];
      var url = val.src;
      ids.push([id, url]);
    });
    return ids;
  }

  this.addAlbumImage = function(fileId, imgUrl) {
    var lst = this.albumImages();
    lst.push([fileId, imgUrl]);
    this.arrangeAlbumImages(lst);
  }

  this.addAlbumImageBox = function() {
    var lst = this.albumImages();
    var imageId = parseInt(Math.random() * 1000000 * -1, 10);
    lst.push([imageId, null]);
    this.arrangeAlbumImages(lst);
    return imageId;
  }

  this.removeAlbumImage = function(fileId) {
    var lst = this.albumImages();
    for(var idx=0; idx<lst.length; ++idx) {
      var val = lst[idx];
      if (val[0] == fileId) {
        lst.splice(idx, 1);
        break;
      }
    }
    this.arrangeAlbumImages(lst);
  }

  this.arrangeAlbumImages = function(lst) {
    if (lst === undefined) lst = this.albumImages();
    if (lst.length > 0) {
      $popupAddImageAlbum.find(".lst_alimg").empty();
      var reprImageId = 0;
      $.each(lst, function(idx, val) {
        if (val[0] > 0) {
          var liTagRemoveId = "btnRemoveAlbumImage_" + val[0];
          var liTag = '<li><span class="img_wrap"><img id="albumImage_' + val[0] + '" src="' + val[1] + '" alt="앨범이미지" class="album_image" /><span class="img_mask"></span><span id="albumImageRepr_' + val[0] + '" class="dsc" style="display:none;"><em>대표이미지</em></span><span id="' + liTagRemoveId + '" class="sp2 btn_remove clickable">이미지 삭제</span></span></li>';
          $popupAddImageAlbum.find(".lst_alimg").append(liTag);
          if (idx == 0) reprImageId = val[0];
        } else {
          var imageId = val[0];
          var liTagRemoveId = "btnRemoveAlbumImageBox_" + imageId;
          var liTag = '<li><span class="img_wrap" style="background:#4e4f51;"><img id="albumImage_' + imageId + '" src="/assets/img/loading_small2.gif" alt="로딩이미지" class="album_image" style="position:relative; top:28px; left:28px; width:40px; height:40px;" /><span id="' + liTagRemoveId + '" class="sp2 btn_remove clickable">이미지 로딩 취소</span></span></li>';
          $popupAddImageAlbum.find(".lst_alimg").append(liTag);
        }
      });
      // "대표이미지" 완장 채우기
      var spanElement = $popupAddImageAlbum.find("#albumImageRepr_" + reprImageId);
      if (spanElement.length > 0) $(spanElement).css("display", "block");
      // 이미지 삭제 버튼 handler 추가
      $popupAddImageAlbum.find(".btn_remove").click(function() {
        var fileId = this.id.split("_")[1];
        $this.removeAlbumImage(fileId);
        if (fileId <= 0) {
          // cancel ajax operation if necessary
        }
      });
      $popupAddImageAlbum.find(".album_image_count").text(lst.length);
      $popupAddImageAlbum.find(".album_image_list_nocont").addClass("hidden");
      $popupAddImageAlbum.find(".album_image_list_cont").removeClass("hidden");
    } else {
      $popupAddImageAlbum.find(".lst_alimg").empty();
      $popupAddImageAlbum.find(".album_image_count").text("0");
      $popupAddImageAlbum.find(".album_image_list_nocont").removeClass("hidden");
      $popupAddImageAlbum.find(".album_image_list_cont").addClass("hidden");
    }
    this.checkAlbumAppliable();
    this.checkAlbumImageAddable();
  }

  this.applyAlbumImage = function() {
    var lst = this.albumImages();
    if (lst.length > 0) {
      // edit area
      $compFrame.find(".comp_edit_image_nocont").addClass("hidden");
      $compFrame.find(".comp_edit_image_cont").removeClass("hidden");
      $compFrame.find(".comp_edit_image_src").prop("src", lst[0][1]);
      $compFrame.find(".comp_edit_image_count").text(lst.length);
      $compFrame.find(".comp_edit_album_title").text($popupAddImageAlbum.find(".album_title").val());
      // result area
      $compFrame.find(".comp_result_add_image").prop("href", lst[0][1]);
      $compFrame.find(".comp_result_image_src").prop("src", lst[0][1]);
      $compFrame.find(".comp_result_image_count").text(lst.length);
      $compFrame.find(".comp_result_album_title").text($popupAddImageAlbum.find(".album_title").val());
    } else {
      $compFrame.find(".comp_edit_image_nocont").removeClass("hidden");
      $compFrame.find(".comp_edit_image_cont").addClass("hidden");
    }
  }

  this.checkAlbumAppliable = function() {
    var flag = $.trim($popupAddImageAlbum.find(".album_title").val()).length <= 0 || this.albumImages().length <= 0;
    $popupAddImageAlbum.find(".apply_add_image_album").prop("disabled", flag);
  }

  this.checkAlbumImageAddable = function() {
    var flag = this.albumImages().length >= $maxAlbumImages;
    $popupAddImageAlbum.find(".file_add_image_album").prop("disabled", flag);
    $popupAddImageAlbum.find(".file_select_image_album").prop("disabled", flag);
  }

  /*
   * Event Handlers : 공통
   */

  // 텍스트 입력 안내 영역 클릭시 Edit Mode 진입
  $compFrame.find(".comp_edit_text_nocont").click(function() {
    $compFrame.find(".comp_edit_text_cont").removeClass("hidden");
    $compFrame.find(".comp_edit_text_nocont").addClass("hidden");
    $this.editMode();
  });

  // 텍스트 입력 영역에서 400자 이상 입력시 입력 막기 & Enter => <br/>로 치환
  $compFrame.find(".comp_edit_textarea").keydown(function(e) {
    if ($this.textMessage().length >= $maxTextLength && $.inArray(e.which, [8, 16, 17, 18, 27, 37, 38, 39, 40, 46]) < 0) {
      e.preventDefault();
    }
    if (e.keyCode === 13) {
      if ($.isIE()) {
        /*
        var range = document.selection.createRange();
        range.pasteHTML("<br/>");
        range.moveStart("character", 0);
        range.moveEnd("character", -1);
        range.select();
        */

        if (window.getSelection) {
          var selection = window.getSelection();
          var range = selection.getRangeAt(0);
          var br = document.createElement("br");
          range.deleteContents();
          range.insertNode(br);
          range.setStartAfter(br);
          range.setEndAfter(br);
          //range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        document.execCommand("insertHTML", false, "<br/><br/>");
      }
      return false;
    }
  });

  // 텍스트 입력시 입력한 길이 표시하기
  $compFrame.find(".comp_edit_textarea").keyup(function(e) {
    var refined = $this.textMessage();
    //alert(refined);
    $compFrame.find(".comp_edit_text_msglen").text(refined.length);
  });

  // 텍스트 입력 영역에 Copy & Paste
  $compFrame.find(".comp_edit_textarea").on("paste", function(e) {
    e.preventDefault();
    /*
    var text = (e.originalEvent || e).clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    */
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
  });

  // 텍스트 입력 영역 focus : 스타일 변경
  $compFrame.find(".comp_edit_textarea").focus(function() {
    $compFrame.find(".comp_edit_textarea").css("color", "#fff");
    $compFrame.find(".comp_edit_textarea").css("background", "#393939");
  });

  // 텍스트 입력 영역 focus out 될 때 : 입력 사항이 없는 경우 입력 안내 문구 노출, 스타일 변경
  $compFrame.find(".comp_edit_textarea").blur(function() {
    if ($this.textMessage().length <= 0) {
      $compFrame.find(".comp_edit_text_cont").ibizaHide();
      $compFrame.find(".comp_edit_text_nocont").ibizaShow();
    } else {
      $compFrame.find(".comp_edit_textarea").css("color", "#444");
      $compFrame.find(".comp_edit_textarea").css("background", "transparent");
    }
  });

  // 텍스트 입력 영역 클릭시 Alert 제거
  $compFrame.find(".comp_edit_textarea").click(function() {
    $compFrame.find(".comp_alert").ibizaHide();
  });

  // 미리보기 모드
  $compFrame.find(".comp_edit_preview").click(function() {
    if ($this.textMessage().length > $maxTextLength) {
      $this.showAlert("텍스트는 최대 400자까지 입력가능합니다.");
    } else {
      $this.previewMode();
    }
  });

  // 미리보기에서 텍스트 편집 버튼 클릭시 Edit Mode 진입
  $compFrame.find(".comp_edit_button").click(function() {
    $this.editMode();
  });

  // 경고문구 클릭시 닫히도록 처리
  $compFrame.find(".comp_alert").click(function() {
    $(this).ibizaHide();
  });

  $compFrame.find(".comp_close_alert_message").click(function() {
    $compFrame.find(".comp_alert").ibizaHide();
  });

  // 링크 추가
  $compFrame.find(".comp_edit_add_link").mousedown(function() {
    if ($this.linkFlag()) {
      $this.removeLink();
    } else {
      $popupAddLink.bPopup({
        modalClose: false,
        position: ["50%", "auto"],
        onOpen: function() {
          $popupAddLink.find(".popup_add_link_name" ).focus();
        }
      });
    }
  });

  // 링크 추가 팝업 액션들
  $popupAddLink.find(".cancel_add_link").click(function() {
    $popupAddLink.bPopup().close();
  });

  $popupAddLink.find(".check_link_available").click(function() {
    var linkUrl = $("#addLinkUrl").val();
    if ($.trim(linkUrl).length <= 0) {
      alert("URL을 입력해 주세요.");
      return;
    }
    window.open(linkUrl);
  });

  $popupAddLink.find(".apply_add_link").click(function() {
    var linkName = $("#addLinkName").val();
    var linkUrl = $.trim($("#addLinkUrl").val());
    if (linkUrl.length > $maxLinkUrlLength) {
      alert("링크 주소의 길이는 " + $maxLinkUrlLength + "자 이하만 가능합니다.")
      return;
    }
    if (linkUrl.indexOf("http://") != 0 && linkUrl.indexOf("https://") != 0) {
      linkUrl = "http://" + linkUrl;
    }
    $.ajax({
      url: "/json/messages/shortenLink",
      type: "post",
      dataType: "json",
      data : { "url": linkUrl },
      success: function(jsdata) {
        if ("code" in jsdata && jsdata.code == "0000") {
          if ("shortenKey" in jsdata) {
            $this.addLink(linkName, linkUrl, jsdata["shortenKey"]);
            $popupAddLink.bPopup().close();
          } else {
            alert("URL 변환키 값을 가져오지 못했습니다. 잠시 후 다시 실행해 주세요.")
            $this.removeLink();
          }
        } else {
          alert(jsdata.message || "URL 변환을 실패하였습니다.")
          $this.removeLink();
        }
      },
      error: function() {
        alert("시스템 오류로 인해 URL 변환을 실패하였습니다.")
        $this.removeLink();
      }
    });
  });

  $popupAddLink.find(".popup_add_link_name").keydown(function() {
    if ($.trim($(this).val()).length > 0 && $.trim($("#addLinkUrl").val()).length > 0) {
      $popupAddLink.find(".apply_add_link").prop("disabled", false);
    }
  });

  $popupAddLink.find(".popup_add_link_name").keyup(function() {
    var len = $(this).val().length;
    $popupAddLink.find(".popup_add_link_name_len").text(len);
  });

  $popupAddLink.find(".popup_add_link_name").blur(function() {
    var len = $(this).val().length;
    $popupAddLink.find(".popup_add_link_name_len").text(len);
  });

  $popupAddLink.find(".popup_add_link_url").focus(function() {
    if ($(this).val().length == 0) {
      $(this).val("http://");
    }
  });

  $popupAddLink.find(".popup_add_link_url").keydown(function() {
    if ($.trim($(this).val()).length > 0 && $.trim($("#addLinkName").val()).length > 0) {
      $popupAddLink.find(".apply_add_link").prop("disabled", false);
    }
  });

  /*
   * Event Handlers : 기본형
   */

  // 첨부 이미지 추가/삭제
  $compFrame.find(".comp_edit_add_img").mousedown(function() {
    if ($this.imageFlag()) {
      $this.removeImage();
      $("#imageFileId").val("");
    } else {
      $compFrame.find(".comp_default_image_file").click();
    }
  });

  // 첨부 이미지 업로드
  $compFrame.find(".comp_default_image_file").fileupload({
    url: "/upload/image?width=720&height=630&thumbMax=120&maxFileSize=512000",
    dataType: "json",
    acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
    maxFilesize: 512000,
    done: function (e, data) {
      if(data.result.success) {
        var uploadFile = data.result.uploadFile;
        $this.addImage(uploadFile.fileUrl);
        $("#imageFileId").val(uploadFile.id);
        //alert("image id : " + uploadFile.id + ", thumbnail id : " + uploadFile.resizedFileId);
      } else {
        alert(data.result.message || "파일 업로드를 실패하였습니다.");
      }
    },
    fail: function() { alert("파일 업로드를 실패하였습니다."); }
  });

  // 이미지 변경
  $compFrame.find(".comp_edit_image").click(function() {
    $this.hideAlert();
    $compFrame.find(".comp_default_image_file").click();
  });

  /*
   * Event Handlers : 이미지 앨범
   */

  // 이미지 추가 팝업 열기
  $compFrame.find(".comp_edit_image_nocont_btm").click(function() {
    $popupAddImageAlbum.bPopup({
      modalClose: false,
      position: ["50%", "auto"],
      onOpen: function() {
        if ($this.albumImages().length > 0) {
          $this.arrangeAlbumImages();
        }
        $this.hideAlert();
      },
      onClose: function() {
      }
    });
  });

  // 이미지 수정 팝업 열기
  $compFrame.find(".comp_edit_image_cont").click(function() {
    $popupAddImageAlbum.bPopup({
      modalClose: false,
      position: ["50%", "auto"],
      onOpen: function() {
        if ($this.albumImages().length > 0) {
          $this.arrangeAlbumImages();
        }
        $this.hideAlert();
      },
      onClose: function() {
      }
    });
  });


  // 이미지앨범 팝업 : 이미지 추가하기 버튼 Action
  $popupAddImageAlbum.find(".file_add_image_album").click(function() {
    if ($this.albumImages().length < $this.maxAlbumImages()) {
      $popupAddImageAlbum.find(".file_select_image_album").click();
    } else {
      alert("더 이상 이미지를 추가할 수 없습니다.");
    }
  });

  // 이미지 파일 업로드
  $popupAddImageAlbum.find(".file_select_image_album").fileupload({
    url: "/upload/image?max=1920&thumbMax=120&maxFileSize=" + $maxImageFileSize,
    dataType: "json",
    acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
    maxFilesize: $maxImageFileSize,
    add: function(e, data) {
      if ($this.albumImages().length >= $maxAlbumImages) return;
      var fileObj = data.files[0];
      if ("size" in fileObj && fileObj.size > $maxImageFileSize) {
        alert("파일 [" + fileObj.name + "]은 제한 크기(2MB)를 초과하여 업로드할 수 없습니다.");
        return;
      }
      var boxIndex = $this.addAlbumImageBox();
      data.submit()
        .success(function(result, textStatus, jqXHR) {
          if(result.success) {
            var uploadFile = result.uploadFile;
            var imageList = new Array();
            $($this.albumImages()).each(function(idx, val) {
              imageList.push(val[0] == boxIndex ? [uploadFile.id, uploadFile.fileUrl] : val);
            });
            //alert(imageList);
            $this.arrangeAlbumImages(imageList);
            //alert("image id : " + uploadFile.id + ", thumbnail id : " + uploadFile.resizedFileId);
          } else {
            alert(data.result.message || "파일 업로드를 실패하였습니다.");
          }
        })
        .error(function(jqXHR, textStatus, errorThrown) {
          alert("파일 업로드 중에 에러가 발생했습니다.");
        });
    },
    fail: function() { alert("파일 업로드를 실패하였습니다."); }
  });

  // 이미지 삭제 버튼 Action
  $popupAddImageAlbum.find(".btn_remove").click(function() {
    $this.removeAlbumImage(fileId);
  });

  // 앨범 제목 입력시 길이 표시 및 적용 버튼 enable/disable
  $popupAddImageAlbum.find(".album_title").keyup(function() {
    $popupAddImageAlbum.find(".album_title_length").text($(this).val().length);
    $this.checkAlbumAppliable();
  });

  // 이미지 추가 팝업 닫기
  $popupAddImageAlbum.find(".cancel_add_image_album").click(function() {
    $popupAddImageAlbum.bPopup().close();
  });

  // 이미지 앨범 적용
  $popupAddImageAlbum.find(".apply_add_image_album").click(function() {
    if ($.trim($popupAddImageAlbum.find(".album_title").val()).length <= 0) {
      alert("앨범 제목을 입력해 주세요");
      $popupAddImageAlbum.find(".album_title").focus();
    } else if ($this.albumImages().length <= 0) {
      alert("등록된 이미지가 없습니다.");
      return;
    } else {
      $popupAddImageAlbum.bPopup().close();
      $this.applyAlbumImage();
    }
  });

  // 앨점 이미지 리스트에 sortable 적용
  $popupAddImageAlbum.find("#albumImageList").sortable({
    update: function(e, ui) {
      $this.arrangeAlbumImages();
    }
  });
  $popupAddImageAlbum.find("#albumImageList").disableSelection();

  /*
   * Event Handlers : 쿠폰형
   */
  // 쿠폰 이름 추가하기
  $compFrame.find(".comp_edit_coupon_caption_nocont").click(function() {
    $compFrame.find(".comp_edit_coupon_caption_nocont").ibizaHide();
    $compFrame.find(".comp_edit_coupon_caption_cont").ibizaShow();
    $compFrame.find(".comp_edit_coupon_caption").focus();
    $this.hideAlert();
  });

  $compFrame.find(".comp_edit_coupon_caption_cont").click(function() {
    $this.hideAlert();
  });

  // 쿠폰 이름 영역 focus : 스타일 변경
  $compFrame.find(".comp_edit_coupon_caption").focus(function() {
    $compFrame.find(".comp_edit_coupon_caption").css("color", "#fff");
    $compFrame.find(".comp_edit_coupon_caption").css("background", "#393939");
  });

  // 쿠폰 이름 영역 focus out 될 때 : 입력 사항이 없는 경우 입력 안내 문구 노출, 스타일 변경
  $compFrame.find(".comp_edit_coupon_caption").blur(function() {
    if ($this.couponCaption().length <= 0) {
      $compFrame.find(".comp_edit_coupon_caption_cont").ibizaHide();
      $compFrame.find(".comp_edit_coupon_caption_nocont").ibizaShow();
    } else {
      $compFrame.find(".comp_edit_coupon_caption").css("color", "#444");
      $compFrame.find(".comp_edit_coupon_caption").css("background", "transparent");
    }
  });

  // 쿠폰 이름 입력시 100자를 넘으면 입력 불가 상태로 만들기
  $compFrame.find(".comp_edit_coupon_caption").keydown(function(e) {
    $compFrame.find(".comp_edit_coupon_caption_len").text($this.couponCaption().length);
    if ($this.couponCaption().length >= $maxCouponCaptionLength && $.inArray(e.which, [8, 16, 17, 18, 27, 37, 38, 39, 40, 46]) < 0) {
      e.preventDefault();
    }
    if (e.keyCode === 13) {
      document.execCommand("insertHTML", false, "<br><br>");
      return false;
    }

  });

  // 쿠폰 이름 입력시 길이 보여주기
  $compFrame.find(".comp_edit_coupon_caption").keyup(function(e) {
    $compFrame.find(".comp_edit_coupon_caption_len").text($this.couponCaption().length);
  });

  // 쿠폰 이름 영역에 Copy & Paste
  $compFrame.find(".comp_edit_coupon_caption").on("paste", function(e) {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  });

  // 쿠폰 이미지 추가하기
  $compFrame.find(".comp_edit_coupon_image_nocont").click(function() {
    $("#couponImageFile").click();
    $this.hideAlert();
  });

  $compFrame.find(".comp_edit_coupon_image_cont").click(function() {
    $("#couponImageFile").click();
    $this.hideAlert();
  });

  // 쿠폰 미리보기
  $messageForm.find(".coupon_preview").click(function() {
    $this.couponPreviewMode();
  });

  $compFrame.find(".comp_coupon_preview_close").click(function() {
    if ($this.isPreviewOnly) {
      $this.previewMode();
    } else {
      $this.editMode();
    }
  });

  // 미리보기에서 쿠폰 이름 클릭
  $compFrame.find(".comp_coupon_caption_result").click(function() {
    $this.couponPreviewMode();
  });

}
