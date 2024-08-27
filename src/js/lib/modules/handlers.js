/**
 * @file handlers.js
 * @description Event handling methods for ModernLib.
 * @module modules/handlers
 */

import $ from "../core";

/**
 * Attaches an event listener to each element in the collection.
 * @param {string} eventName - The name of the event to listen for.
 * @param {Function} callback - The function to execute when the event occurs.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.on = function (eventName, callback) {
  if (!eventName || !callback) {
    return this;
  }

  for (let i = 0; i < this.length; i++) {
    this[i].addEventListener(eventName, callback);
  }
  return this;
};

/**
 * Removes an event listener from each element in the collection.
 * @param {string} eventName - The name of the event to remove.
 * @param {Function} callback - The function to remove from the event.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.off = function (eventName, callback) {
  if (!eventName || !callback) {
    return this;
  }

  for (let i = 0; i < this.length; i++) {
    this[i].removeEventListener(eventName, callback);
  }
  return this;
};

/**
 * Attaches a click event handler or triggers a click event on each element.
 * @param {Function} [handler] - The function to execute on click event.
 * @returns {Object} The ModernLib object for chaining.
 */

$.prototype.click = function (handler) {
  for (let i = 0; i < this.length; i++) {
    if (handler) {
      this[i].addEventListener("click", handler);
    } else {
      this[i].click();
    }
  }
  return this;
};

/**
 * Attaches a change event handler to each element in the collection.
 * @param {Function} callback - The function to execute when the change event occurs.
 * @returns {Object} The ModernLib object for chaining.
 */
$.prototype.change = function (callback) {
  if (!callback) {
    return this;
  }

  for (let i = 0; i < this.length; i++) {
    this[i].addEventListener("change", callback);
  }
  return this;
};

/**
 * Maps each element in the collection through a transformation function.
 * @param {Function} callback - Function that produces an element of the new collection.
 * @param {*} [thisArg] - Value to use as `this` when executing callback.
 * @returns {Object} A new ModernLib object with the results of calling the provided function for every element.
 */
$.prototype.map = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const results = [];
  const len = this.length;

  for (let i = 0; i < len; i++) {
    if (i in this) {
      results.push(callback.call(thisArg, this[i], i, this));
    }
  }

  return $(results);
};
