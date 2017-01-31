var sunrays = selectAll('.js-sunray');

/**
 * Animate sunrays
 */
var sunraysTimeline = anime.timeline({ loop: true });

var sunrayAnimPart1 = anime({
  targets: sunrays,
  strokeDashoffset: [anime.setDashoffset, 0],
  delay: function(_, idx) { return idx * 60; },
  duration: 800,
  easing: 'easeOutExpo',
  autoPlay: false,
  complete: () => sunrayAnimPart2.play()
});
sunrayAnimPart1.pause();

var sunrayAnimPart2 = anime({
  targets: sunrays,
  strokeDashoffset: [0, (el) => -1 * anime.setDashoffset(el)],
  delay: function(_, idx) { return idx * 60; },
  duration: 800,
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
 * Launch Label
 */
var launchLabels = selectAll('#js-launch-label .text');
var launchLabelUnderlines = selectAll('#js-launch-label .underline');
var { label: launchAnim, underline: launchUnderlinesAnim }
  = makeLabelAnim(launchLabels, launchLabelUnderlines)

/**
 * Utils
 */
function select(query) {
  return document.querySelector(query);
}

function selectAll(query) {
  return document.querySelectorAll(query);
}

function makeLabelAnim(labels, underlines) {
  var labelAnim = anime({
    targets: labels,
    opacity: [0, 1],
    easing: 'easeInSine',
    duration: 900
  });

  var underlineAnim = anime({
    targets: underlines,
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutQuart',
    duration: 600,
    delay: 300
  });

  return { label, underline };
}
