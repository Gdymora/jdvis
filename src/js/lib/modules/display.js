/**
 * @file display.js
 * @description Display manipulation methods for ModernLib.
 * @module modules/display
 */
import $ from "../core";

/**
 * Shows the selected elements by setting their display property to an empty string.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.show = function () {
  for (let i = 0; i < this.length; i++) {
    if (!this[i].style) {
      continue;
    }
    this[i].style.display = "";
  }
  return this;
};

/**
 * Hides the selected elements by setting their display property to 'none'.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.hide = function () {
  for (let i = 0; i < this.length; i++) {
    if (!this[i].style) {
      continue;
    }
    this[i].style.display = "none";
  }
  return this;
};

/**
 * Toggles the visibility of the selected elements.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.toggle = function () {
  for (let i = 0; i < this.length; i++) {
    if (!this[i].style) {
      continue;
    }
    if (this[i].style.display === "none") {
      this[i].style.display = "";
    } else {
      this[i].style.display = "none";
    }
  }
  return this;
};
