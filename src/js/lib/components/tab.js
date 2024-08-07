/**
 * @file tab.js
 * @description Tab functionality for ModernLib.
 * @module components/tab
 */
import $ from "../core";

/**
 * Initializes tab functionality for selected elements.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * // HTML structure
 * // <div class="tab">
 * //   <div class="tab-panel">
 * //     <div class="tab-item">Tab 1</div>
 * //     <div class="tab-item">Tab 2</div>
 * //   </div>
 * //   <div class="tab-content">Content 1</div>
 * //   <div class="tab-content">Content 2</div>
 * // </div>
 *
 * // Initialize tabs
 * $('[data-tabpanel] .tab-item').tab();
 */

$.prototype.tab = function () {
  for (let i = 0; i < this.length; i++) {
    $(this[i]).on("click", () => {
      $(this[i])
        .addClass("tab-item--active")
        .siblings()
        .removeClass("tab-item--active")
        .closest(".tab")
        .find(".tab-content")
        .removeClass("tab-content--active")
        .eq($(this[i]).index())
        .addClass("tab-content--active");
    });
  }
};

// Auto-initialize tabs
$('[data-tabpanel] .tab-item').tab();
