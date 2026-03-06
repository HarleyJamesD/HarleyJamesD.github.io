(function() {
  const LAST_VISIT = sessionStorage.getItem('pageLoaded');
  const now = Date.now();
  const FIVE_MINUTES = 5 * 60 * 1000;
  
  // If visited recently, add hidden class immediately
  if (LAST_VISIT && (now - parseInt(LAST_VISIT)) <= FIVE_MINUTES) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('loadingScreen').classList.add('hidden');
      });
    } else {
      document.getElementById('loadingScreen').classList.add('hidden');
    }
  }
})();

// Main code execution
(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Constants
    const LAST_VISIT = sessionStorage.getItem('pageLoaded');
    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;
    const ANIMATION_DURATION = 400;
    const SCROLL_SETTLE_DELAY = 500;
    const LOADING_TIMEOUT = 600;

    // Cache DOM elements
    const loadingScreen = document.getElementById('loadingScreen');
    const chapterList = document.getElementById('chapterList');
    const chapterPill = document.getElementById('chapterPill');
    const sideLayout = document.getElementById('sideLayout');
    const myPicture = document.getElementById('myPicture');
    const experiences = document.getElementById('experiences');

    // Try to set session storage
    try {
      sessionStorage.setItem('pageLoaded', now.toString());
    } catch (e) {
      console.warn('SessionStorage not available:', e);
    }

    // Loading screen logic
    if (!LAST_VISIT || (now - parseInt(LAST_VISIT)) > FIVE_MINUTES) {
      loadingScreen.style.display = 'flex';
      
      // Hide loading screen when everything is loaded
      window.addEventListener('load', function() {
        fadeOutAndRemove(loadingScreen, ANIMATION_DURATION);
      });

      // Backup timeout to remove loading screen
      setTimeout(function() {
        fadeOutAndRemove(loadingScreen, ANIMATION_DURATION);
      }, LOADING_TIMEOUT);
    } else {
      loadingScreen.style.display = 'none';
    }

    // Chapter navigation setup
    // Returns the pixel `top` value that centres the pill on the given <li>
    function getPillTop(index) {
      const items = chapterList.querySelectorAll('ul > li');
      const listRect  = chapterList.getBoundingClientRect();
      const itemRect  = items[index].getBoundingClientRect();
      const pillHeight = chapterPill.offsetHeight;
      return (itemRect.top - listRect.top) + (itemRect.height / 2) - (pillHeight / 2);
    }

    let currentChapterIndex = 0;
    let isScrolling = false;
    let previousSelection = null;
    let scrollTimer = null;
    let cancelScroll = false;
    let suppressScrollDetection = false;
    let suppressTimer = null;


    // Initialize first chapter
    chapterSelect(0, true);

    // Chapter list click handlers
    const chapterItems = chapterList.querySelectorAll('li');
    chapterItems.forEach(function(item, index) {
      item.addEventListener('click', function() {
        chapterSelect(index, true);
      });
    });

    // Little hello easter egg on my picture click
    if (myPicture) {
      myPicture.addEventListener('click', function() {
        alert("Hello!");
      });
    }

    // Chapter selection function
    function chapterSelect(selectedChapterIndex, shouldScroll) {
      currentChapterIndex = selectedChapterIndex;
      
      const sectionChildren = sideLayout.children;
      const chapterChildren = chapterList.querySelectorAll('ul > li');
      const selectedChapterTitle = chapterChildren[selectedChapterIndex];
      
      // Update visual indicator (pill and selected chapter)
      if (selectedChapterTitle !== previousSelection) {
        if (previousSelection) {
          previousSelection.classList.remove('chapterSelected');
        }
        selectedChapterTitle.classList.add('chapterSelected');
        previousSelection = selectedChapterTitle;
      }
      // Move the pill (pixel value so CSS transition always interpolates cleanly)
      chapterPill.style.top = getPillTop(selectedChapterIndex) + 'px';

      //Scroll to section if shouldScroll is true
      if (shouldScroll) {
        const selectedSection = sectionChildren[selectedChapterIndex];
        const elementTop = getOffset(selectedSection).top;
        const elementHeight = selectedSection.offsetHeight;
        const windowHeight = window.innerHeight;
        //Calculate position
        const scrollTo = elementTop - (windowHeight / 2) + (elementHeight / 2);
        
        // Stop scroll detection from fighting the click-initiated scroll
        clearTimeout(scrollTimer);
        clearTimeout(suppressTimer);
        suppressScrollDetection = true;

        // Smooth scroll to position
        isScrolling = true;
        cancelScroll = false;
        smoothScrollTo(scrollTo, ANIMATION_DURATION, function() {
          isScrolling = false;
          suppressScrollDetection = false;
        });
      }
    }

    // Blur overlay for experiences section
    if (experiences) {
      // Create blur overlay element
      const blurOverlay = document.createElement('div');
      blurOverlay.className = 'blur-overlay';
      experiences.appendChild(blurOverlay);
      
      experiences.addEventListener('scroll', function() {
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight;
        const clientHeight = this.clientHeight;
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
        
        blurOverlay.style.maskImage = blurMask;
        blurOverlay.style.webkitMaskImage = blurMask;
        
        // Update box-shadow for the darkening effect
        const topShadow = `0 10vh 10vh -15vh rgba(0, 0, 0, ${topBlurOpacity * 0.5}) inset`;
        const bottomShadow = `0 -10vh 10vh -15vh rgba(0, 0, 0, ${bottomBlurOpacity * 0.5}) inset`;
        
        this.style.boxShadow = `${topShadow}, ${bottomShadow}`;
      });
      
      // Trigger initial state
      experiences.dispatchEvent(new Event('scroll'));
    }

    // Utility Functions

    function fadeOutAndRemove(element, duration) {
      element.style.transition = `opacity ${duration}ms`;
      element.style.opacity = '0';
      
      setTimeout(function() {
        element.remove();
      }, duration);
    }

    function getOffset(element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
      };
    }

    function smoothScrollTo(targetPosition, duration, callback) {
      const startPosition = window.pageYOffset || document.documentElement.scrollTop;
      const distance = targetPosition - startPosition;
      const startTime = performance.now();
      
      cancelScroll = false; // Reset

      function animation(currentTime) {
        if (cancelScroll) {
          if (callback) callback();
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
        
        window.scrollTo(0, startPosition + (distance * easeProgress));

        if (progress < 1) {
          requestAnimationFrame(animation);
        } else if (callback) {
          callback();
        }
      }
      requestAnimationFrame(animation);
    }


    function stopScroll() {
      // Cancel any ongoing scroll animation by scrolling to current position
      window.scrollTo(window.pageXOffset, window.pageYOffset);
    }


    // Event Functions

    // Scroll event handler
    window.addEventListener('scroll', function() {
      if (suppressScrollDetection) return;

      // Clear existing timer
      clearTimeout(scrollTimer);
      
      // Only update chapter pill after scrolling has fully settled
      scrollTimer = setTimeout(function() {
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const sectionChildren = sideLayout.children;
        
        // Find which section the viewport midpoint is in
        let detectedIndex = 0;
        for (let i = 0; i < sectionChildren.length; i++) {
          const sectionTop = getOffset(sectionChildren[i]).top;
          if (scrollPos + windowHeight / 2 >= sectionTop) {
            detectedIndex = i;
          }
        }
        chapterSelect(detectedIndex, true);
      }, SCROLL_SETTLE_DELAY);
    });

    window.addEventListener('wheel', function() {
      if (isScrolling) cancelScroll = true;
    }, { passive: true });

    window.addEventListener('touchmove', function() {
      if (isScrolling) cancelScroll = true;
    }, { passive: true });

    window.addEventListener('keydown', function(e) {
      const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
      if (scrollKeys.includes(e.keyCode) && isScrolling) {
        cancelScroll = true;
      }
    });
  }
})();