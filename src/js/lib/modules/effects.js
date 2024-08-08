/**
 * @file effects.js
 * @description Animation and visual effects methods for ModernLib.
 * @module modules/effects
 */

import $ from "../core";

/**
 * Creates an animation function that runs over a specified duration.
 * @param {number} dur - The duration of the animation in milliseconds.
 * @param {Function} cb - The callback function to run on each animation frame.
 * @param {Function} [fin] - The function to run when the animation is complete.
 * @returns {Function} The animation function.
 */

$.prototype.animateOverTime = function (dur, cb, fin) {
  let timeStart;

  function _animateOverTime(time) {
    if (!timeStart) {
      timeStart = time;
    }

    let timeElapsed = time - timeStart;
    let complection = Math.min(timeElapsed / dur, 1);

    cb(complection);

    if (timeElapsed < dur) {
      requestAnimationFrame(_animateOverTime);
    } else {
      if (typeof fin === "function") {
        fin();
      }
    }
  }

  return _animateOverTime;
};

/**
 * Fades in the selected elements.
 * @param {number} dur - The duration of the fade in milliseconds.
 * @param {string} [display='block'] - The display property to set when fading in.
 * @param {Function} [fin] - The function to run when the fade is complete.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.fadeIn = function (dur, display, fin) {
  for (let i = 0; i < this.length; i++) {
    this[i].style.display = display || "block";

    const _fadeIn = (complection) => {
      this[i].style.opacity = complection;
    };

    const ani = this.animateOverTime(dur, _fadeIn, fin);
    requestAnimationFrame(ani);
  }

  return this;
};

/**
 * Fades out the selected elements.
 * @param {number} dur - The duration of the fade in milliseconds.
 * @param {Function} [fin] - The function to run when the fade is complete.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.fadeOut = function (dur, fin) {
  for (let i = 0; i < this.length; i++) {
    const _fadeOut = (complection) => {
      this[i].style.opacity = 1 - complection;
      if (complection === 1) {
        this[i].style.display = "none";
      }
    };

    const ani = this.animateOverTime(dur, _fadeOut, fin);
    requestAnimationFrame(ani);
  }

  return this;
};

/**
 * Toggles the visibility of the selected elements with a fade effect.
 * @param {number} dur - The duration of the fade in milliseconds.
 * @param {string} [display='block'] - The display property to set when fading in.
 * @param {Function} [fin] - The function to run when the fade is complete.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.fadeToggle = function (dur, display, fin) {
  for (let i = 0; i < this.length; i++) {
    if (window.getComputedStyle(this[i]).display === "none") {
      this[i].style.display = display || "block";

      const _fadeIn = (complection) => {
        this[i].style.opacity = complection;
      };

      const ani = this.animateOverTime(dur, _fadeIn, fin);
      requestAnimationFrame(ani);
    } else {
      const _fadeOut = (complection) => {
        this[i].style.opacity = 1 - complection;
        if (complection === 1) {
          this[i].style.display = "none";
        }
      };

      const ani = this.animateOverTime(dur, _fadeOut, fin);
      requestAnimationFrame(ani);
    }
  }

  return this;
};
