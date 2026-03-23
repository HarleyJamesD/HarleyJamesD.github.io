$(document).ready(function(){
	const lastVisit = sessionStorage.getItem('pageLoaded');
	const now = Date.now();
	const fiveMinutes = 5 * 60 * 1000; 
	$('#loadingScreen').show();
	if (!lastVisit || (now - parseInt(lastVisit)) > fiveMinutes) {
    	$('#loadingScreen').show();
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

	if (!hasHardwareAcceleration()) {
	  document.documentElement.classList.add('no-gpu');
	}

	// ── Hover effects ─────────────────────────────────────────────────
	let hoverTimeout;
	$('.socialMedia').hover(function(){
		if($('#email').hasClass('expanded')) return;

		$('.socialMedia').stop(true, false);
		jumpResume = setTimeout(startJumpCycle, JUMP_DELAY);
		$(this).addClass("elevated");
		if($(this).attr('id') === "email") {
		    $(this).css('transform', `scale(1.05)`);
		} else {
		    const randomRotation = Math.random() < 0.5 ? -3 : 3;
		    $(this).css('transform', `scale(1.05) rotate(${randomRotation}deg)`);
		}
		clearTimeout(hoverTimeout);
		hoverTimeout = setTimeout(function(){
			$('#blur').stop(true, false).fadeIn(500);
		}, 150);
	}, function(){
		if($('#email').hasClass('expanded')) return;
		$(this).removeClass("elevated");
		$(this).css('transform', '');
		clearTimeout(hoverTimeout);
		$('#blur').stop(true, false).fadeOut(100);
	});

	// ── Email expand (FLIP animation) ─────────────────────────────────
	$('#email').on('click', function(e) {
		e.stopPropagation();
		if ($('#email').hasClass('expanded')) return;

		// FIRST: record the card's current position in the viewport
		const rect = document.getElementById('email').getBoundingClientRect();

		// Pin the card to that exact spot using position:fixed so it
		// doesn't jump when it leaves the grid flow. Disable transitions
		// for this step so the pin is invisible to the user.
		$('#email').css({
			position:   'fixed',
			top:        rect.top    + 'px',
			left:       rect.left   + 'px',
			width:      rect.width  + 'px',
			height:     rect.height + 'px',
			margin:     '0',
			transition: 'none',
			zIndex:     '200'
		});

		// Show the ghost so the grid columns hold their shape while
		// #email is out of flow.
		$('#email-ghost').show();

		// Force a reflow so the browser registers the pinned position
		// before we re-enable transitions (prevents batching these paints).
		document.getElementById('email').getBoundingClientRect();

		// Re-enable transitions by clearing the inline override, then
		// clear the inline position values in the next frame so the CSS
		// .expanded rule's top/left/width/height take effect.
		// The browser interpolates from the pinned values → smooth grow.
		$('#email').css('transition', '');
		requestAnimationFrame(function() {
			$('#email').css({ top: '', left: '', width: '', height: '' });
			$('#email').addClass('expanded').removeClass('elevated').css('transform', '');
			$('#blur').addClass('active').stop(true, false).fadeIn(300);
		});
	});

	// ── Email collapse (FLIP animation back) ──────────────────────────
	function collapseEmail() {
		if (!$('#email').hasClass('expanded')) return;

		// Record where the expanded card is and where the ghost (original
		// grid cell) is right now.
		const expandedRect = document.getElementById('email').getBoundingClientRect();
		const ghostRect    = document.getElementById('email-ghost').getBoundingClientRect();

		// Pin the card to its current expanded position, transitions off.
		$('#email').css({
			position:   'fixed',
			top:        expandedRect.top    + 'px',
			left:       expandedRect.left   + 'px',
			width:      expandedRect.width  + 'px',
			height:     expandedRect.height + 'px',
			margin:     '0',
			transition: 'none',
			zIndex:     '200'
		});

		// Remove .expanded so layout styles revert (flex-direction, etc.)
		$('#email').removeClass('expanded').removeClass('elevated');

		// Force reflow so the class removal is painted at the pinned spot.
		document.getElementById('email').getBoundingClientRect();

		// Re-enable transitions, then animate to the ghost's position.
		$('#email').css('transition',
			'top .4s ease-out, left .4s ease-out, width .4s ease-out, ' +
			'height .4s ease-out, border-radius .4s ease-out, box-shadow .4s ease-out'
		);

		requestAnimationFrame(function() {
			$('#email').css({
				top:    ghostRect.top    + 'px',
				left:   ghostRect.left   + 'px',
				width:  ghostRect.width  + 'px',
				height: ghostRect.height + 'px'
			});
		});

		// Once the shrink animation finishes, remove all inline styles so
		// the card returns to being a normal grid item, then hide the ghost.
		$('#email').one('transitionend', function() {
			$(this).attr('style', '');
			$('#email-ghost').hide();
		});

		$('#blur').removeClass('active').stop(true, false).fadeOut(300);
	}

	// Clicking outside the card (on the blur overlay) closes it
	$(document).on('click', function(e) {
	    if ($('#email').hasClass('expanded')) {
	        if (!$(e.target).closest('#email').length) {
	            collapseEmail();
	        }
	    }
	});

	// Escape key also closes
	$(document).on('keydown', function(e) {
		if (e.key === 'Escape') collapseEmail();
	});

	// Prevent clicks inside the form from bubbling up and closing the card
	$('#email form').on('click', function(e) {
		e.stopPropagation();
	});

	// Clear form and close card after submission
	$('#email form').on('submit', function() {
	    var form = this;
	    setTimeout(function() {
	        form.reset();
	        collapseEmail();
	    }, 100);
	});

	// ── Idle jump cycle ───────────────────────────────────────────────
	let jumpIndex    = 0;
	let jumpInterval = null;
	let jumpResume   = null;
	const JUMP_SPEED = 800;  // ms between each card's jump
	const JUMP_DELAY = 1500; // ms to wait after hover before resuming

	function startJumpCycle() {
	    if (jumpInterval) return;
	    jumpInterval = setInterval(function () {
	        if ($('#email').hasClass('expanded')) return;
	        const cards = $('.socialMedia');
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
	    $('.socialMedia').removeClass('jumping');
	}

	// Pause on any card hover, resume after delay
	$('.socialMedia').on('mouseenter', function () {
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

	// ── Utility ───────────────────────────────────────────────────────
	function hasHardwareAcceleration() {
	  try {
	    const canvas = document.createElement('canvas');
	    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	    if (!gl) return false;
	    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
	    if (!debugInfo) return true;
	    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
	    const softwareRenderers = /swiftshader|llvmpipe|software rasterizer|microsoft basic render/i;
	    return !softwareRenderers.test(renderer);
	  } catch (e) {
	    return true;
	  }
	}
});