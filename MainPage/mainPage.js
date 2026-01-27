(function() {
  const LAST_VISIT = sessionStorage.getItem('pageLoaded');
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  // If visited recently, add hidden class immediately
  if (LAST_VISIT && (now - parseInt(LAST_VISIT)) <= fiveMinutes) {
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('loadingScreen').classList.add('hidden');
    });
  }
})();

$(document).ready(function(){
	const LAST_VISIT = sessionStorage.getItem('pageLoaded');
	const now = Date.now();
	const FIVE_MINUTES = 5 * 60 * 1000; 
	const ANIMATION_DURATION = 600;
	const SCROLL_SETTLE_DELAY = 350;
	const LOADING_TIMEOUT = 600;

	try {
    sessionStorage.setItem('pageLoaded', now.toString());
	} catch (e) {
	    console.warn('SessionStorage not available:', e);
	}

	$('#loadingScreen').show();
	if (!LAST_VISIT || (now - parseInt(LAST_VISIT)) > FIVE_MINUTES) {
    	$('#loadingScreen').show();
    	// Hide loading screen when everything is loaded
		$(window).on('load', function() {
			$('#loadingScreen').fadeOut(600, function() {
			$(this).remove();
			});
		});

		setTimeout(function() {
			$('#loadingScreen').fadeOut(600, function() {
		    $(this).remove();
			});
		}, 600);
		sessionStorage.setItem('pageLoaded', now.toString());
	} else {
		$('#loadingScreen').hide();
	}

	const topPositions = [
		'calc(0% + 0.5em - var(--pill-height)/2)',
    'calc(50% - var(--pill-height)/2)',
    'calc(100% - 0.5em - var(--pill-height)/2)'
	];
	chapterSelect(0, true);
	
	$("#chapterList li").on({
		click: function(){
			var index = $(this).index();

			chapterSelect(index, true);
		},
	});

	$("#myPicture").click(function(){
		alert("Hello!");
	});


	var isScrolling = false;
	var previousSelection;
	function chapterSelect(selectedChapterIndex, shouldScroll){
		currentChapterIndex = selectedChapterIndex;
		var selectedChapterTitle = $("#chapterList ul").children().eq(selectedChapterIndex).addClass("chapterSelected").get(0);
		if(selectedChapterTitle !== previousSelection){
			// Update selected class
			$(previousSelection).removeClass("chapterSelected");
			previousSelection = selectedChapterTitle;
		}
		

		$("#chapterPill").css("top", topPositions[selectedChapterIndex]);

		if(shouldScroll){
			$('html, body').stop(true, false);

			var selectedSection = $("#sideLayout").children().eq(selectedChapterIndex);
			var elementTop = selectedSection.offset().top;
			var elementHeight = selectedSection.outerHeight();
			var windowHeight = $(window).height();

			var scrollTo = elementTop - (windowHeight / 2) + (elementHeight / 2);

			isScrolling = true;
			// Smooth scroll to that position
			$('html, body').animate({
				scrollTop: scrollTo
			}, 600, function() {
		        isScrolling = false;
		    });
		}
	}

	var scrollTimer;
	$(window).on('scroll', function(){
		if (isScrolling) return; 
	
		const scrollPos = $(window).scrollTop();
		const windowHeight = $(window).height();	
		$("#sideLayout").children().each(function(index) {
	    	const sectionTop = $(this).offset().top;

	      	// Check if section is in viewport (using midpoint)
	      	if (scrollPos + windowHeight / 2 >= sectionTop) {
	        	chapterSelect(index, false)
	      	}
	    });

	    // Clear existing timer
	    clearTimeout(scrollTimer);
	    
	    // Set new timer to center after 1 second of no scrolling
	    scrollTimer = setTimeout(function() {
	      chapterSelect(currentChapterIndex, true);
	    }, 350);
	});


  const $experiences = $('#experiences');
  
  // Create blur overlay element
  const $blurOverlay = $('<div class="blur-overlay"></div>');
  $experiences.append($blurOverlay);
  
  $experiences.on('scroll', function() {
    const scrollTop = $(this).scrollTop();
    const scrollHeight = $(this)[0].scrollHeight;
    const clientHeight = $(this).height();
    const maxScroll = scrollHeight - clientHeight;
    
    // Calculate scroll percentage (0 at top, 1 at bottom)
    const scrollPercent = maxScroll > 0 ? scrollTop / maxScroll : 0;
    
    // Calculate opacity for top and bottom blurs (0 to 1)
    const topBlurOpacity = Math.min(scrollPercent * 2, 1);
    const bottomBlurOpacity = Math.max(1 - (scrollPercent * 2), 0);
    
    // Update the blur overlay mask
    const blurMask = `
      linear-gradient(
        to bottom,
        black ${topBlurOpacity * 15}%,
        transparent ${15 + (topBlurOpacity * 5)}%,
        transparent ${85 - (bottomBlurOpacity * 5)}%,
        black ${100 - (bottomBlurOpacity * 15)}%
      )
    `;
    
    $blurOverlay.css({
      'mask-image': blurMask,
      '-webkit-mask-image': blurMask
    });
    
    // Update box-shadow for the darkening effect
    const topShadow = `0 10vh 10vh -15vh rgba(0, 0, 0, ${topBlurOpacity * 0.5}) inset`;
    const bottomShadow = `0 -10vh 10vh -15vh rgba(0, 0, 0, ${bottomBlurOpacity * 0.5}) inset`;
    
    $(this).css('box-shadow', `${topShadow}, ${bottomShadow}`);
  });
  
  // Trigger initial state
  $experiences.trigger('scroll');
})