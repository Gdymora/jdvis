/**
 * @file navigation.js
 * @description Mobile navigation functionality for ModernLib.
 */

import $ from "../core";

/**
 * Initializes mobile navigation functionality.
 * Toggles the visibility of the target element when clicked.
 * @memberof $.prototype
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML: <button id="menuToggle" data-target="#menu">Menu</button>
 * $('#menuToggle').mobileNav();
 */
$.prototype.mobileNav = function () {
  this.click(function () {
    const target = $(this.getAttribute("data-target"));
    target.toggleClass("hidden");
  });
  return this;
};
