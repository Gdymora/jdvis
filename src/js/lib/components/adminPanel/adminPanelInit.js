/**
 * @file adminPanelInit.js
 * @description Initialization functions for the admin panel
 * @module components/adminPanel/init
 */
import { createTabs, createModal } from "./util/helperFunctions";
/**
 * Checks if the current user has a specific permission
 * @param {Object} services - The services object containing the userService
 * @param {string} permission - The permission to check
 * @returns {Promise<boolean>} A promise that resolves to true if the user has the permission, false otherwise
 */
async function checkPermission(services, permission, projectId) {
  try {
    if (!services || !services.userService || typeof services.userService.hasPermission !== "function") {
      console.error("User service or hasPermission method is not available");
      return false;
    }
    return await services.userService.hasPermission(permission, projectId);
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

/**
 * Initializes the admin panel
 * @param {Object} context - The ModernLib context
 * @param {Object} user - The authenticated user object
 * @param {Object} options - Configuration options
 * @param {string} options.projectId - The ID of the current project
 * @param {Function} options.onMenuItemClick - Callback function for menu item clicks
 * @param {Array} [options.menuItems=[]] - Array of menu items
 * @param {Object} options.services - The initialized services
 * @param {Object} options.components - The initialized components
 * @fires context#adminPanelInitialized
 * @fires context#beforeMenuItemClick
 * @fires context#beforeContentLoad
 * @fires context#afterContentLoad
 * @fires context#dashboardLoaded
 * @fires context#usersLoaded
 * @fires context#rolesLoaded
 * @fires context#permissionsLoaded
 * @fires context#tablesLoaded
 * @fires context#postsLoaded
 * @fires context#accessDenied
 * @fires context#pageNotFound
 * @fires context#beforeLogout
 * @fires context#logoutSuccess
 * @fires context#logoutError
 * @fires context#adminPanelReady
 * @example
 * initializeAdminPanel($('#adminPanel'), { name: 'John Doe' }, {
 *   projectId: '123',
 *   onMenuItemClick: (menuId) => console.log(menuId),
 *   services: services,
 *   components: components
 * });
 */
export function initializeAdminPanel(context, user, options) {
  const { projectId, onMenuItemClick, menuItems = [], services, components, customComponents = {}, additionalComponents = {} } = options;

  if (!context || context.length === 0) {
    console.warn("Context is empty or undefined, initializing with document body");
    context = $(document.body);
  }

  const createMenuItem = (item) => `
    <a href="#" data-menu-id="${item.id}" class="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">
      ${item.label}
    </a>
  `;

  const createSidebar = () => `
    <div class="w-64 bg-white shadow-md">
      <div class="p-4 bg-blue-600 text-white font-bold">
        Admin Panel
      </div>
      <div class="p-4">
        <p>Welcome, ${user.name}</p>
        <button id="logoutBtn" class="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
      </div>
      <nav class="mt-4">
        ${menuItems.map(createMenuItem).join("")}
      </nav>
    </div>
  `;

  const createMainContent = () => `
    <div class="flex-1 p-8">
      <h1 class="text-2xl font-bold mb-4">Welcome to Admin Panel</h1>
      <div id="contentArea">
        <!-- Dynamic content will be loaded here -->
      </div>
    </div>
  `;

  const adminPanelHTML = `
    <div class="flex h-screen bg-gray-100">
      ${createSidebar()}
      ${createMainContent()}
    </div>
  `;

  context.html(adminPanelHTML);

  // Додаємо допоміжні функції до контексту адмін-панелі
  const adminPanelHelpers = {
    createTabs: (containerSelector, tabsConfig) => createTabs(containerSelector, tabsConfig),
    createModal: (id, config) => createModal(id, config),
  };

  /**
   * Fires when the admin panel is initialized
   * @event context#adminPanelInitialized
   * @type {object}
   * @property {object} user - The authenticated user object
   * @property {string} projectId - The ID of the current project
   */
  context.trigger("adminPanelInitialized", { user, projectId });

  context.find("nav a").on("click", async function (e) {
    e.preventDefault();
    const menuId = this.getAttribute("data-menu-id");
    onMenuItemClick(menuId);

    // Update active menu item
    context.find("nav a").removeClass("bg-blue-100");
    context.find(this).addClass("bg-blue-100");

    // Load content based on menu item
    const contentArea = $(document.querySelector("#contentArea"));

    if (!contentArea || contentArea.length === 0) {
      console.error("Content area not found");
      return;
    }

    /**
     * Fires before content is loaded
     * @event context#beforeContentLoad
     * @type {object}
     * @property {string} menuId - The ID of the selected menu item
     * @property {Object} contentArea - The content area element
     */
    context.trigger("beforeContentLoad", { menuId, contentArea });
    const loadOptions = { page: 1, itemsPerPage: options.itemsPerPage, helpers: adminPanelHelpers };

    // Перевіряємо, чи є користувацький компонент для цього пункту меню
    if (customComponents[menuId]) {
      if (await checkPermission(services, `view_${menuId}`, projectId)) {
        // Передаємо допоміжні функції в користувацький компонент
        customComponents[menuId].load(contentArea, projectId, services[`${menuId}Service`], loadOptions);
        context.trigger(`${menuId}Loaded`);
      } else {
        contentArea.html(`<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view ${menuId}.</p>`);
        context.trigger("accessDenied", { section: menuId });
      }
    } else {
      switch (menuId) {
        case "dashboard":
          console.log("Dashboard case");
          contentArea.html('<h2 class="text-xl mb-4">Dashboard</h2><p>Welcome to your dashboard.</p>');
          /**
           * Fires when the dashboard is loaded
           * @event context#dashboardLoaded
           */
          context.trigger("dashboardLoaded");
          break;
        case "users":
          console.log("Users case");
          if (await checkPermission(services, "view_users", projectId)) {
            try {
              components.userManagement.load(contentArea, projectId, services.userService, services.roleService, loadOptions);
            } catch (error) {
              console.error("Error loading table management component:", error);
              contentArea.html('<h2 class="text-xl mb-4">Error</h2><p>An error occurred while loading the tables component.</p>');
            }
            /**
             * Fires when the users section is loaded
             * @event context#usersLoaded
             */
            components.userManagement.trigger("usersLoaded");
          } else {
            contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view users.</p>');
            /**
             * Fires when access is denied to a section
             * @event context#accessDenied
             * @type {object}
             * @property {string} section - The section to which access was denied
             */
            context.trigger("accessDenied", { section: "users" });
          }
          break;
        case "roles":
          console.log("Roles case");
          if (await checkPermission(services, "view_roles", projectId)) {
            try {
              components.roleManagement.load(contentArea, projectId, services.roleService, services.permissionService, loadOptions);
            } catch (error) {
              console.error("Error loading table management component:", error);
              contentArea.html('<h2 class="text-xl mb-4">Error</h2><p>An error occurred while loading the tables component.</p>');
            }
          } else {
            contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view roles.</p>');
          }
          break;
        case "permissions":
          console.log("Permissions case");
          if (await checkPermission(services, "view_permissions", projectId)) {
            try {
              components.permissionManagement.load(contentArea, projectId, services.permissionService, services.roleService, loadOptions);
            } catch (error) {
              console.error("Error loading table management component:", error);
              contentArea.html('<h2 class="text-xl mb-4">Error</h2><p>An error occurred while loading the tables component.</p>');
            }
          } else {
            contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view permissions.</p>');
          }
          break;
        case "tables":
          console.log("Tables case");
          if (await checkPermission(services, "view_tables", projectId)) {
            try {
              components.tableManagement.load(contentArea, projectId, services.tableStructureService, services.tableDataService, loadOptions);
            } catch (error) {
              console.error("Error loading table management component:", error);
              contentArea.html('<h2 class="text-xl mb-4">Error</h2><p>An error occurred while loading the tables component.</p>');
            }
          } else {
            contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view tables.</p>');
          }
          break;
        case "posts":
          console.log("Posts case");
          if (await checkPermission(services, "view_posts", projectId)) {
            try {
              components.postManagement.load(contentArea, projectId, services.tableDataService, loadOptions);
            } catch (error) {
              console.error("Error loading table management component:", error);
              contentArea.html('<h2 class="text-xl mb-4">Error</h2><p>An error occurred while loading the tables component.</p>');
            }
          } else {
            contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view posts.</p>');
          }
          break;
        case "settings":
          /**
           * Fires when the dashboard is loaded
           * @event context#settingsLoaded
           */
          context.trigger("settingsLoaded");
          break;
        default:
          console.log("Default case");
          contentArea.html('<h2 class="text-xl mb-4">Not Found</h2><p>The requested page does not exist.</p>');
          /**
           * Fires when a non-existent page is requested
           * @event context#pageNotFound
           * @type {object}
           * @property {string} menuId - The ID of the non-existent menu item
           */
          context.trigger("pageNotFound", { menuId });
      }
    }
    // console.log("Exiting switch statement");
    /**
     * Fires after content is loaded
     * @event context#afterContentLoad
     * @type {object}
     * @property {string} menuId - The ID of the selected menu item
     * @property {Object} contentArea - The content area element
     */
    context.trigger("afterContentLoad", { menuId, contentArea });
  });

  $(document.querySelector("#logoutBtn")).on("click", function (e) {
    e.preventDefault();
    services.authService
      .logout(projectId)
      .then(() => {
        /**
         * Fires when logout is successful
         * @event context#logoutSuccess
         */
        context.trigger("logoutSuccess");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        /**
         * Fires when logout fails
         * @event context#logoutError
         * @type {object}
         * @property {Error} error - The error object
         */
        context.trigger("logoutError", { error });
        window.location.reload();
      });
  });
}
