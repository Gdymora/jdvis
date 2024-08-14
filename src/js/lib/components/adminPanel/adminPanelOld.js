/**
 * @file adminPanel.js
 * @description Advanced admin panel component for ModernLib.
 * @module components/adminPanel
 */

import $ from "../core";
import { showLoginForm } from "./adminPanelAuth";
import { initializeAdminPanel } from "./adminPanelInit";
import { loadUsers, showUserForm } from "./adminPanelUsers";
import { loadRoles, showRoleForm } from "./adminPanelRoles";
import { loadPermissions, showPermissionForm } from "./adminPanelPermissions";
import { loadTables, showTableForm } from "./adminPanelTables";

// Global settings
$.adminSettings = {
  apiBaseUrl: "",
  defaultItemsPerPage: 10,
};

/**
 * Creates an advanced admin panel component with CRUD operations, pagination, search, filtering, and notifications.
 * @memberof $.prototype
 * @param {Object} options - Configuration options for the admin panel.
 * @param {string} options.projectId - The ID of the current project.
 * @param {string} [options.apiBaseUrl] - The base URL for the API (overrides global setting).
 * @param {function} options.onMenuItemClick - Callback function when a menu item is clicked.
 * @param {Object} [options.components] - Custom components to use (optional).
 * @param {number} [options.itemsPerPage] - Number of items to display per page (default: 10).
 * @param {Array} [options.menuItems] - Custom menu items (optional).
 * @param {Object} [options.additionalComponents] - Additional UI components like tabs or modals.
 * @returns {Object} The ModernLib object for chaining.
 * @example
 * const adminPanel = $().adminPanel({
 *   projectId: '123',
 *   apiBaseUrl: 'https://api.example.com',
 *   onMenuItemClick: (menuId) => console.log(`Clicked menu: ${menuId}`),
 *   itemsPerPage: 20,
 *   menuItems: [
 *     { id: 'dashboard', label: 'Dashboard' },
 *     { id: 'users', label: 'Users' }
 *   ]
 * });
 */
$.prototype.adminPanel = function (options) {
  // ... (rest of the code remains the same)

  // Check authentication
  authComponent
    .getMe()
    .then((user) => {
      if (!user || !user.id) {
        showLoginForm(this, authComponent, projectId, initializeAdminPanel);
      } else {
        initializeAdminPanel(this, user, options);
      }
    })
    .catch(() => showLoginForm(this, authComponent, projectId, initializeAdminPanel));

  return this;
};

export default $;