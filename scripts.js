"use strict";

window.onload = function () {
  var randomLetter = function randomLetter() {
    return Math.random().toString(36).slice(2, 3);
  };

  var letters = document.getElementById("js-letter").innerHTML;
  letters = letters.toLowerCase();
  var element = document.getElementById("js-letter");

  var output = document.getElementById("js-letter").innerHTML;

  output = output.split("");

  // init letters
  for (var _i = 0; _i < letters.length; _i++) {
    if (letters[_i] == " ") {
      output[_i] = " ";
    } else {
      output[_i] = randomLetter();
    }
  }

  // add styles
  // element.style.transition = 'letter-spacing 300ms ease-in-out';
  // element.style.letterSpacing = '0.1em';

  // set interval
  var i = 0;
  var cd = setInterval(function () {
    if (output[i] != letters[i]) {
      for (var __i = i; __i < letters.length; __i++) {
        if (letters[__i] == " ") {
          output[__i] = " ";
        } else {
          output[__i] = randomLetter();
        }
      }
    } else {
      i++;
    }

    element.innerHTML = output.join("");

    if (element.innerHTML == letters) {
      console.log("letter countdown done");
      // element.style.letterSpacing = '0.4em';
      // element.innerHTML += '.';
      clearInterval(cd);
    }
  }, 5);

  /* jQuery-like query selector */
  var $ = function (selector) {
    return document.querySelectorAll(selector);
  };

  /* aria */
  $("p:nth-of-type(1)")[0].onclick = function () {};

  $("p:nth-of-type(1) a").forEach(function (e, index) {
    e.setAttribute("aria-label", $("span")[index].innerHTML);
    e.onmouseover = function () {
      $("span")[index].setAttribute("aria-hidden", false);
    };
    e.onmouseleave = function () {
      $("span")[index].setAttribute("aria-hidden", true);
    };
  });

  /* menu */
  var container = $(".container");
  $("input[type=checkbox]")[0].onchange = function () {
    for (var item of container) {
      item.classList.toggle("nav-menu--open");
    }
    // Array.prototype.forEach.call($('.container'), function(e){
    // 	e.classList.toggle('nav-menu--open');
    // });
    $("ul")[0].setAttribute("aria-expanded", this.checked);
  };
  $("ul li a").forEach(function (e) {
    e.onclick = function () {
      // Array.prototype.forEach.call($('.container'), function(e){
      // 	e.classList.toggle('nav-menu--open');
      // });
      for (var item of container) {
        item.classList.toggle("nav-menu--open");
      }
      $("input[type=checkbox]")[0].checked = false;
    };
  });

  /* go-to-top scrolling */
  var gototop = $(".gototop")[0];
  var scrolling = function () {
    var y = window.scrollY;
    if (y > 500) {
      gototop.style.cursor = "pointer";
      gototop.style.opacity = 1;
    } else {
      gototop.style.cursor = "default";
      gototop.style.opacity = 0;
    }
  };
  gototop.onclick = function () {
    // window.scroll(0,0);
  };
  window.addEventListener("scroll", scrolling);

  /* smooth scrolling */
  /* found at:
				https://www.sitepoint.com/smooth-scrolling-vanilla-javascript/
					*/
  initSmoothScrolling();

  function initSmoothScrolling() {
    if (isCssSmoothSCrollSupported()) {
      document.getElementById("css-support-msg").className = "supported";
      return;
    }

    var duration = 400;

    var pageUrl = location.hash ? stripHash(location.href) : location.href;

    delegatedLinkHijacking();
    //directLinkHijacking();

    function delegatedLinkHijacking() {
      document.body.addEventListener("click", onClick, false);

      function onClick(e) {
        if (!isInPageLink(e.target)) return;

        e.stopPropagation();
        e.preventDefault();

        jump(e.target.hash, {
          duration: duration,
          callback: function () {
            setFocus(e.target.hash);
          },
        });
      }
    }

    function directLinkHijacking() {
      [].slice
        .call(document.querySelectorAll("a"))
        .filter(isInPageLink)
        .forEach(function (a) {
          a.addEventListener("click", onClick, false);
        });

      function onClick(e) {
        e.stopPropagation();
        e.preventDefault();

        jump(e.target.hash, {
          duration: duration,
        });
      }
    }

    function isInPageLink(n) {
      return (
        n.tagName.toLowerCase() === "a" &&
        n.hash.length > 0 &&
        stripHash(n.href) === pageUrl
      );
    }

    function stripHash(url) {
      return url.slice(0, url.lastIndexOf("#"));
    }

    function isCssSmoothSCrollSupported() {
      return "scrollBehavior" in document.documentElement.style;
    }

    // Adapted from:
    // https://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
    function setFocus(hash) {
      var element = document.getElementById(hash.substring(1));

      if (element) {
        if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
          element.tabIndex = -1;
        }

        element.focus();
      }
    }
  }

  function jump(target, options) {
    var start = window.pageYOffset,
      opt = {
        duration: options.duration,
        offset: options.offset || 0,
        callback: options.callback,
        easing: options.easing || easeInOutQuad,
      },
      distance =
        typeof target === "string"
          ? opt.offset +
            document.querySelector(target).getBoundingClientRect().top
          : target,
      duration =
        typeof opt.duration === "function"
          ? opt.duration(distance)
          : opt.duration,
      timeStart,
      timeElapsed;

    requestAnimationFrame(function (time) {
      timeStart = time;
      loop(time);
    });

    function loop(time) {
      timeElapsed = time - timeStart;

      window.scrollTo(0, opt.easing(timeElapsed, start, distance, duration));

      if (timeElapsed < duration) requestAnimationFrame(loop);
      else end();
    }

    function end() {
      window.scrollTo(0, start + distance);

      if (typeof opt.callback === "function") opt.callback();
    }

    // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }
  }
};
