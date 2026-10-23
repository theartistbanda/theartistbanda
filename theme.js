// Theme toggle. Light is the default; the visitor's choice is remembered.
// The saved theme is applied by a two-line script at the top of each page,
// before anything renders, so there is no flash of the wrong theme.
(function () {
  var root = document.documentElement;

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* private mode: fine, just not remembered */ }
  }

  // Delegated, so it also works for the toggle React renders on the homepage
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Crossfade between themes where supported; instant for reduced motion
    if (document.startViewTransition && !reduce) {
      document.startViewTransition(function () { apply(next); });
    } else {
      apply(next);
    }
  });
})();
