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
 * The method supports both camelCase and kebab-case keys.
 *
 * @param {string} key - The name of the data attribute (camelCase or kebab-case).
 * @param {*} [value] - The value to set. If omitted, gets the current value.
 * @returns {(*|Object)} The value of the data attribute if getting, or the ModernLib object for chaining if setting.
 *
 * @example
 * //  <input type="checkbox" data-role-id="${role.id}" />
 * // Get data using kebab-case
 * const value = $('#myElement').data('role-id');
 *
 * @example
 * // Get data using camelCase
 * const value = $('#myElement').data('roleId');
 *
 * @example
 * // Set data using kebab-case
 * $('#myElement').data('role-id', 'value');
 *
 * @example
 * // Set data using camelCase
 * $('#myElement').data('roleId', 'value');
 */
$.prototype.data = function (key, value) {
  const formattedKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

  if (value === undefined) {
    return this[0].dataset[formattedKey];
  } else {
    for (let i = 0; i < this.length; i++) {
      this[i].dataset[formattedKey] = value;
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

/**
 * Triggers a specified event on the first element in the set, or optionally on all elements.
 * @param {string|Event} eventName - The name of the event to trigger or an Event object.
 * @param {*} [data] - Additional data to pass along with the event. If not an object, it will be wrapped in an object with a 'value' property.
 * @param {boolean} [triggerAll=false] - Whether to trigger the event on all elements in the set.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // Triggering a simple event on the first element
 * $('#myElement').trigger('click');
 *
 * @example
 * // Triggering an event with object data on the first element
 * $('#myElement').trigger('customEvent', { foo: 'bar' });
 *
 * @example
 * // Triggering an event with a simple value
 * $('#myElement').trigger('customEvent', 'simpleValue');
 *
 * @example
 * // Triggering a custom event on all elements in the set
 * $('.myClass').trigger('myEvent', { foo: 'bar' }, true);
 *
 * @example
 * // Triggering a custom Event object
 * const event = new CustomEvent('myEvent', { detail: { foo: 'bar' } });
 * $('#myElement').trigger(event);
 *
 * @example
 * // Accessing triggered data in an event listener
 * $('#myElement').on('customEvent', function(event) {
 *   console.log(event.detail); // Access the passed data
 * });
 */
$.prototype.trigger = function (eventName, data, triggerAll = false) {
  let event;
  if (typeof eventName === "string") {
    event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail: data,
    });
  } else if (eventName instanceof Event) {
    event = eventName;
  } else {
    throw new Error("Invalid event type. Must be a string or Event object.");
  }

  if (triggerAll) {
    for (let i = 0; i < this.length; i++) {
      this[i].dispatchEvent(event);
    }
  } else if (this[0]) {
    this[0].dispatchEvent(event);
  }

  return this;
};

export default $;
