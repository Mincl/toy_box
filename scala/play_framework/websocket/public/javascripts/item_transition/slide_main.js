(function() {
	var support = { animations : Modernizr.cssanimations },
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		component = document.getElementById( 'component' ),
		items = component.querySelector( 'ul.itemwrap' ).children,
		current = 0,
		itemsCount = items.length,
		//nav = component.querySelector( 'nav' ),
		isAnimating = false;

	function init() {
    $(".slide_prev").click(function(e) {
      e.preventDefault(); navigate("prev");
      $(".bn_selected").removeClass("bn_selected");
      $(".slide_page" + (current + 1)).addClass("bn_selected");
    });
    $(".slide_next").click(function(e) {
      e.preventDefault(); navigate("next");
      $(".bn_selected").removeClass("bn_selected");
      $(".slide_page" + (current + 1)).addClass("bn_selected");
    });
    $(".slide_page1").click(function(e) {
      e.preventDefault();
      if (current == 1) navigate("prev");
      if (current == 2) navigate("next");
      $(".bn_selected").removeClass("bn_selected");
      $(this).addClass("bn_selected");
    });
    $(".slide_page2").click(function(e) {
      e.preventDefault();
      if (current == 2) navigate("prev");
      if (current == 0) navigate("next");
      $(".bn_selected").removeClass("bn_selected");
      $(this).addClass("bn_selected");
    });
    $(".slide_page3").click(function(e) {
      e.preventDefault();
      if (current == 0) navigate("prev");
      if (current == 1) navigate("next");
      $(".bn_selected").removeClass("bn_selected");
      $(this).addClass("bn_selected");
    });
	}

	function navigate(dir) {
		if (isAnimating) return false;
		isAnimating = true;
		var cntAnims = 0;

		var currentItem = items[ current ];

		if( dir === 'next' ) {
			current = current < itemsCount - 1 ? current + 1 : 0;
		}
		else if( dir === 'prev' ) {
			current = current > 0 ? current - 1 : itemsCount - 1;
		}

		var nextItem = items[ current ];

		var onEndAnimationCurrentItem = function() {
			this.removeEventListener( animEndEventName, onEndAnimationCurrentItem );
			classie.removeClass( this, 'current' );
			classie.removeClass( this, dir === 'next' ? 'navOutNext' : 'navOutPrev' );
			++cntAnims;
			if( cntAnims === 2 ) {
				isAnimating = false;
			}
		}

		var onEndAnimationNextItem = function() {
			this.removeEventListener( animEndEventName, onEndAnimationNextItem );
			classie.addClass( this, 'current' );
			classie.removeClass( this, dir === 'next' ? 'navInNext' : 'navInPrev' );
			++cntAnims;
			if( cntAnims === 2 ) {
				isAnimating = false;
			}
		}

		if( support.animations ) {
			currentItem.addEventListener( animEndEventName, onEndAnimationCurrentItem );
			nextItem.addEventListener( animEndEventName, onEndAnimationNextItem );
		}
		else {
			onEndAnimationCurrentItem();
			onEndAnimationNextItem();
		}

		classie.addClass( currentItem, dir === 'next' ? 'navOutNext' : 'navOutPrev' );
		classie.addClass( nextItem, dir === 'next' ? 'navInNext' : 'navInPrev' );
	}

	init();
})();