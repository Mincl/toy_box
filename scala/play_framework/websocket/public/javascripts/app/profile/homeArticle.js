$(function() {
  var $articles = $('#articles');
  var $articleMessage = $('#articleMessage');
  var $articleImage = $('#articleImage');
  var $articleImageFileId = $('#articleImageFileId');
  var $articleTemplate = $('#articleTemplate');
  var $deleteImage = $('#deleteImage');
  var $addBtn = $('#addArticle');
  var $newArticleImgWrap = $('#newArticle .pfc_img');

  var minArticleId = null;
  var runFlag = false;

  $('div.pf_date').each(function() { $(this).html(toImageFont(this.innerHTML)); });

  getMoreArticle();

  var $window = $(window);
  var FIX_HEIGHT = 100;
  $window.scroll(function() {
    var bottom = $window.scrollTop() + $window.height();
    if(FIX_HEIGHT + $articles.height() <= bottom) {
      getMoreArticle();
    }
  });

  function getMoreArticle() {
    if(runFlag) return;

    var params = {limit: 15};
    if(minArticleId) params.lastId = minArticleId;
    $.ajax("/json/profile/articles", {
      data: params,
      success: function(data) {
        if(data.articles.length > 0) $('#openCheckList').hide();

        for(var i = 0; i < data.articles.length; i++) addArticle(data.articles[i]);

        if(data.articles.length < params.limit) $window.unbind('scroll');

        resizeBgWrap();
      },
      'beforeSend': function() { runFlag = true; },
      'complete': function() { runFlag = false; }
    });
  }

  $deleteImage.click(function() {
    $newArticleImgWrap.hide();
    $articleImageFileId.val('');
    $articleImage.hide();
    toggleAddArticleBtn();
  });

  $addBtn.click(function() {
    saveArticle($articleMessage.val(), $articleImageFileId.val());

    $articleMessage.val('');
    $articleMessageLength.text(0);
    $articleImageFileId.val('');
    $articleImage.hide();
    $newArticleImgWrap.hide();

    toggleAddArticleBtn();
  });

  toggleAddArticleBtn();
  function toggleAddArticleBtn() {
    if($articleMessage.val().length == 0 && $articleImageFileId.val().length == 0) {
      $addBtn.prop('disabled', true)
    } else {
      $addBtn.prop('disabled', false)
    }
  }

  function saveArticle(message, imageFileId, id) {
    var data = { message : message };
    if(imageFileId) data.imageFileId = imageFileId;
    if(id) data.id = id;

    $.ajax('/json/profile/articles', {
      'type': 'POST',
      'contentType' : "application/json; charset=UTF-8",
      'data': JSON.stringify(data),
      'success': function(data) {
        if(data.code == '0000') {
          if(!id) addArticle(data.article, true);
        } else {
          richAlert(data.message || "시스템 에러가 발생하였습니다. 잠시 후 다시시도해 주세요.");
        }
      },
      'beforeSend': showLoading,
      'complete': hideLoading
    });
  }

  $('#imageUpload').fileupload({
    acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
    done: function (e, data) {
      if(data.result.success) {
        var uploadFile = data.result.uploadFile;
        $articleImage.attr("src", uploadFile.fileUrl).show();
        $articleImageFileId.val(uploadFile.id);
        $newArticleImgWrap.show();
        toggleAddArticleBtn();
      } else {
        richAlert(data.result.message || "파일 업로드를 실패하였습니다.");
      }
    },
    fail: function() { richAlert("파일 업로드를 실패하였습니다."); }
  });

  var $articleMessageLength = $('#articleMessageLength');
  $articleMessage.keyup(function() {
    $articleMessageLength.text($articleMessage.val().length);
    toggleAddArticleBtn();
  });

  function addArticle(article, isPrepend) {
    $('#emptyArticle').hide();

    var createdAt = new Date(article.createdAt);
    var now = new Date();
    article.articleId = article.id; // 이미지 slide[lightbox]를 위한 ID
    article.createDay = createdAt.format('m.d');
    article.createTime = now.getYear() == createdAt.getYear() ? createdAt.format('m월 d일 a h시 i분') : createdAt.format('Y년 m월 d일 a h시 i분');
    article.attachment = article.attachment || {};
    article.imageCount = article.attachment.images ?  article.attachment.images.length : 0;

    var imgs = article.attachment.images;
    if(article.imageCount == 1) {
      imgs[0].style = 'width:547px; max-height: 363px;';

    } else if (article.imageCount > 1) {
      if(article.imageCount == 2 || article.imageCount == 4) {
        for(var i = 0; i < imgs.length; i++) {
          imgs[i].style='width: 270px; height: 270px;';
        }

      } else {
        for(var j = 0; j < imgs.length; j++) {
          var img = imgs[j];
          switch(j) {
            case 0: img.style='width: 363px; height: 363px;'; break;
            case 1: case 2: case 3: img.style='width: 181px; height: 180px;'; break;
            case 4: img.style='width: 363px; height: 180px;'; break;
            default: img.style='display:none;'; break;
          }
        }
      }
    }

    var $article = $articleTemplate.tmpl(article);
    if(isPrepend) {
      $('#emptyArticle').after($article);
    } else {
      $articles.append($article);
    }

    $article.find('div.pf_date').each(function() { $(this).html(toImageFont(this.innerHTML)); });

    $article.find('.pfc_img_more').click(function() {
      $($article.find('.pfc_imglist .img_w a')[4]).click();
    });

    $article.find('.statCount.point').each(function() {
      var $this = $(this);
      $this.text(addCommas($this.text()));
    });

    if(article.imageCount == 1) {
      $article.find('img.articleImage').load(function() {
        $(this).cropImage();
      });

    } else {
      $article.find('img.articleImage').load(function () {
        $(this).cropImage(true);
      });
    }

    var $msgLength = $article.find('.articleMessageLength');
    $article.find('textarea').keyup(function() {
      $msgLength.text($(this).val().length);
    });

    $article.find('.btn_opt').click(function() {
      var $selGroup = $(this).parent();
      var isOn = $selGroup.hasClass('on');
      $articles.find('.sel_group').removeClass('on');

      isOn ? $selGroup.removeClass('on') : $selGroup.addClass('on');
    });

    $article.find('.update').click(function() {
      $article.addClass('pf_modify');
      $article.find('.pfc_imglist .img_w').attr('style', 'width:522px;');
      $article.find('.pfc_imglist .img_w a').attr('style', 'width:522px;');

      var imageFileId = $article.find('input[name="imageFileId"]').val();
      if(imageFileId) $article.find('.deleteImage').show();
      $article.find('.sel_group').toggleClass('on');
    });

    $article.find('.saveArticle').click(function() {
      var message = $article.find('textarea').val();
      var imageFileId = $article.find('input[name="imageFileId"]').val();
      saveArticle(message, imageFileId, article.id);
      var $imgWrap = $article.find('.pfc_imglist .img_w');
      $imgWrap.attr('style', 'width:547px; max-height: 363px;');
      $imgWrap.find('a').attr('style', 'width:547px; max-height: 363px;');
      $imgWrap.find('img').on('load', function() {
        $this.cropImage();
      });

      $article.find('div.message').html('<div class="pre">'+ message+'</div>');
      $article.removeClass('pf_modify');
    });

    var originImageFileId = null;
    $article.find('.deleteImage').click(deleteImage);
    function deleteImage() {
      var $imgFileIdInput = $article.find('input[name="imageFileId"]');
      originImageFileId = $imgFileIdInput.val();
      $imgFileIdInput.val('');
      $article.find('ul.pfc_imglist li, .deleteImage').hide();
    }

    $article.find('.cancel').click(function() {
      $article.removeClass('pf_modify');
      $article.find('ul.pfc_imglist li').show();
      $article.find('.deleteImage').hide();
      if(originImageFileId) {
        $article.find('input[name="imageFileId"]').val(originImageFileId);
      }
    });

    $article.find('#imageUpload-' + article.id).fileupload({
      acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
      done: function (e, data) {
        if(data.result.success) {
          var uploadFile = data.result.uploadFile;
          setTimeout(function() {
            $article.find('ul.pfc_imglist li,a.deleteImage').remove();
            var $img = $('<li><span class="img_w" style="width:522px;"><a href="'+uploadFile.fileUrl+'" data-lightbox="photo-'+article.id+'" style="width:522px;"><img class="articleImage" src="'+uploadFile.fileUrl+'"><span class="bor">&nbsp;</span></a><span class="img_mask"></span></span></li>');
            var $deleteImgBtn = $('<a class="deleteImage sp btn_close">이미지 삭제</a>').click(deleteImage);
            $article.find('ul.pfc_imglist').append($img).append($deleteImgBtn);
            $article.find('input[name="imageFileId"]').val(uploadFile.id);
          }, 1500);


        } else {
          richAlert(data.result.message || "파일 업로드를 실패하였습니다.");
        }
      },
      fail: function() { richAlert("파일 업로드를 실패하였습니다."); }
    });

    $article.find('.delete').click(function() {
      richConfirm({
        'question' : '해당 게시물을 삭제하시겠습니까?',
        ok : function() {
          $.ajax('/json/profile/articles/'+article.id+'/delete', {
            type: 'post',
            success: function(data) {
              if(data.code == '0000') {
                $article.remove();

                if($articles.find('.pf_article').length == 1) {
                  $('#emptyArticle').show();
                }
              } else {
                richAlert(data.message || "시스템 에러가 발생하였습니다. 잠시 후 다시시도해 주세요.");
              }
            },
            'beforeSend': showLoading,
            'complete': hideLoading
          });
        }
      });
    });

    minArticleId = minArticleId ? Math.min(minArticleId, article.id) : article.id;
  }
});