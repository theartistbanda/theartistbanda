// case-video.js: silent looping videos at the top of case study pages (brief, 25 Nov 2026).
// The video plays only when motion is allowed and it is on screen.
// The button pauses and plays it (WCAG 2.2.2 Pause, Stop, Hide).
// data-start on the figure: the video begins, and begins again, that many seconds in.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('figure.case-video').forEach(function (fig) {
    var video = fig.querySelector('video');
    var btn = fig.querySelector('.case-video-toggle');
    if (!video || !btn) return;
    video.muted = true;
    var label = fig.getAttribute('data-label') || 'product walkthrough';
    var start = parseFloat(fig.getAttribute('data-start')) || 0;
    var userPaused = reduce.matches; // reduced motion: start paused; Play still works
    var onScreen = false;

    function show(playing) {
      btn.textContent = playing ? 'Pause' : 'Play';
      btn.setAttribute('aria-label', (playing ? 'Pause' : 'Play') + ' video: ' + label);
      fig.classList.toggle('is-playing', playing);
    }
    function play() {
      if (start && video.currentTime < start) video.currentTime = start;
      var p = video.play();
      if (p && p.catch) p.catch(function () { if (video.paused) show(false); }); // e.g. iOS Low Power Mode
    }

    video.addEventListener('play', function () { show(true); });
    video.addEventListener('pause', function () { if (!video.ended) show(false); });
    if (start) {
      video.loop = false;
      video.addEventListener('ended', function () { video.currentTime = start; play(); });
    }
    btn.addEventListener('click', function () {
      if (video.paused) { userPaused = false; play(); }
      else { userPaused = true; video.pause(); }
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (onScreen) { if (!userPaused) play(); }
        else if (!video.paused) { video.pause(); }
      }, { threshold: 0.25 }).observe(video);
    } else if (!userPaused) {
      play();
    }

    if (reduce.addEventListener) {
      reduce.addEventListener('change', function (e) {
        if (e.matches) { userPaused = true; video.pause(); }
      });
    }
    show(false);
  });
})();
