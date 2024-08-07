/**
 * @file dropdown.js
 * @description Dropdown functionality for ModernLib.
 * @module components/dropdown
 */

import $ from "../core";

/**
 * Initializes dropdown functionality for selected elements.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <div class="dropdown">
 * //   <button id="dropdownButton" class="dropdown-toggle">Dropdown</button>
 * //   <div data-toggle-id="dropdownButton" class="dropdown-menu">
 * //     <a href="#">Item 1</a>
 * //     <a href="#">Item 2</a>
 * //   </div>
 * // </div>
 *
 * // Initialize dropdown
 * $('.dropdown-toggle').dropdown();
 */

$.prototype.dropdown = function () {
  for (let i = 0; i < this.length; i++) {
    const id = this[i].getAttribute("id");
    $(this[i]).click(() => {
      $(`[data-toggle-id="${id}"]`).fadeToggle(300);
    });
  }
};

$(".dropdown-toggle").dropdown();
