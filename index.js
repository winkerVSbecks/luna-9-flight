const canvas = select('#js-scene');
const sunrays = selectAll('.js-sunray');
const title = selectAll('#js-title');
const theRest = selectAll('#js-everything-except-title');


/**
 * Audio
 */
 const audio = {
  bg: new Howl({ src: ['audio/bg.mp3'], volume: 0.75 }),
  wind: new Howl({ src: ['audio/arctic-wind.wav'], rate: 0.25 }),
  launch: new Howl({ src: ['audio/white-noise.wav'], rate: 0.3 }),
  boost: new Howl({ src: ['audio/scan.wav'], volume: 0.75, rate: 1.25 }),
  correction: new Howl({ src: ['audio/white-noise.wav'] }),
  land: new Howl({ src: ['audio/bell.wav'], rate: 0.5, volume: 0.5 }),
};


/**
 * Timestamps
 */
const time = {
  fadeInTitle: 2000,
  fadeInRest: '-=800',
  probe: 5000,
  launch: 5400,
  boost: 17800,
  correction: 20700,
  landing: 31600,
  fadeOut: 34000,
};


/**
 * Scene
 */
const scene = {
  fadeInScene: {
    targets: canvas,
    opacity: [0, 1],
    easing: 'easeInOutQuint',
    duration: 1,
  },
  fadeInTitle: {
    targets: title,
    opacity: [0, 1],
    easing: 'easeInOutQuint',
    duration: 800,
    offset: time.fadeInTitle,
  },
  fadeInRest: {
    targets: theRest,
    opacity: [0, 1],
    translateY: {
      value: ['25%', 0],
      easing: 'easeOutSine',
    },
    easing: 'easeInOutQuint',
    duration: 800,
    offset: time.fadeInRest,
  },
  fadeOut: {
    targets: canvas,
    opacity: [1, 0],
    easing: 'easeInOutQuint',
    duration: 1000,
    offset: time.fadeOut,
  },
};


/**
 * Space Probe
 */
const spaceProbe = select('#js-space-probe');
const path = anime.path('#js-motion-path');

const motionPath = {
  targets: spaceProbe,
  translateX: path('x'),
  translateY: path('y'),
  easing: 'easeInOutQuint',
  duration: 30000,
  offset: time.probe,
  autoplay: false,
};


/**
 * Launch Label
 */
const launchLabels = selectAll('#js-launch-label .text');
const launchLabelUnderlines = selectAll('#js-launch-label .underline');
const launchAnim = makeFadeInAnim(launchLabels, time.launch);
const launchUnderlinesAnim = makeLineAnim(launchLabelUnderlines, time.launch);


/**
 * Boost Label
 */
const boostLabels = selectAll('#js-boost-label .text');
const boostLabelUnderlines = selectAll('#js-boost-label .underline');
const boostAnim = makeFadeInAnim(boostLabels, time.boost);
const boostUnderlinesAnim = makeLineAnim(boostLabelUnderlines, time.boost);


/**
 * Timeline
 */
const sceneTimeline = anime.timeline({
  loop: true,
  autoplay: false,
  begin: audioTimeline,
});

sceneTimeline
  .add(scene.fadeInScene)
  .add(scene.fadeInTitle)
  .add(scene.fadeInRest)
  .add(motionPath)
  .add(launchAnim)
  .add(launchUnderlinesAnim)
  .add(boostAnim)
  .add(boostUnderlinesAnim)
  .add(scene.fadeOut);


function audioTimeline() {
  setTimeout(() => audio.bg.play(), 1500);
  setTimeout(() => audio.wind.play(), time.fadeInTitle);
  setTimeout(() => audio.launch.play(), time.launch);
  setTimeout(() => audio.launch.fade(1, 0, 1000), time.launch + 7000);
  setTimeout(() => audio.boost.play(), time.boost);
  setTimeout(() => audio.correction.play(), time.correction);
  setTimeout(() => audio.correction.fade(1, 0, 600), time.correction + 1000);
  setTimeout(() => audio.bg.fade(0.5, 0, 1000), time.landing);
  setTimeout(() => audio.land.play(), time.landing);
}


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
 * Init
 */
window.onload = function() {
  sceneTimeline.play();
};

/**
 * Utils
 */
function select(query) {
  return document.querySelector(query);
}

function selectAll(query) {
  return document.querySelectorAll(query);
}

function makeFadeInAnim(targets, offset) {
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
