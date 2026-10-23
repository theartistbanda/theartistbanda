// "← Portfolio" on a case page returns to the exact spot the visitor left on the homepage.
// Came straight from the homepage: step back in history, which restores the position.
// Arrived some other way (another case page, a shared link): flag the homepage to restore
// the position it saved when the visitor last left it. See useHomeScrollMemory in variant-a.jsx.
(function () {
  var back = document.querySelector('a.back[href="/"]');
  if (!back) return;
  back.addEventListener('click', function (e) {
    try {
      var ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.origin === location.origin && ref.pathname === '/' && history.length > 1) {
        e.preventDefault();
        history.back();
        return;
      }
      sessionStorage.setItem('home-restore', '1');
    } catch (err) { /* fall through to the normal link */ }
  });
})();
