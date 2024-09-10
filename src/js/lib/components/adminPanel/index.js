/**
 * @file index.js
 * @description Main entry point for the admin panel module
 * @module components/adminPanel
 */

import $ from "../../core";
import { initServices } from "./services";
import { initComponents } from "./components";
import { showLoginForm } from "./adminPanelAuth";
import { initializeAdminPanel } from "./adminPanelInit";

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

let isInitialized = false;

$.prototype.adminPanel = function (options) {
  const {
    projectId,
    apiBaseUrl = $.adminSettings.apiBaseUrl,
    onMenuItemClick,
    components = {},
    customServices = {},
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

  const standardServices = initServices(apiBaseUrl, components);

  // Об'єднуємо стандартні сервіси з користувацькими
  const services = { ...standardServices, ...customServices };

  const initializedComponents = initComponents(components);

  const checkAuthAndInitialize = async () => {
    if (isInitialized) {
      console.log("Admin panel is already initialized");
      return;
    }

    try {
      const token = services.authService.getToken();
      if (!token) {
        throw new Error("No token found");
      }

      const user = await services.authService.getMe(projectId);
      if (!user || !user.id) {
        throw new Error("Invalid user data");
      }

      //initializeAdminPanel(this, user, options, services);
      initializeAdminPanel(this, user, {
        ...options,
        services,
        components: initializedComponents,
      });

      isInitialized = true;
    } catch (error) {
      console.error("Authentication error:", error);
      services.authService.removeToken();
      showLoginForm(this, services.authService, projectId, handleSuccessfulLogin);
    }
  };

  const handleSuccessfulLogin = async (user) => {
    if (!user || !user.id) {
      console.error("Invalid user data after login");
      services.authService.removeToken();
      showLoginForm(this, services.authService, projectId, handleSuccessfulLogin);
      return;
    }

    // initializeAdminPanel(this, user, options, services);
    initializeAdminPanel(this, user, {
      ...options,
      services,
      components: initializedComponents,
    });
    isInitialized = true;
  };

  // Start the authentication check and initialization process
  checkAuthAndInitialize();

  return this;
};

export default $;

/*   services.authService
    .getMe()
    .then((user) => {
      if (!user || !user.id) {
        showLoginForm(this, services.authService, projectId, (context, user) => initializeAdminPanel(context, user, options, services));
      } else {
        initializeAdminPanel(this, user, options, services);
      }
    })
    .catch(() => showLoginForm(this, services.authService, projectId, (context, user) => initializeAdminPanel(context, user, options, services))); */
