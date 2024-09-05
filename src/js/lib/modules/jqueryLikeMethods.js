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

/**
 * Gets the value of a property for the first element in the set of matched elements or
 * sets one or more properties for every matched element.
 * @param {string} propertyName - The name of the property to get or set.
 * @param {*} [value] - The value to set for the property. If omitted, the method returns the current value.
 * @returns {(*|Object)} The value of the property if getting, or the ModernLib object for chaining if setting.
 *
 * @example
 * // Get the checked property of a checkbox
 * const isChecked = $('#myCheckbox').prop('checked');
 *
 * @example
 * // Set the disabled property of an input
 * $('#myInput').prop('disabled', true);
 *
 * @example
 * // Get the tagName of an element
 * const tagName = $('#myElement').prop('tagName');
 *
 * @example
 * // Set multiple properties at once
 * $('.myClass').prop({
 *   disabled: false,
 *   required: true
 * });
 */
$.prototype.prop = function (propertyName, value) {
  if (typeof propertyName === "object") {
    // Setting multiple properties
    for (let key in propertyName) {
      this.prop(key, propertyName[key]);
    }
    return this;
  }

  if (value === undefined) {
    // Getting property value
    return this[0] ? this[0][propertyName] : undefined;
  } else {
    // Setting property value
    for (let i = 0; i < this.length; i++) {
      this[i][propertyName] = value;
    }
    return this;
  }
};
/**
 * Get the value of an attribute for the first element in the set of matched elements or
 * set one or more attributes for every matched element.
 * @param {string|Object} attributeName - The name of the attribute to get or set, or an object of attribute-value pairs to set.
 * @param {string} [value] - A value to set for the attribute. If omitted, the method returns the current value.
 * @returns {(string|Object)} The value of the attribute if getting, or the ModernLib object for chaining if setting.
 * @example
 * // Get an attribute
 * const href = $('#myLink').attr('href');
 *
 * @example
 * // Set an attribute
 * $('#myImage').attr('src', 'image.jpg');
 *
 * @example
 * // Set multiple attributes
 * $('#myElement').attr({
 *   'data-id': '123',
 *   'aria-label': 'My Element'
 * });
 */
$.prototype.attr = function (attributeName, value) {
  if (typeof attributeName === "object") {
    // Setting multiple attributes
    for (let key in attributeName) {
      this.attr(key, attributeName[key]);
    }
    return this;
  }

  if (value === undefined) {
    // Getting attribute value
    return this[0] ? this[0].getAttribute(attributeName) : undefined;
  } else {
    // Setting attribute value
    for (let i = 0; i < this.length; i++) {
      this[i].setAttribute(attributeName, value);
    }
    return this;
  }
};

/**
 * Bind one or two handlers to the matched elements, to be executed when the mouse pointer enters and leaves the elements.
 * @param {Function} handlerIn - A function to execute when the mouse pointer enters the element.
 * @param {Function} [handlerOut] - A function to execute when the mouse pointer leaves the element.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // Using hover with two separate handlers
 * $('#myElement').hover(
 *   function() { console.log('Mouse entered'); },
 *   function() { console.log('Mouse left'); }
 * );
 *
 * @example
 * // Using hover with a single handler for both events
 * $('#myElement').hover(function() {
 *   console.log('Mouse entered or left');
 * });
 */
$.prototype.hover = function (handlerIn, handlerOut) {
  if (typeof handlerIn !== "function") {
    throw new Error("At least one function must be provided to hover()");
  }

  if (typeof handlerOut !== "function") {
    // If only one handler provided, use it for both mouseenter and mouseleave
    handlerOut = handlerIn;
  }

  return this.on("mouseenter", handlerIn).on("mouseleave", handlerOut);
};

/**
 * Remove the set of matched elements from the DOM.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // Remove all paragraphs from the document
 * $('p').remove();
 *
 * @example
 * // Remove all elements with a specific class
 * $('.myClass').remove();
 */
$.prototype.remove = function () {
  for (let i = 0; i < this.length; i++) {
    if (this[i].parentNode) {
      this[i].parentNode.removeChild(this[i]);
    }
  }
  return this;
};

$.prototype.offset = function () {
  if (!this[0]) return null;

  const rect = this[0].getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
  };
};

/**
 * Get the value of a computed style property for the first element in the set of matched elements
 * or set one or more CSS properties for every matched element.
 * @param {(string|Object)} property - A CSS property name or an object of property-value pairs to set.
 * @param {string} [value] - A value to set for the property.
 * @returns {(string|Object)} The value of the property if getting, or the ModernLib object for chaining if setting.
 * @example
 * // Get a style property
 * const color = $('div').css('color');
 *
 * // Set a style property
 * $('div').css('color', 'red');
 *
 * // Set multiple style properties
 * $('div').css({
 *   color: 'red',
 *   backgroundColor: 'black'
 * });
 */
$.prototype.css = function (property, value) {
  if (typeof property === "string") {
    if (value === undefined) {
      // Getting the value
      const element = this[0];
      return element ? getComputedStyle(element)[property] : undefined;
    } else {
      // Setting a single property
      this.each((element) => {
        element.style[property] = value;
      });
    }
  } else if (typeof property === "object") {
    // Setting multiple properties
    this.each((element) => {
      Object.assign(element.style, property);
    });
  }
  return this;
};

/**
 * Display the matched elements.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * $('div').show();
 */
$.prototype.show = function () {
  return this.css("display", "");
};

/**
 * Hide the matched elements.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * $('div').hide();
 */
$.prototype.hide = function () {
  return this.css("display", "none");
};

/**
 * Ітерує через кожен елемент у колекції і виконує функцію зворотного виклику.
 *
 * @param {function(this:Element, Element, number, Element[])} callback - Функція, яка виконується для кожного елемента.
 *   Вона отримує поточний елемент, індекс та всю колекцію як аргументи.
 * @returns {Object} Поточний об'єкт для ланцюжка викликів.
 * @example
 * $('div').each(function(element, index) {
 *   console.log(`Div ${index}:`, element.textContent);
 * });
 */
$.prototype.each = function (callback) {
  for (let i = 0; i < this.length; i++) {
    callback.call(this[i], this[i], i, this);
  }
  return this;
};

/**
 * Створює новий об'єкт з результатами виклику наданої функції для кожного елемента колекції.
 *
 * @param {function(this:Element, Element, number): *} callback - Функція, яка виробляє елемент нового об'єкту.
 * @returns {Object} Новий об'єкт з результатами мапінгу.
 * @example
 * const values = $('input[name="role_permissions"]:checked').map(function() {
 *   return this.value;
 * });
 */
$.prototype.map = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    const mappedValue = callback.call(this[i], this[i], i);
    if (mappedValue != null) {
      // Пропускаємо null і undefined, як це робить jQuery
      result.push(mappedValue);
    }
  }
  return $(result); // Повертаємо новий об'єкт $
};

/**
 * Отримує елементи колекції у вигляді масиву або окремий елемент за індексом.
 *
 * @param {number} [index] - Якщо вказано, повертає елемент за цим індексом.
 * @returns {Array|*} Масив елементів або окремий елемент, якщо вказано індекс.
 * @example
 * // Отримати всі значення
 * const allValues = $('input[name="role_permissions"]:checked')
 *   .map(function() { return this.value; })
 *   .getElements();
 *
 * // Отримати перше значення
 * const firstValue = $('input[name="role_permissions"]:checked')
 *   .map(function() { return this.value; })
 *   .getElements(0);
 */
$.prototype.getElements = function (index) {
  if (index != null) {
    return index < 0 ? this[this.length + index] : this[index];
  }
  return Array.prototype.slice.call(this)[0];
};

export default $;
