'use strict';

/*
 * Swipe 2.0.0
 * Brad Birdsall
 * https://github.com/thebird/Swipe
 * Copyright 2013-2015, MIT License
 *
*/

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Swipe = factory();
  }
})(undefined, function () {
  'use strict';

  return function Swipe(container, options) {
    // utilities
    var noop = function noop() {}; // simple no operation function
    var offloadFn = function offloadFn(fn) {
      setTimeout(fn || noop, 0);
    }; // offload a functions execution

    function makeid() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }return text;
    }

    // quit if no root element
    if (!container) {
      return;
    }
    var element = container.children[0];
    var slides;
    var browser = { transitions: true, addEventListener: true };

    options = options || {};
    var index = 0;
    var slideSpeed = 0;
    var speed = options.speed || 2000;
    var minSpeed = options.minSpeed || 20;
    var height = options.height || 0;
    var delay = options.auto || 0;
    var awaitEnd = -1;
    var id = makeid();
    var awaitingTransitionEnd = new Set();

    function _setup() {
      // cache slides
      index = 0;
      slideSpeed = 0;
      slides = element.children;

      // determine width of each slide
      height = height || slides[0].getBoundingClientRect().height;

      element.style.height = slides.length * height + 'px';

      // stack elements
      var pos = slides.length;

      while (pos--) {
        var slide = slides[pos];

        slide.style.height = height + 'px';
        slide.setAttribute('data-index', id + '-' + pos);

        // slide.style.top = (height) + 'px';
        move(pos, height * pos, 0);
      }

      container.style.visibility = 'visible';
    }

    function next() {
      slide(index);
    }

    function slide(to) {
      move(to, -height, slideSpeed || speed);
      awaitingTransitionEnd.add(to);
      var count = slides.length;
      for (var i = 1; i < count; i++) {
        awaitingTransitionEnd.add(circle(to + i));
        move(circle(to + i), height * (i - 1), slideSpeed || speed);
      }
      offloadFn(options.callback && options.callback(index, slides[index]));
    }

    function circle(index) {
      // a simple positive modulo using slides.length
      return (slides.length + index % slides.length) % slides.length;
    }

    function move(to, dist, speed) {
      // console.log("to: " + to + " dist: " + dist)
      translate(to, dist, speed);
      // slidePos[index] = dist;
    }

    function translate(to, dist, speed) {
      var slide = element.children[circle(to - index)];
      var style = slide && slide.style;

      if (!style) {
        return;
      }

      // console.log(to + "," + index)
      if (circle(to - index) != circle(-1)) {
        style.webkitTransitionDuration = speed + 'ms';
        style.MozTransitionDuration = speed + 'ms';
        style.msTransitionDuration = speed + 'ms';
        style.OTransitionDuration = speed + 'ms';
        style.transitionDuration = speed + 'ms';
      } else {
        // console.log(to);
        awaitingTransitionEnd.delete(to);
        style.webkitTransitionDuration = 0 + 'ms';
        style.MozTransitionDuration = 0 + 'ms';
        style.msTransitionDuration = 0 + 'ms';
        style.OTransitionDuration = 0 + 'ms';
        style.transitionDuration = 0 + 'ms';
      }
      style.webkitTransform = 'translate3d(0, ' + dist + 'px, 0)';
      // style.webkitTransform = 'translate3d(0, ' + dist + ' px, 0)';
      // style.top = dist + 'px';
    }

    // setup auto slideshow
    var interval;

    function _begin() {
      clearTimeout(interval);
      interval = setTimeout(next, delay);
    }

    function _stop() {
      delay = 0;
      clearTimeout(interval);
    }

    // setup event capturing
    var events = {
      handleEvent: function handleEvent(event) {
        switch (event.type) {
          case 'webkitTransitionEnd':
          case 'msTransitionEnd':
          case 'oTransitionEnd':
          case 'otransitionend':
          case 'transitionend':
            offloadFn(this.transitionEnd(event));break;
          case 'resize':
            offloadFn(function () {
              // stop();
              _setup();
              delay && _begin();
            });break;
          default:
            break;
        }
      },
      transitionEnd: function transitionEnd(event) {
        var evtTgt = event.target.getAttribute('data-index').split('-');
        if (evtTgt[0] == id) {
          awaitingTransitionEnd.delete(parseInt(evtTgt[1], 10));
          // console.log(awaitingTransitionEnd)
          if (awaitingTransitionEnd.size == 0) {
            var prev = element.children[0];

            // prev.style.top = height + 'px';
            // prev.style.webkitTransform = 'translate3d(0, ' + height + 'px, 0';
            element.append(prev);
            index = circle(index + 1);
            if (delay) {
              _begin();
            }
          }
        }
      }
    };

    // trigger setup
    _setup();

    // start auto slideshow if applicable
    if (delay) {
      setTimeout(_begin, delay);
    }

    // add event listeners
    if (browser.addEventListener) {
      // set resize event on window
      window.addEventListener('resize', events, false);
    }

    if (browser.transitions) {
      element.addEventListener('webkitTransitionEnd', events, false);
      element.addEventListener('msTransitionEnd', events, false);
      element.addEventListener('oTransitionEnd', events, false);
      element.addEventListener('otransitionend', events, false);
      element.addEventListener('transitionend', events, false);
    }

    // expose the Swipe API
    return {
      setup: function setup() {
        _setup();
      },
      begin: function begin(auto) {
        delay = auto === undefined ? options.auto || 0 : auto;
        delay && _begin();
      },
      stop: function stop() {
        // stop auto scroll
        _stop();
      },
      updateSpeed: function updateSpeed(msec) {
        var set = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (set) {
          slideSpeed = msec > minSpeed ? msec : minSpeed;
          console.log('==update speed==', slideSpeed);

          return;
        }
        if (!slideSpeed) {
          slideSpeed = speed;
        }
        if (slideSpeed + msec > minSpeed) {
          slideSpeed = slideSpeed + msec;
        } else {
          slideSpeed = minSpeed;
        }
        console.log('==update speed==', slideSpeed);
      },
      kill: function kill() {
        // cancel slideshow
        _stop();
        // reset element
        element.style.height = '';
        // element.style.top = '';
        element.style.webkitTransform = '';
        slideSpeed = 0;
        // reset slides
        var pos = slides.length;

        while (pos--) {
          var slide = slides[pos];

          slide.style.height = '';
          slide.style.top = '';
          slide.style.webkitTransform = '';
          // if (browser.transitions) {
          //   translate(pos, 0, 0);
          // }
        }
        // removed event listeners
        if (browser.addEventListener) {
          // remove current event listeners
          element.removeEventListener('webkitTransitionEnd', events, false);
          element.removeEventListener('msTransitionEnd', events, false);
          element.removeEventListener('oTransitionEnd', events, false);
          element.removeEventListener('otransitionend', events, false);
          element.removeEventListener('transitionend', events, false);
          window.removeEventListener('resize', events, false);
        }
      }
    };
  };
});