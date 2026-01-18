(function() {
  const lastVisit = sessionStorage.getItem('pageLoaded');
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  // If visited recently, add hidden class immediately
  if (lastVisit && (now - parseInt(lastVisit)) <= fiveMinutes) {
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('loadingScreen').classList.add('hidden');
    });
  }
})();

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

})