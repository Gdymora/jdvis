/**
 * @file jqueryLikeMethods.js
 * @description jQuery-like methods for ModernLib to enhance DOM manipulation and traversal.
 * @module modules/jqueryLikeMethods
 */

import $ from "../core";

/**
 * Gets the next sibling element.
 * @returns {Object} A new ModernLib object containing the next sibling element.
 * @example
 * const nextElement = $('#myElement').next();
 */
$.prototype.next = function () {
  return $(this[0].nextElementSibling);
};

/**
 * Gets the previous sibling element.
 * @returns {Object} A new ModernLib object containing the previous sibling element.
 * @example
 * const prevElement = $('#myElement').prev();
 */
$.prototype.prev = function () {
  return $(this[0].previousElementSibling);
};

/**
 * Gets the parent element.
 * @returns {Object} A new ModernLib object containing the parent element.
 * @example
 * const parentElement = $('#myElement').parent();
 */
$.prototype.parent = function () {
  return $(this[0].parentElement);
};

/**
 * Checks if the element matches the given selector.
 * @param {string} selector - The selector to check against.
 * @returns {boolean} True if the element matches the selector, false otherwise.
 * @example
 * if ($('#myElement').is('.active')) {
 *   console.log('Element has class "active"');
 * }
 */
$.prototype.is = function (selector) {
  return this[0].matches(selector);
};

/**
 * Gets the child elements.
 * @returns {Object} A new ModernLib object containing the child elements.
 * @example
 * const childElements = $('#myElement').children();
 */
$.prototype.children = function () {
  return $(this[0].children);
};

/**
 * Appends content to the end of each element in the set.
 * @param {(string|Node)} content - The content to append. Can be an HTML string or a DOM node.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * $('#myElement').append('<p>New content</p>');
 */
$.prototype.append = function (content) {
  if (typeof content === "string") {
    for (let i = 0; i < this.length; i++) {
      this[i].insertAdjacentHTML("beforeend", content);
    }
  } else if (content instanceof Node) {
    for (let i = 0; i < this.length; i++) {
      this[i].appendChild(content.cloneNode(true));
    }
  }
  return this;
};

/**
 * Gets or sets data attributes on the first element in the set.
 * @param {string} key - The name of the data attribute.
 * @param {*} [value] - The value to set. If omitted, gets the current value.
 * @returns {(*|Object)} The value of the data attribute if getting, or the ModernLib object for chaining if setting.
 * @example
 * // Get data
 * const value = $('#myElement').data('key');
 * // Set data
 * $('#myElement').data('key', 'value');
 */
$.prototype.data = function (key, value) {
  if (value === undefined) {
    return this[0].dataset[key];
  } else {
    for (let i = 0; i < this.length; i++) {
      this[i].dataset[key] = value;
    }
    return this;
  }
};

/**
 * Gets or sets the value of a form element.
 * @param {string} [value] - The value to set. If not provided, the method returns the current value.
 * @returns {(string|$.prototype)} The current value of the element (if value is not provided) or the $.prototype object for chaining.
 * @example
 * // Getting the value
 * const value = $('#myInput').val();
 *
 * // Setting the value
 * $('#myInput').val('New value');
 */
$.prototype.val = function (value) {
  if (value === undefined) {
    return this[0].value;
  } else {
    for (let i = 0; i < this.length; i++) {
      this[i].value = value;
    }
    return this;
  }
};

export default $;
