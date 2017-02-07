const sunrays = selectAll('.js-sunray');

/**
 * Animate sunrays
 */
const sunraysTimeline = anime.timeline({ loop: true });

const sunrayAnimPart1 = anime({
  targets: sunrays,
  strokeDashoffset: [anime.setDashoffset, 0],
  delay: function(_, idx) { return idx * 60; },
  duration: 800,
  easing: 'easeOutExpo',
  autoPlay: false,
  complete: () => sunrayAnimPart2.play()
});
sunrayAnimPart1.pause();

const sunrayAnimPart2 = anime({
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
const spaceProbe = select('#js-space-probe');
const path = anime.path('#js-motion-path');

const motionPath = anime({
  targets: spaceProbe,
  translateX: path('x'),
  translateY: path('y'),
  easing: 'easeInOutQuint',
  duration: 30000,
  loop: true
});

/**
 * Launch Label
 */
const launchLabels = selectAll('#js-launch-label .text');
const launchLabelUnderlines = selectAll('#js-launch-label .underline');
const launchAnim = makeLabelAnim(launchLabels, 2000);
const launchUnderlinesAnim = makeLineAnim(launchLabelUnderlines, 2000);


/**
 * Boost Label
 */
const boostLabels = selectAll('#js-boost-label .text');
const boostLabelUnderlines = selectAll('#js-boost-label .underline');
const boostAnim = makeLabelAnim(boostLabels, 13000);
const boostUnderlinesAnim = makeLineAnim(boostLabelUnderlines, 13000);


/**
 * Timeline
 */
const labelsTimeline = anime.timeline();

labelsTimeline
  .add(launchAnim)
  .add(launchUnderlinesAnim)
  .add(boostAnim)
  .add(boostUnderlinesAnim);


/**
 * Utils
 */
function select(query) {
  return document.querySelector(query);
}

function selectAll(query) {
  return document.querySelectorAll(query);
}

function makeLabelAnim(targets, offset) {
  return {
    targets,
    opacity: [0, 1],
    easing: 'easeInSine',
    duration: 900,
    offset
  };
}

function makeLineAnim(targets, offset) {
  return {
    targets,
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutQuart',
    duration: 600,
    delay: 300,
    offset
  };
}
