$(document).ready(function(){
	$('#return').hide();

	$('#return').click(function() {
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
})