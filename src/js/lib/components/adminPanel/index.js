/**
 * @file index.js
 * @description Main entry point for the admin panel module
 * @module components/adminPanel
 */

import $ from "../../core";
import { initServices } from "./services";
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
 */
$.prototype.adminPanel = function (options) {
  const {
    projectId,
    apiBaseUrl = $.adminSettings.apiBaseUrl,
    onMenuItemClick,
    components = {},
    itemsPerPage = $.adminSettings.defaultItemsPerPage,
    menuItems = [
      { id: "dashboard", label: "Dashboard" },
      { id: "users", label: "Users" },
      { id: "roles", label: "Roles" },
      { id: "permissions", label: "Permissions" },
      { id: "tables", label: "Tables" },
    ],
    additionalComponents = {},
  } = options;


  const services = initServices(apiBaseUrl, components);

  services.authService
    .getMe()
    .then((user) => {
      if (!user || !user.id) {
        showLoginForm(this, services.authService, projectId, (context, user) => initializeAdminPanel(context, user, options, services));
      } else {
        initializeAdminPanel(this, user, options, services);
      }
    })
    .catch(() => showLoginForm(this, services.authService, projectId, (context, user) => initializeAdminPanel(context, user, options, services)));

  // Rest of the adminPanel code...
  // Use services.authService, services.userService, etc. instead of separate variables

  return this;
};

export default $;
