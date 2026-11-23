/* tilt-3d.js — drives the 3D tilt/parallax on every [data-tilt] stage (home's
   3 examples, and later website-design.html's hero specimen): sets --tx/--ty
   (pointer position) and --sy (scroll position) as inline custom properties;
   shared/styles/tilt-3d-stage.css turns them into the actual rotation. Also
   toggles .is-tilting on pointerenter/leave. Does nothing on touch pointers
   or when the visitor asks for reduced motion. */

  /* ---------------------------------------------------------------------
     Sample sites: depth on the drawings (home examples, websites hero)
     A mouse or pen tilts the site under it; scrolling gives a slight
     parallax. Only custom properties are set here (--tx, --ty, --sy),
     the CSS turns them into angles. Touch screens keep the fixed lean.
     Nothing runs while the visitor asks for reduced motion.
     --------------------------------------------------------------------- */
  var stages = $$('[data-tilt]');

  if (stages.length) {
    var inView = [];
    var pendingTilt = null; // { stage, x, y }, applied on the next frame
    var depthFrame = 0;

    var paintDepth = function () {
      depthFrame = 0;
      if (reduceMotion.matches) return;
      var vh = window.innerHeight || 1;
      inView.forEach(function (stage) {
        var r = stage.getBoundingClientRect();
        // -1 as the stage enters at the bottom, 0 mid-screen, 1 as it leaves at the top
        var p = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
        stage.style.setProperty('--sy', Math.max(-1, Math.min(1, p)).toFixed(3));
      });
      if (pendingTilt) {
        pendingTilt.stage.style.setProperty('--tx', pendingTilt.x.toFixed(3));
        pendingTilt.stage.style.setProperty('--ty', pendingTilt.y.toFixed(3));
        pendingTilt = null;
      }
    };

    var queueDepth = function () {
      if (!depthFrame) depthFrame = window.requestAnimationFrame(paintDepth);
    };

    var resetTilt = function (stage) {
      stage.classList.remove('is-tilting');
      stage.style.removeProperty('--tx');
      stage.style.removeProperty('--ty');
      if (pendingTilt && pendingTilt.stage === stage) pendingTilt = null;
    };

    var canTilt = function (e) {
      return e.pointerType !== 'touch' && !reduceMotion.matches;
    };

    stages.forEach(function (stage) {
      stage.addEventListener('pointerenter', function (e) {
        if (canTilt(e)) stage.classList.add('is-tilting');
      });
      stage.addEventListener('pointermove', function (e) {
        if (!canTilt(e)) return;
        var r = stage.getBoundingClientRect();
        pendingTilt = {
          stage: stage,
          x: (e.clientX - r.left) / r.width - 0.5,
          y: (e.clientY - r.top) / r.height - 0.5
        };
        queueDepth();
      });
      stage.addEventListener('pointerleave', function () { resetTilt(stage); });
    });

    if ('IntersectionObserver' in window) {
      var depthSpy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var i = inView.indexOf(entry.target);
          if (entry.isIntersecting && i < 0) inView.push(entry.target);
          if (!entry.isIntersecting && i > -1) inView.splice(i, 1);
        });
        queueDepth();
      });
      stages.forEach(function (stage) { depthSpy.observe(stage); });
    } else {
      inView = stages.slice();
    }

    window.addEventListener('scroll', queueDepth, { passive: true });
    window.addEventListener('resize', queueDepth);

    var onMotionChange = function () {
      if (reduceMotion.matches) {
        stages.forEach(function (stage) {
          resetTilt(stage);
          stage.style.removeProperty('--sy');
        });
      } else {
        queueDepth();
      }
    };
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onMotionChange);
  }
