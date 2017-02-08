'use strict';

function init() {
  /**
   * Animate sunrays
   */
  var sunrays = selectAll('.js-sunray');
  var sunraysTimeline = anime.timeline({ loop: true });

  var sunrayAnimPart1 = anime({
    targets: sunrays,
    strokeDashoffset: [anime.setDashoffset, 0],
    delay: function delay(_, idx) {
      return idx * 60;
    },
    duration: 800,
    easing: 'easeOutExpo',
    autoPlay: false,
    complete: function complete() {
      return sunrayAnimPart2.play();
    }
  });
  sunrayAnimPart1.pause();

  var sunrayAnimPart2 = anime({
    targets: sunrays,
    strokeDashoffset: [0, function (el) {
      return -1 * anime.setDashoffset(el);
    }],
    delay: function delay(_, idx) {
      return idx * 60;
    },
    duration: 800,
    easing: 'easeInExpo',
    complete: function complete() {
      return sunrayAnimPart1.play();
    }
  });

  /**
   * Audio
   */
  var audio = {
    bg: new Howl({ src: ['audio/bg.mp3'], volume: 0.75 }),
    wind: new Howl({ src: ['audio/arctic-wind.wav'], rate: 0.25 }),
    launch: new Howl({ src: ['audio/white-noise.wav'], rate: 0.3 }),
    boost: new Howl({ src: ['audio/scan.wav'], volume: 0.75, rate: 1.25 }),
    correction: new Howl({ src: ['audio/white-noise.wav'] }),
    land: new Howl({ src: ['audio/bell.wav'], rate: 0.5, volume: 0.5 })
  };

  /**
   * Timestamps
   */
  var time = {
    fadeInTitle: 2000,
    fadeInRest: '-=800',
    probe: 5000,
    launch: 5400,
    boost: 17800,
    correction: 20400,
    landing: 31600,
    fadeOut: 38000
  };

  /**
   * Scene
   */
  var canvas = select('#js-scene');
  var title = selectAll('#js-title');
  var theRest = selectAll('#js-everything-except-title');

  var scene = {
    fadeInScene: {
      targets: canvas,
      opacity: [0, 1],
      easing: 'easeInOutQuint',
      duration: 1
    },
    fadeInTitle: {
      targets: title,
      opacity: [0, 1],
      easing: 'easeInOutQuint',
      duration: 800,
      offset: time.fadeInTitle
    },
    fadeInRest: makeFadeInUpAnim(theRest, time.fadeInRest),
    fadeOut: {
      targets: canvas,
      opacity: [1, 0],
      easing: 'easeInOutQuint',
      duration: 1000,
      offset: time.fadeOut
    }
  };

  /**
   * Space Probe
   */
  var spaceProbe = select('#js-space-probe');
  var path = anime.path('#js-motion-path');

  var motionPath = {
    targets: spaceProbe,
    translateX: path('x'),
    translateY: path('y'),
    easing: 'easeInOutQuint',
    duration: 30000,
    offset: time.probe
  };

  var motionTrail = {
    targets: select('#js-motion-path'),
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutQuint',
    duration: 30000,
    offset: time.probe
  };

  /**
   * Labels
   */
  // Launch
  var launchLabels = selectAll('#js-launch-label .text');
  var launchLabelUnderlines = selectAll('#js-launch-label .underline');
  var launchAnim = makeFadeInAnim(launchLabels, time.launch);
  var launchUnderlinesAnim = makeLineAnim(launchLabelUnderlines, time.launch);
  // Boost
  var boostLabels = selectAll('#js-boost-label .text');
  var boostLabelUnderlines = selectAll('#js-boost-label .underline');
  var boostAnim = makeFadeInAnim(boostLabels, time.boost);
  var boostUnderlinesAnim = makeLineAnim(boostLabelUnderlines, time.boost);
  // Correction
  var correctionLabel = select('#js-correction-label');
  var correctionAnim = makeFadeInUpAnim(correctionLabel, time.correction);
  // Landing
  var landingLabel = select('#js-landing-label');
  var landingAnim = makeFadeInUpAnim(landingLabel, time.landing);

  /**
   * Timeline
   */
  function audioTimeline() {
    setTimeout(function () {
      audio.bg.stop();
      audio.bg.volume(0.75);
      audio.bg.play();
    }, 1500);
    setTimeout(function () {
      return audio.wind.play();
    }, time.fadeInTitle);
    setTimeout(function () {
      audio.launch.stop();
      audio.launch.volume(1);
      audio.launch.play();
    }, time.launch);
    setTimeout(function () {
      return audio.launch.fade(1, 0, 1000);
    }, time.launch + 7000);
    setTimeout(function () {
      return audio.boost.play();
    }, time.boost);
    setTimeout(function () {
      audio.correction.stop();
      audio.correction.volume(1);
      audio.correction.play();
    }, time.correction);
    setTimeout(function () {
      return audio.correction.fade(1, 0, 600);
    }, time.correction + 1000);
    setTimeout(function () {
      return audio.bg.fade(0.5, 0, 1000);
    }, time.landing);
    setTimeout(function () {
      return audio.land.play();
    }, time.landing);
  }

  var sceneTimeline = anime.timeline({
    autoplay: false,
    begin: audioTimeline,
    complete: startScene
  });

  sceneTimeline.add(scene.fadeInScene).add(scene.fadeInTitle).add(scene.fadeInRest).add(motionPath)
  // .add(motionTrail)
  .add(launchAnim).add(launchUnderlinesAnim).add(boostAnim).add(boostUnderlinesAnim).add(correctionAnim).add(landingAnim).add(scene.fadeOut);

  /**
   * Init
   */
  function startScene() {
    sceneTimeline.restart();
  };
  startScene();

  /**
   * Audio Control
   */
  var muteButton = select('#js-speaker');
  var soundWaves = select('#js-sound');
  var isMute = false;
  muteButton.onclick = function toggleSound() {
    isMute = !isMute;
    Howler.mute(isMute);
    muteButton.style.color = isMute ? '#777' : '#fff';
    soundWaves.style.visibility = isMute ? 'hidden' : 'visible';
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
      targets: targets,
      opacity: [0, 1],
      easing: 'easeInSine',
      duration: 900,
      offset: offset
    };
  }

  function makeLineAnim(targets, offset) {
    return {
      targets: targets,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutQuart',
      duration: 600,
      delay: 300,
      offset: offset
    };
  }

  function makeFadeInUpAnim(targets, offset) {
    return {
      targets: targets,
      opacity: [0, 1],
      translateY: {
        value: ['25%', 0],
        easing: 'easeOutSine'
      },
      easing: 'easeInOutQuint',
      duration: 800,
      offset: offset
    };
  }
}

window.onload = init;
