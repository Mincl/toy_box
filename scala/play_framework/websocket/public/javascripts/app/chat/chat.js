var ERROR_CODE_UNAUTHENTICATED = "2001";

$(function() {
  var guideMsg = '[일대일 대화기능 사용안내]\n' +
      '- 설정 버튼 클릭 시, 대화기능 ON/OFF 및 대화가능시간을 설정할 수 있습니다.\n' +
      '- 접속한 관리자가 여러명일 경우 대화내역이 동일한 내용으로 업데이트 됩니다.\n' +
      '- 대화방 숨김 기능을 통해 대화목록을 숨길 수 있습니다.\n' +
      '- 친구차단 기능을 통해 일대일 대화 사용자를 차단할 수 있습니다.\n' +
      '- 일대일 대화 사용자가 친구차단을 했을 경우, 대화는 더 이상 불가능합니다.\n' +
      '- 관리자앱(안드로이드)을 통해 모바일에서도 대화가 가능합니다.\n';

  $('.talk_info').attr('title', guideMsg);
  // 상담 채팅 layout 예외 처리용...
  $('div.bg_wrap').addClass('full_height');
  $('#footer').addClass('v2').hide();

  function goLogin() { window.location = "/login"; }

  var ChatLogInterval = 3000;

  var $chatRooms = $('#chatRooms');
  var $chatRoomTemplate = $('#chatRoomTemplate');
  var $chatLogs = $('#chatLogs');
  var $msgInput = $('#messageInput');
  var $chatProfile = $('#chatProfile');
  var $chatProfileTemplate = $('#chatProfileTemplate');
  var $recvChatLogTemplate = $('#recvChatLogTemplate');
  var $sendChatLogTemplate = $('#sendChatLogTemplate');
  var $search = $('#search');
  var $emptyChatRoom = $('#emptyChatRoom');

  var _chats = {};
  var _chatLogIds = {};
  var _unseenChats = [];
  var _lastSeenLogId = 0;
  var _chatLogIntervalId = null;
  var _firstDate = null;
  var _lastDate = null;
  var _totalUnseen = 0;
  var _minLastLogId = null;
  var _isNoMoreChatRoom = false;

  // javascript에서 Long 값에 대한 정밀도 문제 때문에 문자열로 처리함!!!
  var _chatId = '0';
  var _hiddenChatFlag = false;

  var $window = $(window).resize(resizeChatUI);
  resizeChatUI();
  function resizeChatUI() {
    var chatRoomsHeight = $window.height() - 346 + 'px';
    var chatLogsHeight = $window.height() - 253 + 'px';
    $chatRooms.css({'height': chatRoomsHeight});
    $chatLogs.css({'height': chatLogsHeight});
  }

  // Referece: http://areaaperta.com/nicescroll/index.html
  $chatLogs.niceScroll({'horizrailenabled': false, 'cursorcolor': '#aaaaa'});
  $chatRooms
      .niceScroll({'horizrailenabled': false, 'cursorcolor': '#aaaaa'})
      .scrollend(function() {
        var chatSize = $chatRooms.find('li.chatRoom').length;
        var bottom = $chatRooms.scrollTop() + $chatRooms.height();
        if(chatSize * 101 <= bottom) {
          getMoreChatRooms();
        }
      });

  $msgInput.keypress(function(e) {
    if(e.keyCode == 13 && !e.shiftKey) {
      var msg = $msgInput.val().trim();
      if(msg.length > 0) {
        sendMessage(msg);
        $msgInput.val('');
      }
    }
  });

  var canConsult = $('.info_on').length > 0;
  if(!canConsult) {
    $('#imageUpload').click(function() {
      richAlert("대화기능이 off 상태입니다.<br/>on상태로 변경한 후, 다시 시도해 주세요.");
      return false;
    });
  } else {
    $('#imageUpload').fileupload({
      url: '/json/chats/uploadImage',
      acceptFileTypes: /(\.|\/)(jpe?g)$/i,
      maxFilesize: 10485760,
      done: function (e, data) {
        var result = data.result;
        if(result.code == "0000") {
          sendMessage(null, {
            "attachment_path": result.data.path,
            "attachment_type": "image",
            "attachment_width": result.data.width,
            "attachment_height": result.data.height
          });

        } else {
          richAlert(result.message || "시스템 에러가 발생하였습니다.");
        }
      },
      submit: function(e, data) { showLoading(); },
      always: function(e, data) { hideLoading(); }
    });
  }

  $search.on('input', function() {
    var value = $search.val().trim();
    if(value.length > 0) {
      $chatRooms.children('.chatRoom').each(function(idx, elem) {
        var $elem = $(elem);
        var chatName = $elem.attr('data-chatName');
        if(chatName.indexOf(value) > -1) {
          $elem.show();
        } else {
          $elem.hide();
        }
      });
    } else {
      $chatRooms.find(".chatRoom").show();
    }
  });

  getMoreChatRooms();
  setInterval(getUnseenChats, 5000);

  var isRunMoreChat = false;  // 중복 처리 방지
  function getMoreChatRooms() {
    var MAX_MORE_CHAT_COUNT = 100;

    if(_isNoMoreChatRoom || isRunMoreChat) return;

    var queryParams = {'isHidden' : _hiddenChatFlag, 'limit': MAX_MORE_CHAT_COUNT };
    if(_minLastLogId) queryParams['from'] = _minLastLogId;

    $.ajax("/json/chats", {
      data: queryParams,
      success : function(data) {
        if(data.code != "0000") {
          var callback = (data.code == ERROR_CODE_UNAUTHENTICATED) ? goLogin : null;
          richAlert(data.message || "시스템 에러가 발생하였습니다.", callback);
          return;
        }

        var chats = data.chats;
        var chatCount = chats.length;
        if(chatCount > 0) {
          for(var i = 0; i < chatCount; i++) {
            addChatRoom(chats[i]);
            _totalUnseen += chats[i].unreadCount;
          }

          $chatRooms.getNiceScroll().resize();

          updateChatRoomsHeader();
        }

        toggleEmptyChatRoom();

        _isNoMoreChatRoom = (chats.size < MAX_MORE_CHAT_COUNT);

        if(_chats[_chatId] == undefined) chatRoomActivate(false);
      },
      'beforeSend': function() { isRunMoreChat = true; },
      'complete': function() { isRunMoreChat = false; }
    });
  }

  function getUnseenChats() {
    $.getJSON("/json/chats/unseen", { isHidden : _hiddenChatFlag }, function(data) {
      if(data.code != "0000") {
        var callback = (data.code == ERROR_CODE_UNAUTHENTICATED) ? goLogin : null;
        richAlert(data.message || "시스템 에러가 발생하였습니다.", callback);
        return;
      }

      if(_chats.length == 0)
        $('#chatRooms').html('');

      var unseenChatIdx = {};
      var newUnseenChats = [];
      for(var i = (data.chats.length - 1); i >= 0; i--) {
        var chat = data.chats[i];
        unseenChatIdx[chat.id] = "";
        newUnseenChats.push(chat.id);
        if(_chats[chat.id]) {
          if(_chatId && _chatId != chat.id) {
            updateUnreadCount(chat.id, chat.unreadCount, chat.lastMessage);
          }
          moveTopChatroom(chat.id);

        } else {
          addChatRoom(chat, true);
        }
      }

      // remove unread count
      for(var j = 0; j < _unseenChats.length; j++) {
        var chatId = _unseenChats[j];
        if(unseenChatIdx[chatId] == undefined) {
          updateUnreadCount(chatId, 0);
        }
      }
      _unseenChats = newUnseenChats;

      updateChatRoomsHeader();
    });
  }

  function moveTopChatroom(chatId) {
    $chatRooms.prepend($('#'+chatId).detach());
  }

  function addChatRoom(chat, isUnseenChat) {

    var searchVal = $search.val().trim();
    var nickName = chat.member ? chat.member.nickName : 'Unknown';
    var isShow = (searchVal.length == 0 || nickName.indexOf(searchVal) > -1);
    var chatData = {
      'chatId': chat.id,
      'nickName': nickName,
      'isBlocked': chat.isBlocked,
      'unreadCount': chat.unreadCount,
      'updatedAt': getChatDateString(chat.updatedAt),
      'lastMessage': chat.lastMessage,
      'hide_class' : isShow ? '' : 'hidden'
    };

    if(chat.member && chat.member.profileImageUrl) {
      chatData['profileImageUrl'] = chat.member.profileImageUrl;
    } else {
      chatData['profileImageUrl'] = '/assets/img/profile_noimg.png';
    }

    if(_minLastLogId == null || _minLastLogId > chat.lastLogId) {
      _minLastLogId = chat.lastLogId;
    }

    var $chatRoom = $chatRoomTemplate.tmpl(chatData);
    if(isUnseenChat)
      $chatRooms.prepend($chatRoom);
    else
      $chatRooms.append($chatRoom);

    $chatRoom.click(function () {
      if(_chatLogIntervalId) {
        clearInterval(_chatLogIntervalId);
        _chatLogIntervalId = null;
      }

      $chatRooms.children().removeClass('selected');
      $chatRoom.addClass('selected');

      chatRoomActivate(true);

      _chatId = $(this).attr('id');
      _chatLogIds = {};
      _lastSeenLogId = chat.lastSeenLogId;
      _firstDate = null;
      _lastDate = null;
      updateUnreadCount(_chatId, 0);
      getMessage(0);

      // 친구 관계에 따른 이미지 업로드 버튼 동작 변경 [JIRA Issue: MINI-642]
      $.getJSON('/json/chats/check/friendship/' + _chatId, function (result) {
        if(result.isFriend) {
          $('#imageUploadBtn').unbind('click');
        } else {
          $('#imageUploadBtn').unbind('click').click(function(e) {
            e.preventDefault();
            richAlert('사용자가 해당 옐로아이디를 차단하여<br/>더 이상 대화를 진행할 수 없습니다.');
            return false;
          });
        }
      });

      var profile = null;
      if(chat.member.profileImageUrl) {
        profile = $chatProfileTemplate.tmpl({
          'profileImageUrl': chat.member.profileImageUrl,
          'nickName': chat.member.nickName
        });
      } else {
        profile = $chatProfileTemplate.tmpl({
          'profileImageUrl': '/assets/img/profile_noimg.png',
          'nickName': chat.member.nickName
        });
      }
      $chatProfile.html(profile);

      _chatLogIntervalId = setInterval(function() {
        getMessage();
      }, ChatLogInterval);
    });

    var $menu = $chatRoom.find('div.sel_group');
    $menu.click(function() {
      var isOn = $menu.hasClass('on');
      $chatRooms.find('div.sel_group').removeClass('on');

      var $selWrap = $menu.find('div.sel_wrap');
      if($window.height() > $menu.offset().top + 110) {
        $selWrap.css({'top': '21px'});
      } else {
        $selWrap.css({'top': '-98px'});
      }

      if(isOn) {
        $menu.removeClass('on');
      } else {
        $menu.addClass('on');
        $('#chatTypeSelectMenu').hide();
      }
      return false;
    });

    $menu.find('li.leaveChatRoom').click(function() { leaveChatRoom(chat.id); });
    $menu.find('li.updateBlockFlag').click(function() { updateChatBlockFlag(chat.id, !chat.isBlocked); });
    $menu.find('li.blockFriend').click(function() { blockFriend(chat.member.userId); });

    _chats[chat.id] = chat;
    if(chat.unreadCount > 0) _unseenChats.push(chat.id);
    return $chatRoom;
  }

  function updateUnreadCount(chatId, unreadCount, lastMessage) {
    var chat = _chats[chatId];
    var oldUnreadCount = chat.unreadCount;
    if(oldUnreadCount != unreadCount) {
      chat.unreadCount = unreadCount;
      var $unreadCount = $("#"+chatId).find(".unreadCount");
      if(unreadCount == 0) {
        $unreadCount.hide();
      } else {
        $unreadCount.show();
        var unreadText = unreadCount > 99 ? "99+" : unreadCount;
        $unreadCount.text(unreadText);
        $("#"+chatId).find(".lastMessage").text(lastMessage);
        chat.lastMessage = lastMessage;
      }

      // 좌측 "일대일 상담" 메뉴의 unread count badge 변경!!!
      _totalUnseen = _totalUnseen + unreadCount - oldUnreadCount;
      if(_totalUnseen > 0) {
        var count = _totalUnseen > 99 ? '99+' : _totalUnseen;
        $('#unreadCount4Menu').show().text(count);
      } else {
        $('#unreadCount4Menu').hide();
      }
    }
  }

  function getMessage(since) {
    var chat = _chats[_chatId];
    if(since == undefined) since = chat.lastLogId;
    $.getJSON("/json/chats/"+ chat.id +"/chatlogs/" + since, function(data) {
      if(data.code != "0000") {
        var callback = (data.code == ERROR_CODE_UNAUTHENTICATED) ? goLogin : null;
        richAlert(data.message || "시스템 에러가 발생하였습니다.", callback);
        return;
      }

      chat.lastLogId = data.chat.lastLogId;

      if(data.chatLogs.length > 0) {
        addChatBalloon(chat, data.chatLogs);
      }

      chat.unreadCount = 0;
      chat.lastSeenLogId = data.chat.lastSeenLogId;
    });
  }

  function sendMessage(msg, attach) {
    var chat = _chats[_chatId];
    var data = attach || {};
    if(msg) data.message = msg;

    $.ajax({
      url: "/json/chats/" + chat.id + "/write?since=" + chat.lastLogId,
      type: "POST",
      "data" : data,
      "success": function(data) {
        if(data.code === "0000") {
          var serverChat = data.chat;
          chat.unreadCount = 0;
          chat.lastLogId = serverChat.lastLogId;
          chat.lastSeenLogId = serverChat.lastSeenLogId;

          //moveTopChatroom(chat.id);
          addChatBalloon(chat, data.chatLogs);
        } else {
          richAlert(data.message || "시스템 에러로 메시지 전송을 실패하였습니다.");
        }
      }
    });
  }

  function addChatBalloon(chat, chatLogs) {
    var member = chat.member;
    var lastMessage = null;
    var lastDate = null;
    $.each(chatLogs, function(index, chatLog) {
      if(_chatLogIds[chatLog.id] == undefined) {
        _chatLogIds[chatLog.id] = chatLog.id;

        var createdAt = new Date(chatLog.createdAt);
        if(!_firstDate) {
          _firstDate = createdAt.format("Y-m-d");
          addCommentBar(getDateString(createdAt));
        }
        if(_lastDate && _lastDate != createdAt.getDate()) {
          addCommentBar(getDateString(createdAt));
        }
        _lastDate = createdAt.getDate();
        lastDate = createdAt;

        var chatData = {
          'message': chatLog.message,
          'profileImageUrl': chat.member.profileImageUrl || "/assets/img/profile_noimg.png",
          'createdTime' : new Date(chatLog.createdAt).format("H:i")
        };

        if(chatLog.attachment && chatLog.attachment.type == "photo") {
          chatData.imageUrl =  chatLog.attachment.url;
        } else if(chatLog.attachment && chatLog.attachment.type != null) {
          console.dir(chatLog);
          chatData.message = '지원되지 않는 타입의 메세지입니다.';
        }

        if (chatLog.authorId == member.userId)  {
          $recvChatLogTemplate.tmpl(chatData).appendTo($chatLogs);

        } else {
          $sendChatLogTemplate.tmpl(chatData).appendTo($chatLogs);

          var lastChatBalloonWidth = $('#chatLogs div:last-child .chat_balloon').width();
          var lastChatTime = $('#chatLogs div:last-child .chat_time');
          lastChatTime.css('right',lastChatBalloonWidth);
        }
        lastMessage = chatLog.message;

        if(chat.lastLogId != _lastSeenLogId && _lastSeenLogId == chatLog.id) {
          addCommentBar("여기까지 읽었습니다.");
        }
      }
    });

    $("#"+chat.id).find(".lastMessage").text(lastMessage);
    if(lastDate) {
      $("#"+chat.id).find(".updatedAt").text(getChatDateString(lastDate));
    }

    if(_lastDate) { // Scrolling to bottom
      $chatLogs.getNiceScroll().resize();
      rescrollChatLog();
    }
  }

  function addCommentBar(msg) {
    $('<div class="line"><p class="hr_talk"><span>' + msg + '</span></p></div>').appendTo($chatLogs);
  }

  var $chatRoomCount = $('#chatRoomCount');
  var $chatRoomCountForMenu = $('#chatRoomCountForMenu');
  var $chatRoomComment = $('#chatRoomComment');
  var $chatTypeName = $('#chatTypeName');
  function updateChatRoomsHeader() {
    var chatCount = $chatRooms.children('li').length - 1;  // 챗목록이 없을 때 보여지는 가이드 문구 element를 뺀다.
    $chatRoomCount.text(chatCount);
    if(!_hiddenChatFlag) $chatRoomCountForMenu.text(chatCount);
    $chatRoomComment.text(_hiddenChatFlag ? '명을 숨김처리' : '명과 대화중')
  }

  function getDateString(date) {
    var dayOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return date.getFullYear() + '년 ' + (date.getMonth()+1) + '월 ' + date.getDate() + '일 ' + dayOfWeek[date.getDay()];
  }

  function getChatDateString(date) {
    var updatedAt = new Date(date);
    if(updatedAt.format("y-m-d") === new Date().format("y-m-d")) {
      updatedAt = updatedAt.format("H:i");
    } else {
      updatedAt = updatedAt.getFullYear() + updatedAt.format(". m. d");
    }
    return updatedAt;
  }

  function rescrollChatLog() {
    var totalBalloonHeight = 0;
    $chatLogs.children().each(function() {
      totalBalloonHeight += $(this).outerHeight(true);
    });
    $chatLogs.animate({ scrollTop: totalBalloonHeight }, "height");
  }

  function chatRoomActivate(isActive) {
    if(isActive) {
      $('#chatProfile').show();
      $('#chatRoomFooter').show();
      $('#chatRoom').css({'background-color': '#b3c9d7'});
      $chatLogs.html('');

    } else {
      $('#chatProfile').hide();
      $('#chatRoomFooter').hide();
      $('#chatRoom').css({'background-color': '#f0f0f0'});
      $chatLogs.html('<div class="conv none"><p><span class="sp2 s_none"></span><strong>선택된 대화목록이 없습니다</strong></p><p>대화상대를 선택해주세요.</p></div>');
      clearInterval(_chatLogIntervalId);
    }
  }

  // Dropdown Hover Event
  $('.setting_dropdown_item').hover(
      function() { // hover in
        $(this).css({'background-color':'#e1e1e1'});
      }, function() { // hover out
        $(this).css({'background-color':''});
      }
  );

  function leaveChatRoom(chatId) {
    richConfirm({
      question: '대화방을 나가시겠습니까?',
      comment: '해당 대화방을 나가시면, 대화방이 삭제되고<br/>모바일 관리자앱에서도 대화방이 사라집니다.<br/>단, 사용자가 대화요청을 할 경우 대화방은 복구됩니다.',
      ok : function() {
        $.ajax('/json/chats/' + chatId + '/leave', {
          'type': 'POST',
          success: function(data) {
            if(data.code === "0000") {
              $('#' + chatId).remove();
              _chats[chatId] = undefined;
              chatRoomActivate(false);
              toggleEmptyChatRoom();
            } else {
              var callback = (data.code == ERROR_CODE_UNAUTHENTICATED) ? goLogin : null;
              richAlert(data.message || "시스템 에러가 발생하였습니다.", callback);
            }
          },
          'beforeSend': showLoading,
          'complete': hideLoading
        });
      }
    });
  }

  var $hiddenChatCount = $('#hiddenChatCount');
  function updateChatBlockFlag(chatId, isHidden) {
    var chat = _chats[chatId];
    if(isHidden) {
      richConfirm({
        'question': '[' + chat.member.nickName + ']님과의 대화방을 숨기겠습니까?',
        'comment': '숨긴 대화방은 ‘숨김목록’에서 확인할 수 있으며<br/>숨김해제 시 대화목록으로 복구할 수 있습니다.',
        'ok': doUpdateChatBlockFlag
      });
    } else {
      doUpdateChatBlockFlag();
    }

    function doUpdateChatBlockFlag() {
      $.ajax('/json/chats/' + chatId + '/hide?isHidden=' + isHidden, {
        'type': 'POST',
        success: function(data) {
          if(data.code === "0000") {
            $('#' + chatId).remove();
            chatRoomActivate(false);
            removeChatRoom(chatId);
            if(isHidden) {
              $hiddenChatCount.text(parseInt($hiddenChatCount.text().trim()) + 1);
              $chatRoomCountForMenu.text(parseInt($chatRoomCountForMenu.text().trim()) - 1);
            } else {
              $hiddenChatCount.text(parseInt($hiddenChatCount.text().trim()) - 1);
              $chatRoomCountForMenu.text(parseInt($chatRoomCountForMenu.text().trim()) + 1);

              richAlert('<b>' + chat.member.nickName + '</b>님과의 대화방이 대화목록으로 복구되었습니다.')
            }

          } else {
            var callback = (data.code == ERROR_CODE_UNAUTHENTICATED) ? goLogin : null;
            richAlert(data.message || "시스템 에러가 발생하였습니다.", callback);
          }
        },
        'beforeSend': showLoading,
        'complete': hideLoading
      });
    }
  }

  function toggleEmptyChatRoom() {
    if($chatRooms.find('.chatRoom').length > 0) {
      $emptyChatRoom.hide();
    } else  {
      $emptyChatRoom.show();
    }
  }

  function removeChatRoom(chatId) {
    var chat = _chats[chatId];
    if(chat) {
      delete _chats[chatId];
      $('#' + chatId).remove();
    }
    toggleEmptyChatRoom();
  }

  function blockFriend(userId) {
    richConfirm({
      question: '친구 차단을 계속 하시겠습니까?',
      comment: "차단 시, '사용자의 요청에 의해 친구를 차단합니다'라는<br/>내용의 메시지가 전송되며 메시지 발신과 일대일 대화가 불가능합니다.",
      ok : function() {
        $.ajax('/json/chats/friends/block/' + userId, {
          'type': 'POST',
          success: function(data) {
            if(data.code == '0000') {
              richAlert("친구 차단이 완료되었습니다.");
            } else {
              richAlert(data.message || "시스템 에러가 발생하였습니다. 잠시 후 다시시도하여 주세요.");
            }
          },
          'beforeSend': showLoading,
          'complete': hideLoading
        });
      }
    });
  };

  // 대화목록 변경 [대화목록/숨김목록]
  $('#chatTypeSelectBtn').click(function() {
    $('#chatTypeSelectMenu').toggle();
    $chatRooms.find('div.sel_group').removeClass('on');
  });

  function refreshChatList() {
    $('#chatRooms li.chatRoom').remove();
    _minLastLogId = null;
    _isNoMoreChatRoom = false;
    getMoreChatRooms();
  }

  $('#showNormalChatBtn').click(function() {
    _hiddenChatFlag = false;
    $chatTypeName.removeClass('sp_h2');

    refreshChatList();
    $(this).find('span.sel_chkd').show();
    $('#showHideChatBtn>span.sel_chkd').hide();
    $('#chatTypeSelectMenu').toggle();
  });

  $('#showHideChatBtn').click(function() {
    _hiddenChatFlag = true;
    $chatTypeName.addClass('sp_h2');

    refreshChatList();
    $(this).find('span.sel_chkd').show();
    $('#showNormalChatBtn>span.sel_chkd').hide();
    $('#chatTypeSelectMenu').toggle();
  });
});