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

	var defaultZ = 1;
	$('.socialMedia').hover(function(){
		$('.socialMedia').stop(true, false); // Stop all queued animations

		$(this).addClass("elevated");

		setTimeout(function(){
			$('#blur').stop(true, false).fadeIn(500);
		}, 150);
		
		
	}, function(){
		$(this).removeClass("elevated");
		$('#blur').stop(true, false).fadeOut(100);
	});
})