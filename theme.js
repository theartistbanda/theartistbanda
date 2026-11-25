// Theme. Every visitor starts in their device's own setting, light or dark (Dipesh, 25 Nov 2026);
// a choice made with the button or the popup is remembered and wins from then on.
// The theme is applied by a short script at the top of each page, before anything renders, so
// there is no flash of the wrong theme. This file runs the button in the header and, once per
// visitor, a small popup under it that points the button out.
(function () {
  var root = document.documentElement;
  var DELAY = 2500;   // after the homepage hello and its hand-drawn line have finished
  var OPEN_FOR = 5000;

  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function save(key, value) { try { localStorage.setItem(key, value); return true; } catch (e) { return false; } }
  function chosen() { var t = read('theme'); return t === 'dark' || t === 'light' ? t : null; }
  function set(theme) { root.setAttribute('data-theme', theme); }

  function toggle() {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    save('theme', next); // private mode: fine, just not remembered
    // Crossfade between themes where supported; instant for reduced motion
    if (document.startViewTransition && !reduce) {
      document.startViewTransition(function () { set(next); });
    } else {
      set(next);
    }
  }

  // Delegated, so it also works for the toggle React renders on the homepage
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    if (tip) close();
    toggle();
  });

  // The device switches while the page is open (at sunset, say): follow it, unless they chose
  var device = window.matchMedia('(prefers-color-scheme: dark)');
  var follow = function () { if (!chosen()) set(device.matches ? 'dark' : 'light'); };
  if (device.addEventListener) device.addEventListener('change', follow);
  // Coming back with the Back button to a page kept in memory: match a choice made since
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) set(chosen() || (device.matches ? 'dark' : 'light'));
  });

  // The popup. Shown once per visitor, never to someone who has already chosen a theme. It closes
  // itself after five seconds, which wait while the pointer or keyboard is on it (WCAG 2.2.1).
  // The button in the header does the same job, so nothing is lost when it goes.
  var tip = null, btn = null, timer = 0, left = 0, since = 0, held = {};

  function pause() { if (timer) { clearTimeout(timer); timer = 0; left -= Date.now() - since; } }
  function run() {
    if (!tip || timer || held.pointer || held.focus || document.hidden) return;
    left = Math.max(left, 1500);
    since = Date.now();
    timer = setTimeout(close, left);
  }
  function hold(what) { held[what] = true; pause(); }
  function release(what) { held[what] = false; run(); }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function onVisible() { if (document.hidden) pause(); else run(); }

  // Under the button, kept inside the screen, with the arrow on the button's centre
  function place() {
    if (!tip || !btn) return;
    var b = btn.getBoundingClientRect(), w = tip.offsetWidth, gap = 12;
    var page = document.documentElement.clientWidth;
    var x = Math.max(gap, Math.min(b.left + b.width / 2 - w / 2, page - w - gap));
    tip.style.transition = tip.style.transform = 'none'; // measure where it rests, not mid-slide
    tip.style.left = tip.style.top = '0px';
    var at = tip.getBoundingClientRect();
    tip.style.left = Math.round(x - at.left) + 'px';
    tip.style.top = Math.round(b.bottom + 14 - at.top) + 'px';
    tip.style.setProperty('--arrow', Math.round(b.left + b.width / 2 - x) + 'px');
    tip.style.transform = '';
    void tip.offsetWidth;
    tip.style.transition = '';
  }

  function close() {
    if (!tip) return;
    var el = tip, had = el.contains(document.activeElement), to = btn;
    pause();
    tip = null;
    btn.classList.remove('is-noted');
    window.removeEventListener('resize', place);
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('visibilitychange', onVisible);
    if (had) to.focus({ preventScroll: true });
    el.classList.remove('is-open');
    setTimeout(function () { el.remove(); }, 250);
  }

  function show() {
    btn = document.querySelector('[data-theme-toggle]');
    // If it can't be remembered it would come back on every page, so it stays away
    if (!btn || chosen() || !save('theme-tip', '1')) return;
    tip = document.createElement('div');
    tip.className = 'theme-tip';
    tip.setAttribute('role', 'group');
    tip.setAttribute('aria-label', 'Theme');
    tip.innerHTML =
      '<p class="theme-tip-text" role="status"></p>' +
      '<button type="button" class="theme-tip-switch" data-cursor="hover">Switch ' +
        '<span class="sr-only label-to-dark">to dark mode</span><span class="sr-only label-to-light">to light mode</span></button>' +
      '<button type="button" class="theme-tip-close" data-cursor="hover" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    btn.insertAdjacentElement('afterend', tip); // next to the button, so Tab reaches it from there
    var el = tip;
    el.querySelector('.theme-tip-switch').addEventListener('click', function () { close(); toggle(); });
    el.querySelector('.theme-tip-close').addEventListener('click', close);
    el.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') hold('pointer'); });
    el.addEventListener('pointerleave', function () { release('pointer'); });
    el.addEventListener('focusin', function () { hold('focus'); });
    el.addEventListener('focusout', function (e) { if (!el.contains(e.relatedTarget)) release('focus'); });
    window.addEventListener('resize', place);
    document.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisible);
    // The words go in after the element is on the page, so screen readers announce them
    setTimeout(function () {
      if (tip !== el) return;
      el.querySelector('.theme-tip-text').innerHTML =
        'Prefer <span class="label-to-dark">dark</span><span class="label-to-light">light</span> mode?';
      place();
      el.classList.add('is-open');
      btn.classList.add('is-noted');
      left = OPEN_FOR;
      run();
    }, 60);
  }

  function start() {
    if (chosen() || read('theme-tip')) return;
    var wait = setInterval(function () {
      // Not while the page is in a background tab, or before React has drawn the header
      if (document.hidden || !document.querySelector('[data-theme-toggle]')) return;
      clearInterval(wait);
      setTimeout(function () {
        if (!document.hidden) show(); else document.addEventListener('visibilitychange', show, { once: true });
      }, DELAY);
    }, 200);
  }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
})();
