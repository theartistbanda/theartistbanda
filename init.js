document.addEventListener('DOMContentLoaded', function () {
  // index.html, about.html and career.html share one React bundle; <body data-page> picks the page
  var pages = { about: window.AboutPage, career: window.CareerPage };
  var page = document.body.getAttribute('data-page');
  ReactDOM.createRoot(document.getElementById('root')).render(
    React.createElement(pages[page] || window.VariantA, null)
  );
  if (pages[page]) return;

  // Preload hover cover images only on devices that support hover (desktop),
  // and only after the page is idle, so it never competes with first render.
  function preloadCovers() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    ['/assets/taskgpt-dashboard.webp', '/assets/evaluateus-cover.webp', '/assets/yourhour-cover.webp', '/assets/levelup-cover.webp', '/assets/aatmnirbhar-cover.webp', '/assets/jego-cover.webp', '/assets/earlyfoods-cover.webp'].forEach(function (src) {
      var img = new Image();
      img.src = src;
    });
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(preloadCovers);
  } else {
    setTimeout(preloadCovers, 2000);
  }
});
