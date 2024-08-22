/**
 * @file notification.js
 * @module components/notification
 */

import $ from "../core";

/**
 * Creates a notification component.
 * @param {Object} options - Configuration options for the notification component.
 * @param {string} [options.position='top-right'] - Position of the notification ('top-right', 'top-left', 'bottom-right', 'bottom-left').
 * @param {number} [options.duration=5000] - Duration in milliseconds for which the notification is displayed.
 * @returns {Object} An object with methods for showing notifications.
 *
 * @example
 * // Initialize the notification component
 * const notification = $().notification({
 *   position: 'bottom-left',
 *   duration: 3000
 * });
 *
 * // Show a success notification
 * notification.show('Operation successful!', 'success');
 *
 * // Show an error notification
 * notification.show('An error occurred', 'error');
 *
 * // Show a warning notification
 * notification.show('Please check your input', 'warning');
 *
 * // Show an info notification
 * notification.show('New update available', 'info');
 */

$.prototype.notification = function (options = {}) {
  const defaultOptions = {
    position: "top-right",
    duration: 5000,
  };

  const settings = { ...defaultOptions, ...options };

  // Create container for notifications if it doesn't exist
  let container = document.querySelector(".modernlib-notification-container");
  if (!container) {
    container = document.createElement("div");
    container.className = `modernlib-notification-container ${settings.position}`;
    document.body.appendChild(container);
  }

  /**
   * Shows a notification.
   * @param {string} message - The message to display.
   * @param {string} type - The type of notification ('success', 'error', 'warning', 'info').
   */
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `modernlib-notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    // Trigger a reflow to enable the transition
    notification.offsetHeight;

    // Add visible class to trigger the transition
    notification.classList.add("visible");

    // Remove the notification after the specified duration
    setTimeout(() => {
      notification.classList.remove("visible");
      setTimeout(() => {
        container.removeChild(notification);
      }, 300); // Wait for the fade-out transition to complete
    }, settings.duration);
  }

  // Add styles to the document
  const style = document.createElement("style");
  style.textContent = `
    .modernlib-notification-container {
      position: fixed;
      z-index: 9999;
      max-width: 300px;
    }
    .modernlib-notification-container.top-right { top: 20px; right: 20px; }
    .modernlib-notification-container.top-left { top: 20px; left: 20px; }
    .modernlib-notification-container.bottom-right { bottom: 20px; right: 20px; }
    .modernlib-notification-container.bottom-left { bottom: 20px; left: 20px; }
    .modernlib-notification {
      margin-bottom: 10px;
      padding: 15px;
      border-radius: 4px;
      color: white;
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity 0.3s, transform 0.3s;
    }
    .modernlib-notification.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .modernlib-notification.success { background-color: #4CAF50; }
    .modernlib-notification.error { background-color: #F44336; }
    .modernlib-notification.warning { background-color: #FF9800; }
    .modernlib-notification.info { background-color: #2196F3; }
  `;
  document.head.appendChild(style);

  return {
    show: showNotification,
  };
};

export default $;
