// TaskGPT pages. Two jobs, no libraries:
// 1. Tables that scroll sideways get a tab stop, so keyboard users can scroll them.
// 2. On the full case study: the heading tree follows the reader (aria-current="location"),
//    opens the group around the current section, and below 1024px becomes a drawer
//    (focus kept inside, Esc and a tap outside close it, page behind it does not scroll).
(function () {
  function tableStops() {
    var wraps = document.querySelectorAll('.table-wrap');
    for (var i = 0; i < wraps.length; i++) {
      if (wraps[i].scrollWidth > wraps[i].clientWidth + 1) wraps[i].setAttribute('tabindex', '0');
      else wraps[i].removeAttribute('tabindex');
    }
  }
  var resizeTimer;
  tableStops();
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(tableStops, 150); });

  var toc = document.getElementById('toc');
  if (!toc) return;

  var root = document.documentElement;
  var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
  var heads = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var openBtn = document.querySelector('.toc-open');
  var closeBtn = toc.querySelector('.toc-close');
  var backdrop = document.querySelector('.toc-backdrop');
  var current = document.getElementById('reader-current');
  var bar = document.querySelector('.progress span');
  var wide = window.matchMedia('(min-width: 1024px)');
  var active = -1;

  // Groups in the tree: open by default (so the page works without this script);
  // the extensions group starts closed and opens when you reach it.
  var twists = Array.prototype.slice.call(toc.querySelectorAll('.toc-twist'));
  function setGroup(btn, open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var group = document.getElementById(btn.getAttribute('aria-controls'));
    if (group) group.hidden = !open;
  }
  twists.forEach(function (btn) {
    btn.hidden = false;
    btn.addEventListener('click', function () { setGroup(btn, btn.getAttribute('aria-expanded') !== 'true'); });
    if (btn.closest('.toc-l2')) setGroup(btn, false);
  });

  function isOpen() { return toc.classList.contains('is-open'); }

  function keepVisible(a) {
    var r = a.getBoundingClientRect(), c = toc.getBoundingClientRect();
    if (c.height === 0) return;
    if (r.top < c.top + 48) toc.scrollTop -= (c.top + 48 - r.top);
    else if (r.bottom > c.bottom - 24) toc.scrollTop += (r.bottom - c.bottom + 24);
  }

  function setActive(i) {
    active = i;
    links.forEach(function (a, j) {
      if (j === i) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
    var a = links[i];
    if (!a) return;
    // Open every group around the current section
    var li = a.closest('li');
    var parent = li && li.parentElement ? li.parentElement.closest('li') : null;
    while (parent) {
      var btn = parent.querySelector(':scope > .toc-row > .toc-twist');
      if (btn && btn.getAttribute('aria-expanded') !== 'true') setGroup(btn, true);
      parent = parent.parentElement ? parent.parentElement.closest('li') : null;
    }
    if (wide.matches || isOpen()) keepVisible(a);
    if (current) current.textContent = a.getAttribute('data-label') || a.textContent;
  }

  // The current section is the last heading that has reached the line under the sticky header(s)
  function line() {
    return (parseFloat(getComputedStyle(root).scrollPaddingTop) || 80) + 12;
  }
  function spy() {
    var y = line(), idx = 0;
    for (var i = 0; i < heads.length; i++) {
      if (heads[i] && heads[i].getBoundingClientRect().top <= y) idx = i;
      else break;
    }
    if (idx !== active) setActive(idx);
    if (bar) {
      var max = root.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    }
  }
  // Scroll events arrive at most once a frame, and spy() only reads ~30 positions
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', spy);
  window.addEventListener('hashchange', spy);
  spy();

  // Drawer, below 1024px
  function focusables() {
    return Array.prototype.slice.call(toc.querySelectorAll('a[href], button')).filter(function (el) {
      return !el.hidden && el.getClientRects().length > 0;
    });
  }
  function openDrawer() {
    toc.classList.add('is-open');
    toc.setAttribute('role', 'dialog');
    toc.setAttribute('aria-modal', 'true');
    if (backdrop) backdrop.hidden = false;
    root.classList.add('toc-locked');
    openBtn.setAttribute('aria-expanded', 'true');
    var target = links[active] || closeBtn;
    target.focus();
    if (document.activeElement !== target) setTimeout(function () { target.focus(); }, 30);
    keepVisible(target);
  }
  function closeDrawer(returnFocus) {
    if (!isOpen()) return;
    toc.classList.remove('is-open');
    toc.removeAttribute('role');
    toc.removeAttribute('aria-modal');
    if (backdrop) backdrop.hidden = true;
    root.classList.remove('toc-locked');
    openBtn.setAttribute('aria-expanded', 'false');
    if (returnFocus) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', function () { closeDrawer(true); });
  if (backdrop) backdrop.addEventListener('click', function () { closeDrawer(true); });
  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(true); return; }
    if (e.key !== 'Tab') return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !toc.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !toc.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  });
  wide.addEventListener('change', function () { if (wide.matches) closeDrawer(false); });

  // Choosing a section: close the drawer first (so the page can scroll), then let the
  // normal anchor jump happen, and move focus to that heading so reading continues there.
  toc.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var target = document.getElementById(a.getAttribute('href').slice(1));
    closeDrawer(false);
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
})();
