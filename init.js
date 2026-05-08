document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.createRoot(document.getElementById('root')).render(
    React.createElement(VariantA, null)
  );

  // Preload hover cover images only on devices that support hover (desktop),
  // and only after the page is idle — so it never competes with first render.
  function preloadCovers() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    ['/assets/yourhour-cover.webp', '/assets/jego-cover.webp', '/assets/earlyfoods-cover.webp'].forEach(function (src) {
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
