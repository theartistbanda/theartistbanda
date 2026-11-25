// Motion slots on the LevelUp case study: places for Dipesh's animations (brief, 24 Nov 2026).
// <figure class="motion-slot" id="motion-hero" data-video="">: while data-video is empty the slot
// shows its still image. Put a name in it, for example data-video="levelup-motion-hero", and this
// plays /assets/levelup-motion-hero.webm (or .mp4) in the image's place, muted and looping.
// It plays only while on screen. There is always a Pause button, because moving things that last
// more than five seconds need one (WCAG 2.2.2). With reduced motion it never starts by itself: the
// still image stays, with a Play button. If the video is missing, the still image stays.
(function () {
  var slots = Array.prototype.slice.call(document.querySelectorAll('.motion-slot[data-video]'));
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  slots.forEach(function (slot) {
    var name = slot.getAttribute('data-video').trim().replace(/^.*\//, '').replace(/\.(webm|mp4)$/i, '');
    var frame = slot.querySelector('.frame');
    var picture = frame && frame.querySelector('picture');
    var img = picture && picture.querySelector('img');
    if (!name || !img) return;

    var video = null;
    var wanted = !reduce;      // what the reader wants: playing, or paused
    var onScreen = false;
    var what = img.getAttribute('alt') || '';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'motion-btn';
    frame.appendChild(btn);
    function label() {
      btn.textContent = wanted ? 'Pause' : 'Play';
      btn.setAttribute('aria-label', (wanted ? 'Pause' : 'Play') + ' the animation');
    }
    label();

    function fail() {
      if (video && video.parentNode) video.parentNode.replaceChild(picture, video);
      video = null;
      if (btn.parentNode) btn.parentNode.removeChild(btn);
      if (io) io.disconnect();
    }

    function build() {
      video = document.createElement('video');
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('preload', 'auto');
      video.setAttribute('poster', img.currentSrc || img.src);
      video.setAttribute('aria-label', what);
      video.setAttribute('role', 'img');
      video.width = img.width;
      video.height = img.height;
      ['webm', 'mp4'].forEach(function (ext, i) {
        var s = document.createElement('source');
        s.src = '/assets/' + name + '.' + ext;
        s.type = 'video/' + ext;
        if (i === 1) s.addEventListener('error', fail);   // neither file could be loaded
        video.appendChild(s);
      });
      picture.parentNode.replaceChild(video, picture);
    }

    function sync() {
      if (wanted && onScreen) {
        if (!video) build();
        var p = video.play();
        if (p && p.catch) p.catch(function () { if (video && video.paused && onScreen && document.visibilityState === 'visible') { wanted = false; label(); } });
      } else if (video) {
        video.pause();
      }
    }

    btn.addEventListener('click', function () { wanted = !wanted; onScreen = true; label(); sync(); });

    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (e) {
      onScreen = e[e.length - 1].isIntersecting;
      sync();
    }, { threshold: 0.25 }) : null;
    if (io) io.observe(slot); else { onScreen = true; sync(); }
  });
})();
