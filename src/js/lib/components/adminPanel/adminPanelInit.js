/**
 * @file adminPanelInit.js
 * @description Initialization functions for the admin panel
 * @module components/adminPanel/init
 */

import { loadUsers } from "./adminPanelUsers";
import { loadRoles } from "./adminPanelRoles";
import { loadPermissions } from "./adminPanelPermissions";
import { loadTables } from "./adminPanelTables";
import { showLoginForm } from "./adminPanelAuth";

/**
 * Initializes the admin panel
 * @param {Object} context - The ModernLib context
 * @param {Object} user - The authenticated user object
 * @param {Object} options - Configuration options
 * @param {Object} services - The initialized services
 * @example
 * initializeAdminPanel($, { name: 'John Doe' }, { projectId: '123' }, services);
 */
export function initializeAdminPanel(context, user, options, services) {
  const { projectId, onMenuItemClick, menuItems = [] } = options;

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

  // Add event listeners
  context.find("nav a").on("click", function (e) {
    e.preventDefault();
    const menuId = this.getAttribute("data-menu-id");
    onMenuItemClick(menuId);

    // Update active menu item
    context.find("nav a").removeClass("bg-blue-100");
    context.find(this).addClass("bg-blue-100");

    // Load content based on menu item
    const contentArea = context.find("#contentArea");
    switch (menuId) {
      case "dashboard":
        contentArea.html('<h2 class="text-xl mb-4">Dashboard</h2><p>Welcome to your dashboard.</p>');
        break;
      case "users":
        loadUsers(contentArea, projectId, services.userService);
        break;
      case "roles":
        loadRoles(contentArea, projectId, services.roleService);
        break;
      case "permissions":
        loadPermissions(contentArea, projectId, services.permissionService);
        break;
      case "tables":
        loadTables(contentArea, projectId, services.tableStructureService);
        break;
    }
  });

  context.find("#logoutBtn").on("click", function () {
    services.authService.logout().then(() => showLoginForm(context, services.authService, projectId, initializeAdminPanel));
  });
}
