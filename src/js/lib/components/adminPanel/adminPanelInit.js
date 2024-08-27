/**
 * @file adminPanelInit.js
 * @description Initialization functions for the admin panel
 * @module components/adminPanel/init
 */

import { loadUsers } from "./adminPanelUsers";
import { loadRoles } from "./adminPanelRoles";
import { loadPermissions } from "./adminPanelPermissions";
import { loadTableData, loadTables } from "./adminPanelTables";
import { loadPosts } from "./adminPanelPosts";
import { showLoginForm } from "./adminPanelAuth";

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
 * @param {Object} services - The initialized services
 * @example
 * initializeAdminPanel($, { name: 'John Doe' }, { projectId: '123' }, services);
 */
export function initializeAdminPanel(context, user, options) {
  const { projectId, onMenuItemClick, menuItems = [], services, components } = options;

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

    switch (menuId) {
      case "dashboard":
        console.log("Dashboard case");
        contentArea.html('<h2 class="text-xl mb-4">Dashboard</h2><p>Welcome to your dashboard.</p>');
        break;
      case "users":
        console.log("Users case");
        if (await checkPermission(services, "view_users", projectId)) {
          components.userManagement.load(contentArea, projectId, services.userService, services.roleService);

          //loadUsers(contentArea, projectId, services.userService);
        } else {
          contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view users.</p>');
        }
        break;
      case "roles":
        console.log("Roles case");
        if (await checkPermission(services, "view_roles", projectId)) {
          components.roleManagement.load(contentArea, projectId, services.roleService);
        } else {
          contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view roles.</p>');
        }
        break;
      case "permissions":
        console.log("Permissions case");
        if (await checkPermission(services, "view_permissions", projectId)) {
          components.permissionManagement.load(contentArea, projectId, services.permissionService);
        } else {
          contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view permissions.</p>');
        }
        break;
      case "tables":
        console.log("Tables case");
        if (await checkPermission(services, "view_tables", projectId)) {
          components.tableManagement.load(contentArea, projectId, services.tableStructureService);
        } else {
          contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view tables.</p>');
        }
        break;
      case "posts":
        console.log("Posts case");
        if (await checkPermission(services, "view_posts", projectId)) {
          components.postManagement.load(contentArea, projectId, services.tableDataService);
        } else {
          contentArea.html('<h2 class="text-xl mb-4">Access Denied</h2><p>You do not have permission to view posts.</p>');
        }
        break;
      default:
        console.log("Default case");
        contentArea.html('<h2 class="text-xl mb-4">Not Found</h2><p>The requested page does not exist.</p>');
    }
    console.log("Exiting switch statement");
  });

  $(document.querySelector("#logoutBtn")).on("click", function (e) {
    e.preventDefault();
    services.authService
      .logout(projectId)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        window.location.reload();
      });
  });
}
