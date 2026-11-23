/* scroll-reveal.js — generic "fade/slide in on scroll" for any element
   marked [data-reveal]. Adds .reveal-on to <html> (only if
   IntersectionObserver exists, so content never stays invisible without
   it) and toggles .is-in per element; shared/styles/motion.css does the
   actual animation under prefers-reduced-motion: no-preference. */

  /* ---------------------------------------------------------------------
     Scroll reveals
     --------------------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    root.classList.add('reveal-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-in', entry.isIntersecting);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
  }
