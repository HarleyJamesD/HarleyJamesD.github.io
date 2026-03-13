

$(document).ready(function(){
	const lastVisit = sessionStorage.getItem('pageLoaded');
	const now = Date.now();
	const fiveMinutes = 5 * 60 * 1000; 

	$('#loadingScreen').show();
	if (!lastVisit || (now - parseInt(lastVisit)) > fiveMinutes) {
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

	if (!hasHardwareAcceleration()) {
	  document.documentElement.classList.add('no-gpu');
	}

	let hoverTimeout;
	let defaultZ = 1;
	$('.socialMedia').hover(function(){
		if($('#email').hasClass('expanded')) {
	        return;
	    }

		$('.socialMedia').stop(true, false); // Stop all queued animations
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
		if($('#email').hasClass('expanded')) {
	        return;
	    }
		
		$(this).removeClass("elevated");
		$(this).css('transform', '');
		clearTimeout(hoverTimeout);
		$('#blur').stop(true, false).fadeOut(100);
	});

	// Email collapsible toggle
	$('#email').on('click', function(e) {
		e.stopPropagation();
		$('#email').addClass('expanded');
		$('#blur').addClass('active').stop(true, false).fadeIn(300);
		if ($('#email').hasClass('expanded')) {
			// $('#email').removeClass('elevated');
			$('#email').css('transform', '');
			$('#blur').stop(true, false).fadeIn(300);
		} else {
			$('#blur').stop(true, false).fadeOut(300);
		}
	});

	// Prevent form clicks from toggling
	$('#email form').on('click', function(e) {
		e.stopPropagation();
	});

	$(document).on('click', function(e) {
	    if ($('#email').hasClass('expanded')) {
	        // Check if click is outside the email element
	        if (!$(e.target).closest('#email').length) {
	            $('#email').removeClass('expanded');
	            $('#email').removeClass("elevated");
	            $('#blur').removeClass('active').stop(true, false).fadeOut(300);
	            $('#blur').stop(true, false).fadeOut(300);
	        }
	    }
	});

	// Clear form and close card after submission
	$('#email form').on('submit', function() {
	    var form = this;
	    
	    setTimeout(function() {
	        form.reset();
	        $('#email').removeClass('expanded');
	        $('#email').removeClass("elevated");
	        $('#blur').removeClass('active').stop(true, false).fadeOut(300);
	    }, 100);
	});

	function hasHardwareAcceleration() {
	  try {
	    const canvas = document.createElement('canvas');
	    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	    if (!gl) return false;

	    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
	    if (!debugInfo) return true; // Can't detect, assume hardware

	    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
	    const softwareRenderers = /swiftshader|llvmpipe|software rasterizer|microsoft basic render/i;
	    return !softwareRenderers.test(renderer);
	  } catch (e) {
	    return true; // Assume hardware if detection fails
	  }
	}
})