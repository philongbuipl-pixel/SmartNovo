(function () {
  'use strict';

  /* Mobile nav */
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      links.classList.toggle('open');
      burger.setAttribute('aria-expanded', links.classList.contains('open') ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* Header: transparent over the hero video, solidifies on scroll.
     Pages without a hero (product/partners/contact) stay solid. */
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero');
  if (header) {
    var solidAfter = function () { return hero ? Math.max(120, window.innerHeight * 0.62) : 0; };
    var onScroll = function () { header.classList.toggle('solid', !hero || window.scrollY > solidAfter()); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* Clip-looper: play only a [data-clip-start, data-clip-end] window of a video,
     used to show short 3s loops / skip an intro without re-encoding. */
  document.querySelectorAll('video[data-clip-start],video[data-clip-end]').forEach(function (v) {
    var start = parseFloat(v.getAttribute('data-clip-start')) || 0;
    var endAttr = v.getAttribute('data-clip-end');
    var end = endAttr != null ? parseFloat(endAttr) : null;
    var seekStart = function () { try { v.currentTime = start; } catch (e) {} };
    if (v.readyState >= 1) seekStart(); else v.addEventListener('loadedmetadata', seekStart);
    v.addEventListener('timeupdate', function () {
      var stop = end != null ? end : (v.duration || Infinity);
      if (v.currentTime >= stop || v.currentTime < start - 0.05) seekStart();
    });
  });

  /* Reveal + stagger + meters + counters */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .stagger, .curve');
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var dur = 1400, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(val).toLocaleString() : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && revealEls.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll && e.target.querySelectorAll('[data-count]').forEach(animateCount);
        ro.unobserve(e.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(animateCount);
  }

  /* Standalone counters not inside a .reveal */
  var loners = document.querySelectorAll('[data-count]:not(.reveal [data-count])');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    loners.forEach(function (el) { co.observe(el); });
  }

  /* Play feature videos only in view */
  var vids = document.querySelectorAll('video[data-play-in-view]');
  if ('IntersectionObserver' in window && vids.length) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var pr = v.play(); if (pr) pr.catch(function(){}); }
        else { v.pause(); }
      });
    }, { threshold: 0.25 });
    vids.forEach(function (v) { vo.observe(v); });
  }

  /* Subtle parallax float on tagged media */
  var floats = document.querySelectorAll('.float-media');
  if (floats.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var raf = null;
    var update = function () {
      floats.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var center = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = 'translateY(' + (center * -0.04) + 'px)';
      });
      raf = null;
    };
    window.addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    update();
  }

  /* Safety net */
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('.reveal:not(.in), .reveal-stagger:not(.in), .stagger:not(.in)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
      });
    }, 700);
  });
})();
