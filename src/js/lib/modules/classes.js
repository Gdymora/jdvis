/**
 * @file classes.js
 * @description CSS class manipulation methods for ModernLib.
 * @module modules/classes
 */
import $ from "../core";
// https://www.w3schools.com/jsref/prop_element_classlist.asp

/**
 * Adds one or more classes to the selected elements.
 * @param {...string} classNames - The class names to add.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.addClass = function (...classNames) {
  for (let i = 0; i < this.length; i++) {
    if (!this[i].classList) {
      continue;
    }
    this[i].classList.add(...classNames);
  }
  return this;
};

/**
 * Removes one or more classes from the selected elements.
 * @param {...string} classNames - The class names to remove.
 * @returns {Object} The ModernLib object for chaining.
 */
$.prototype.removeClass = function (...classNames) {
  for (let i = 0; i < this.length; i++) {
    this[i].classList.remove(...classNames);
  }
  return this;
};

/**
 * Toggles a class on the selected elements.
 * @param {string} classNames - The class name to toggle.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.toggleClass = function (classNames) {
  for (let i = 0; i < this.length; i++) {
    this[i].classList.toggle(classNames);
  }
  return this;
};

/**
 * Checks if the element has the specified class.
 * @param {string} className - The name of the class to check.
 * @returns {boolean} true if the element has the specified class, false otherwise.
 * @example
 * if ($('#myElement').hasClass('active')) {
 *   console.log('Element has class "active"');
 * }
 */
$.prototype.hasClass = function (className) {
  return this[0].classList.contains(className);
};
