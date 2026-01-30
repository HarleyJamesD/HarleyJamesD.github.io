$(document).ready(function(){
	$('#return').hide();

	$('#return').click(function() {
	  $('html, body').animate({ scrollTop: 0 }, 'smooth');
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
	  
	  // Get the scroll-margin-top value from CSS
	  var scrollMargin = parseFloat(getComputedStyle(targetElement[0]).scrollMarginTop);
	  
	  $('html, body').animate({
	    scrollTop: targetElement.offset().top - scrollMargin
	  }, 1000);
	});
})