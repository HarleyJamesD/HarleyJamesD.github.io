$(document).ready(function(){
	$('#return').hide();

	$('#return').click(function() {
		// history.pushState(null, null, window.location.pathname);
		// history.replaceState(null, null, ' ');
		$('html').css('scroll-behavior', 'auto');
	  $('html, body').animate({ scrollTop: 0 }, 1000, function() {
	  	$('html').css('scroll-behavior', '');
	  });
	});

	$(window).scroll(function() {
		if($(window).scrollTop() > $(window).height()*0.9){
			$('#return').fadeIn(300);
		} else {
			$('#return').fadeOut(300);
		}
	});

	$('.ProjectTab').click(function(e) {
	  e.preventDefault();
	  var target = $(this).attr('href');
	  var targetElement = $(target);
	  
	  var scrollMargin = parseFloat(getComputedStyle(targetElement[0]).scrollMarginTop) || 0;
	  
	  // Temporarily disable CSS smooth scrolling
	  $('html').css('scroll-behavior', 'auto');
	  
	  $('html, body').animate({
	    scrollTop: targetElement.offset().top - scrollMargin
	  }, 1000, function() {
	    // Re-enable after animation
	    $('html').css('scroll-behavior', '');
	  });
	});

	$('.ProjectBanner nav button').each(function() {
	  $(this).attr('data-text', $(this).text());
	});

	// ── Idle jump cycle ───────────────────────────────────────────────
	let jumpIndex    = 0;
	let jumpInterval = null;
	let jumpResume   = null;
	const JUMP_SPEED = 900;  // ms between each card's jump
	const JUMP_DELAY = 1500; // ms to wait after hover before resuming

	function startJumpCycle() {
	    if (jumpInterval) return;
	    jumpInterval = setInterval(function () {
	        const cards = $('.ProjectTab');
	        const card  = cards.eq(jumpIndex % cards.length);
	        // Don't jump a card the user is hovering
	        if (!card.is(':hover')) {
	            card.removeClass('jumping');
	            // Force reflow so re-adding the class restarts the animation
	            card[0].getBoundingClientRect();
	            card.addClass('jumping');
	            card.one('animationend', function () {
	                $(this).removeClass('jumping');
	            });
	        }
	        jumpIndex++;
	    }, JUMP_SPEED);
	}

	function stopJumpCycle() {
	    clearInterval(jumpInterval);
	    jumpInterval = null;
	    $('.ProjectTab').removeClass('jumping');
	}

	// Pause on any card hover, resume after delay
	$('.ProjectTab').on('mouseenter', function () {
	    clearTimeout(jumpResume);
	    stopJumpCycle();
	}).on('mouseleave', function () {
	    clearTimeout(jumpResume);
	    jumpResume = setTimeout(function () {
	        jumpIndex = 0;
	        startJumpCycle();
	    }, JUMP_DELAY);
	});

	// Also pause while email is expanded, resume when closed
	// Wrap collapseEmail to restart the cycle — add this inside collapseEmail()
	// after the fadeOut line:
	//   jumpResume = setTimeout(startJumpCycle, JUMP_DELAY);
	// And at the top of the expand click handler add:
	//   stopJumpCycle();

	startJumpCycle();
})