/**
 * @file accordion.js
 * @description Accordion functionality for ModernLib.
 * @module components/accordion
 */

import $ from "../core";

/**
 * Initializes accordion functionality for selected elements.
 * @param {string} [headActive='accordion-head--active'] - Class name for active accordion header.
 * @param {string} [contentActive='accordion-content--active'] - Class name for active accordion content.
 * @param {number} [paddings=40] - Additional padding for content height calculation.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <div class="accordion">
 * //   <div class="accordion-head">Section 1</div>
 * //   <div class="accordion-content">Content for section 1</div>
 * //   <div class="accordion-head">Section 2</div>
 * //   <div class="accordion-content">Content for section 2</div>
 * // </div>
 *
 * // Initialize accordion with default settings
 * $('.accordion-head').accordion();
 *
 * // Initialize accordion with custom settings
 * $('.accordion-head').accordion('custom-active-head', 'custom-active-content', 50);
 */

$.prototype.accordion = function (headActive = "accordion-head--active", contentActive = "accordion-content--active", paddings = 40) {
  for (let i = 0; i < this.length; i++) {
    $(this[i]).click(() => {
      $(this[i]).toggleClass(headActive);
      $(this[i].nextElementSibling).toggleClass(contentActive);

      if (this[i].classList.contains(headActive)) {
        this[i].nextElementSibling.style.maxHeight = this[i].nextElementSibling.scrollHeight + paddings + "px";
      } else {
        this[i].nextElementSibling.style.maxHeight = "0px";
      }
    });
  }
};

$(".accordion-head").accordion();
