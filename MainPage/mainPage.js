$(document).ready(function(){
	// $('#chapterPill').showAndRaise();

	// function showAndRaise(){
	// 	$(this).hide().fadeIn(900);
	// }
	

	const topPositions = [
		'calc(0% + 0.5em - var(--pill-height)/2)',
      	'calc(50% - var(--pill-height)/2)',
      	'calc(100% - 0.5em - var(--pill-height)/2)'
	];
	chapterSelect(0);
	
	$("#chapterList li").on({
		click: function(){
			var index = $(this).index();

			chapterSelect(index);
		},
	});

	$("#myPicture").click(function(){
		alert("Chapter select hovering changed.");
		$("#chapterList").toggleClass("normal-click");
		$("#chapterList").toggleClass("alternate-click");
	});

	var previousSelection;
	function chapterSelect(selectedChapterIndex){
		var selectedChapterTitle = $("#chapterList ul").children().eq(selectedChapterIndex).addClass("chapterSelected").get(0);
		if(selectedChapterTitle !== previousSelection){
			// Update selected class
			$(previousSelection).removeClass("chapterSelected");
			previousSelection = selectedChapterTitle;
		}
		

		$("#chapterPill").css("top", topPositions[selectedChapterIndex]);

		var selectedSection = $("#sideLayout").children().eq(selectedChapterIndex);
		var elementTop = selectedSection.offset().top;
		var elementHeight = selectedSection.outerHeight();
		var windowHeight = $(window).height();

		var scrollTo = elementTop - (windowHeight / 2) + (elementHeight / 2);

		// Smooth scroll to that position
		$('html, body').animate({
			scrollTop: scrollTo
		}, 600);
	}
})