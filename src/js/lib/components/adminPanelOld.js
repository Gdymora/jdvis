/**
 * @file adminPanel.js
 * @description Advanced admin panel component for ModernLib.
 * @module components/adminPanel
 */

import $ from "../core";

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

  const authComponent = components.auth || $().projectAuthComponent(apiBaseUrl);
  const userComponent = components.user || $().projectUserComponent(apiBaseUrl);
  const roleComponent = components.role || $().projectRoleComponent(apiBaseUrl);
  const permissionComponent = components.permission || $().projectPermissionComponent(apiBaseUrl);
  const tableStructureComponent = components.tableStructure || $().projectTableStructureComponent(apiBaseUrl);

  let currentPage = 1;
  let currentSearchTerm = "";
  let currentFilters = {};

  // Check authentication
  authComponent
    .getMe()
    .then((user) => {
      if (!user || !user.id) {
        showLoginForm();
      } else {
        initializeAdminPanel(user);
      }
    })
    .catch(() => showLoginForm());

  const showLoginForm = () => {
    const loginHTML = `
          <div class="flex items-center justify-center h-screen bg-gray-100">
            <div class="bg-white p-8 rounded shadow-md w-96">
              <h2 class="text-2xl font-bold mb-4">Admin Login</h2>
              <form id="loginForm">
                <input type="email" id="email" placeholder="Email" class="w-full p-2 mb-4 border rounded" required>
                <input type="password" id="password" placeholder="Password" class="w-full p-2 mb-4 border rounded" required>
                <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
              </form>
            </div>
          </div>
        `;
    this.html(loginHTML);

    $("#loginForm").on("submit", function (e) {
      e.preventDefault();
      const email = $("#email").val();
      const password = $("#password").val();
      authComponent
        .login({ email, password, project_id: projectId })
        .then(() => {
          authComponent.getMe().then((user) => initializeAdminPanel(user));
        })
        .catch(() => alert("Login failed. Please try again."));
    });
  };

  const initializeAdminPanel = (user) => {
    const menuItems = [
      { id: "dashboard", label: "Dashboard" },
      { id: "users", label: "Users" },
      { id: "roles", label: "Roles" },
      { id: "permissions", label: "Permissions" },
      { id: "tables", label: "Tables" },
    ];

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

    this.html(adminPanelHTML);

    // Add event listeners
    this.find("nav a").click(function (e) {
      e.preventDefault();
      const menuId = this.getAttribute("data-menu-id");
      onMenuItemClick(menuId);

      // Update active menu item
      $("nav a").removeClass("bg-blue-100");
      $(this).addClass("bg-blue-100");

      // Load content based on menu item
      const contentArea = $("#contentArea");
      switch (menuId) {
        case "dashboard":
          contentArea.html('<h2 class="text-xl mb-4">Dashboard</h2><p>Welcome to your dashboard.</p>');
          break;
        case "users":
          loadUsers(contentArea);
          break;
        case "roles":
          loadRoles(contentArea);
          break;
        case "permissions":
          loadPermissions(contentArea);
          break;
        case "tables":
          loadTables(contentArea);
          break;
      }
    });

    $("#logoutBtn").click(function () {
      authComponent.logout().then(() => showLoginForm());
    });
  };

  const loadUsers = (contentArea) => {
    userComponent
      .getAll(projectId)
      .then((users) => {
        let usersHTML = `
              <h2 class="text-xl mb-4">Users</h2>
              <button id="addUserBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add User</button>
              <table class="w-full">
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Email</th>
                    <th class="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${users
                    .map(
                      (user) => `
                    <tr>
                      <td>${user.name}</td>
                      <td>${user.email}</td>
                      <td>
                        <button class="editUserBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" data-id="${user.id}">Edit</button>
                        <button class="deleteUserBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-id="${user.id}">Delete</button>
                      </td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            `;
        contentArea.html(usersHTML);

        $("#addUserBtn").click(() => showUserForm());
        $(".editUserBtn").click(function () {
          const userId = $(this).data("id");
          showUserForm(userId);
        });
        $(".deleteUserBtn").click(function () {
          const userId = $(this).data("id");
          if (confirm("Are you sure you want to delete this user?")) {
            userComponent
              .delete(projectId, userId)
              .then(() => loadUsers(contentArea))
              .catch((error) => alert("Error deleting user: " + error.message));
          }
        });
      })
      .catch((error) => {
        contentArea.html("<p>Error loading users.</p>");
        console.error("Error loading users:", error);
      });
  };

  const showUserForm = (userId = null) => {
    const title = userId ? "Edit User" : "Add User";
    const formHTML = `
          <h2 class="text-xl mb-4">${title}</h2>
          <form id="userForm">
            <input type="text" id="userName" placeholder="Name" class="w-full p-2 mb-4 border rounded" required>
            <input type="email" id="userEmail" placeholder="Email" class="w-full p-2 mb-4 border rounded" required>
            <input type="password" id="userPassword" placeholder="Password" class="w-full p-2 mb-4 border rounded" ${userId ? "" : "required"}>
            <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">${title}</button>
          </form>
        `;
    $("#contentArea").html(formHTML);

    if (userId) {
      userComponent.getById(projectId, userId).then((user) => {
        $("#userName").val(user.name);
        $("#userEmail").val(user.email);
      });
    }

    $("#userForm").submit(function (e) {
      e.preventDefault();
      const userData = {
        name: $("#userName").val(),
        email: $("#userEmail").val(),
        password: $("#userPassword").val(),
      };

      const action = userId ? userComponent.update(projectId, userId, userData) : userComponent.create(projectId, userData);

      action.then(() => loadUsers($("#contentArea"))).catch((error) => alert("Error saving user: " + error.message));
    });
  };

  const loadRoles = (contentArea, page) => {
    $("#searchArea").show();
    $("#filterArea").hide();

    roleComponent
      .getAll(projectId, { page, itemsPerPage, search: currentSearchTerm })
      .then((response) => {
        const { roles, totalPages } = response;
        let rolesHTML = `
          <h2 class="text-xl mb-4">Roles</h2>
          <button id="addRoleBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add Role</button>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Description</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${roles
                .map(
                  (role) => `
                <tr>
                  <td>${role.name}</td>
                  <td>${role.description}</td>
                  <td>
                    <button class="editRoleBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" data-id="${role.id}">Edit</button>
                    <button class="deleteRoleBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-id="${role.id}">Delete</button>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `;
        contentArea.html(rolesHTML);

        // Render pagination
        $("#paginationArea").pagination(totalPages, page);

        $("#addRoleBtn").click(() => showRoleForm());
        $(".editRoleBtn").click(function () {
          const roleId = $(this).data("id");
          showRoleForm(roleId);
        });
        $(".deleteRoleBtn").click(function () {
          const roleId = $(this).data("id");
          if (confirm("Are you sure you want to delete this role?")) {
            roleComponent
              .delete(projectId, roleId)
              .then(() => {
                showNotification("Role deleted successfully", "success");
                loadRoles(contentArea, currentPage);
              })
              .catch((error) => {
                showNotification("Error deleting role: " + error.message, "error");
              });
          }
        });
      })
      .catch((error) => {
        contentArea.html("<p>Error loading roles.</p>");
        showNotification("Error loading roles: " + error.message, "error");
      });
  };

  const showRoleForm = (roleId = null) => {
    const title = roleId ? "Edit Role" : "Add Role";
    const formHTML = `
      <h2 class="text-xl mb-4">${title}</h2>
      <form id="roleForm">
        <input type="text" id="roleName" placeholder="Name" class="w-full p-2 mb-4 border rounded" required>
        <textarea id="roleDescription" placeholder="Description" class="w-full p-2 mb-4 border rounded" rows="3"></textarea>
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">${title}</button>
      </form>
    `;

    if (additionalComponents.modal) {
      $("body").createModal({
        text: {
          title: title,
          body: formHTML,
        },
        btns: {
          count: 1,
          settings: [["Close", ["btn-danger"], true]],
        },
      });
    } else {
      $("#contentArea").html(formHTML);
    }

    if (roleId) {
      roleComponent.getById(projectId, roleId).then((role) => {
        $("#roleName").val(role.name);
        $("#roleDescription").val(role.description);
      });
    }

    $("#roleForm").submit(function (e) {
      e.preventDefault();
      const roleData = {
        name: $("#roleName").val(),
        description: $("#roleDescription").val(),
      };

      const action = roleId ? roleComponent.update(projectId, roleId, roleData) : roleComponent.create(projectId, roleData);

      action
        .then(() => {
          showNotification(`Role ${roleId ? "updated" : "created"} successfully`, "success");
          loadRoles($("#contentArea"), currentPage);
          if (additionalComponents.modal) {
            $(".modal").fadeOut(500);
          }
        })
        .catch((error) => {
          showNotification(`Error ${roleId ? "updating" : "creating"} role: ` + error.message, "error");
        });
    });
  };

  const loadPermissions = (contentArea, page) => {
    $("#searchArea").show();
    $("#filterArea").hide();

    permissionComponent
      .getAll(projectId, { page, itemsPerPage, search: currentSearchTerm })
      .then((response) => {
        const { permissions, totalPages } = response;
        let permissionsHTML = `
          <h2 class="text-xl mb-4">Permissions</h2>
          <button id="addPermissionBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add Permission</button>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Description</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${permissions
                .map(
                  (permission) => `
                <tr>
                  <td>${permission.name}</td>
                  <td>${permission.description}</td>
                  <td>
                    <button class="editPermissionBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" data-id="${permission.id}">Edit</button>
                    <button class="deletePermissionBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-id="${permission.id}">Delete</button>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `;
        contentArea.html(permissionsHTML);

        // Render pagination
        $("#paginationArea").pagination(totalPages, page);

        $("#addPermissionBtn").click(() => showPermissionForm());
        $(".editPermissionBtn").click(function () {
          const permissionId = $(this).data("id");
          showPermissionForm(permissionId);
        });
        $(".deletePermissionBtn").click(function () {
          const permissionId = $(this).data("id");
          if (confirm("Are you sure you want to delete this permission?")) {
            permissionComponent
              .delete(projectId, permissionId)
              .then(() => {
                showNotification("Permission deleted successfully", "success");
                loadPermissions(contentArea, currentPage);
              })
              .catch((error) => {
                showNotification("Error deleting permission: " + error.message, "error");
              });
          }
        });
      })
      .catch((error) => {
        contentArea.html("<p>Error loading permissions.</p>");
        showNotification("Error loading permissions: " + error.message, "error");
      });
  };

  const showPermissionForm = (permissionId = null) => {
    const title = permissionId ? "Edit Permission" : "Add Permission";
    const formHTML = `
      <h2 class="text-xl mb-4">${title}</h2>
      <form id="permissionForm">
        <input type="text" id="permissionName" placeholder="Name" class="w-full p-2 mb-4 border rounded" required>
        <textarea id="permissionDescription" placeholder="Description" class="w-full p-2 mb-4 border rounded" rows="3"></textarea>
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">${title}</button>
      </form>
    `;

    if (additionalComponents.modal) {
      $("body").createModal({
        text: {
          title: title,
          body: formHTML,
        },
        btns: {
          count: 1,
          settings: [["Close", ["btn-danger"], true]],
        },
      });
    } else {
      $("#contentArea").html(formHTML);
    }

    if (permissionId) {
      permissionComponent.getById(projectId, permissionId).then((permission) => {
        $("#permissionName").val(permission.name);
        $("#permissionDescription").val(permission.description);
      });
    }

    $("#permissionForm").submit(function (e) {
      e.preventDefault();
      const permissionData = {
        name: $("#permissionName").val(),
        description: $("#permissionDescription").val(),
      };

      const action = permissionId ? permissionComponent.update(projectId, permissionId, permissionData) : permissionComponent.create(projectId, permissionData);

      action
        .then(() => {
          showNotification(`Permission ${permissionId ? "updated" : "created"} successfully`, "success");
          loadPermissions($("#contentArea"), currentPage);
          if (additionalComponents.modal) {
            $(".modal").fadeOut(500);
          }
        })
        .catch((error) => {
          showNotification(`Error ${permissionId ? "updating" : "creating"} permission: ` + error.message, "error");
        });
    });
  };

  const loadTables = (contentArea, page) => {
    $("#searchArea").show();
    $("#filterArea").hide();

    tableStructureComponent
      .getAll(projectId, { page, itemsPerPage, search: currentSearchTerm })
      .then((response) => {
        const { tables, totalPages } = response;
        let tablesHTML = `
          <h2 class="text-xl mb-4">Tables</h2>
          <button id="addTableBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add Table</button>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${tables
                .map(
                  (table) => `
                <tr>
                  <td>${table.table_name}</td>
                  <td>
                    <button class="editTableBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" data-id="${table.id}">Edit</button>
                    <button class="deleteTableBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-id="${table.id}">Delete</button>
                    <button class="viewTableDataBtn px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600" data-id="${table.id}">View Data</button>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `;
        contentArea.html(tablesHTML);

        // Render pagination
        $("#paginationArea").pagination(totalPages, page);

        $("#addTableBtn").click(() => showTableForm());
        $(".editTableBtn").click(function () {
          const tableId = $(this).data("id");
          showTableForm(tableId);
        });
        $(".deleteTableBtn").click(function () {
          const tableId = $(this).data("id");
          if (confirm("Are you sure you want to delete this table?")) {
            tableStructureComponent
              .delete(projectId, tableId)
              .then(() => {
                showNotification("Table deleted successfully", "success");
                loadTables(contentArea, currentPage);
              })
              .catch((error) => {
                showNotification("Error deleting table: " + error.message, "error");
              });
          }
        });
        $(".viewTableDataBtn").click(function () {
          const tableId = $(this).data("id");
          loadTableData(contentArea, tableId, 1);
        });
      })
      .catch((error) => {
        contentArea.html("<p>Error loading tables.</p>");
        showNotification("Error loading tables: " + error.message, "error");
      });
  };

  const showTableForm = (tableId = null) => {
    const title = tableId ? "Edit Table" : "Add Table";
    const formHTML = `
      <h2 class="text-xl mb-4">${title}</h2>
      <form id="tableForm">
        <input type="text" id="tableName" placeholder="Table Name" class="w-full p-2 mb-4 border rounded" required>
        <div id="tableFields">
          <!-- Fields will be dynamically added here -->
        </div>
        <button type="button" id="addFieldBtn" class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Field</button>
        <button type="submit" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">${title}</button>
      </form>
    `;

    if (additionalComponents.modal) {
      $("body").createModal({
        text: {
          title: title,
          body: formHTML,
        },
        btns: {
          count: 1,
          settings: [["Close", ["btn-danger"], true]],
        },
      });
    } else {
      $("#contentArea").html(formHTML);
    }

    let fieldCount = 0;

    function addField(name = "", type = "text", required = false) {
      const fieldHTML = `
        <div class="field-row mb-2">
          <input type="text" name="field_name[]" placeholder="Field Name" value="${name}" class="p-2 border rounded mr-2" required>
          <select name="field_type[]" class="p-2 border rounded mr-2">
            <option value="text" ${type === "text" ? "selected" : ""}>Text</option>
            <option value="number" ${type === "number" ? "selected" : ""}>Number</option>
            <option value="date" ${type === "date" ? "selected" : ""}>Date</option>
            <option value="boolean" ${type === "boolean" ? "selected" : ""}>Boolean</option>
          </select>
          <label>
            <input type="checkbox" name="field_required[]" ${required ? "checked" : ""}> Required
          </label>
          <button type="button" class="removeFieldBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2">Remove</button>
        </div>
      `;
      $("#tableFields").append(fieldHTML);
      fieldCount++;
    }

    $("#addFieldBtn").click(() => addField());

    $(document).on("click", ".removeFieldBtn", function () {
      $(this).closest(".field-row").remove();
      fieldCount--;
    });

    if (tableId) {
      tableStructureComponent.getById(projectId, tableId).then((table) => {
        $("#tableName").val(table.table_name);
        table.table_structure.forEach((field) => {
          addField(field.name, field.type, field.required);
        });
      });
    } else {
      addField(); // Add one empty field by default for new tables
    }

    $("#tableForm").submit(function (e) {
      e.preventDefault();
      const tableData = {
        table_name: $("#tableName").val(),
        table_structure: [],
      };

      $(".field-row").each(function () {
        tableData.table_structure.push({
          name: $(this).find('input[name="field_name[]"]').val(),
          type: $(this).find('select[name="field_type[]"]').val(),
          required: $(this).find('input[name="field_required[]"]').is(":checked"),
        });
      });

      const action = tableId ? tableStructureComponent.update(projectId, tableId, tableData) : tableStructureComponent.create(projectId, tableData);

      action
        .then(() => {
          showNotification(`Table ${tableId ? "updated" : "created"} successfully`, "success");
          loadTables($("#contentArea"), currentPage);
          if (additionalComponents.modal) {
            $(".modal").fadeOut(500);
          }
        })
        .catch((error) => {
          showNotification(`Error ${tableId ? "updating" : "creating"} table: ` + error.message, "error");
        });
    });
  };

  const loadTableData = (contentArea, tableId, page) => {
    // This function would be implemented to load and display the actual data in the table
    // It would use a separate component for table data, which is not provided in the original context
    // For now, we'll just show a placeholder message
    contentArea.html(`<p>Table data for table ID ${tableId} would be displayed here.</p>`);
    showNotification("Table data loading is not implemented in this example.", "info");
  };

  // Similar functions for loadRoles, loadPermissions, and loadTables
  // would be implemented here, following the same pattern as loadUsers

  return this;
};

export default $;
