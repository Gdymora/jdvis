/**
 * @file navigation.js
 * @description Mobile navigation functionality for ModernLib.
 * @module components/navigation
 */

import $ from "../core";

/**
 * Initializes mobile navigation functionality.
 * Toggles the visibility of the target element when clicked.
 * @memberof $.prototype
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <button id="menuToggle" data-target="#mobileMenu">Menu</button>
 * // <nav id="mobileMenu" class="hidden">
 * //   <ul>
 * //     <li><a href="#">Home</a></li>
 * //     <li><a href="#">About</a></li>
 * //     <li><a href="#">Contact</a></li>
 * //   </ul>
 * // </nav>
 * 
 * // Initialize mobile navigation
 * $('#menuToggle').mobileNav();
 */
$.prototype.mobileNav = function () {
  this.click(function () {
    const target = $(this.getAttribute("data-target"));
    target.toggleClass("hidden");
  });
  return this;
};
