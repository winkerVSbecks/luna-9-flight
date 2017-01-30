var sunrays = selectAll('.js-sunray');

/**
 * Animate sunrays
 */
var sunraysTimeline = anime.timeline({ loop: true });

var sunrayAnimPart1 = anime({
  targets: sunrays,
  strokeDashoffset: [anime.setDashoffset, 0],
  delay: function(_, idx) { return idx * 60; },
  duration: 1800,
  easing: 'easeOutExpo',
  autoPlay: false,
  complete: () => sunrayAnimPart2.play()
});
sunrayAnimPart1.pause();

var sunrayAnimPart2 = anime({
  targets: sunrays,
  strokeDashoffset: [0, (el) => -1 * anime.setDashoffset(el)],
  delay: function(_, idx) { return idx * 60; },
  duration: 1800,
  easing: 'easeInExpo',
  complete: () => sunrayAnimPart1.play()
});

/**
 * Space Probe
 */
var spaceProbe = select('#js-space-probe');
var path = anime.path('#js-motion-path');

var motionPath = anime({
  targets: spaceProbe,
  translateX: path('x'),
  translateY: path('y'),
  easing: 'easeInOutQuint',
  duration: 20000,
  loop: true
});

/**
 * Utils
 */
function select(query) {
  return document.querySelector(query);
}

function selectAll(query) {
  return document.querySelectorAll(query);
}
