/**
 * @file adminPanelRoles.js
 * @description Role management functions for the admin panel
 * @module components/adminPanelRoles
 */

/**
 * Loads and displays the list of roles
 * @param {Object} contentArea - The content area element
 * @param {string} projectId - The ID of the current project
 * @param {Object} roleComponent - The role management component
 * @param {Object} options - Additional options (e.g., pagination)
 * @example
 * loadRoles($('#contentArea'), '123', roleComponent, { page: 1, itemsPerPage: 10 });
 */
export function loadRoles(contentArea, projectId, roleComponent, options = {}) {
    const { page = 1, itemsPerPage = 10 } = options;
  
    roleComponent
      .getAll(projectId, { page, itemsPerPage })
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
  
        $("#addRoleBtn").click(() => showRoleForm(contentArea, projectId, roleComponent));
        $(".editRoleBtn").click(function () {
          const roleId = $(this).data("id");
          showRoleForm(contentArea, projectId, roleComponent, roleId);
        });
        $(".deleteRoleBtn").click(function () {
          const roleId = $(this).data("id");
          if (confirm("Are you sure you want to delete this role?")) {
            roleComponent
              .delete(projectId, roleId)
              .then(() => {
                showNotification("Role deleted successfully", "success");
                loadRoles(contentArea, projectId, roleComponent, options);
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
  }
  
  /**
   * Shows the role form for adding or editing a role
   * @param {Object} contentArea - The content area element
   * @param {string} projectId - The ID of the current project
   * @param {Object} roleComponent - The role management component
   * @param {string} [roleId] - The ID of the role to edit (optional)
   * @example
   * showRoleForm($('#contentArea'), '123', roleComponent, '456');
   */
  export function showRoleForm(contentArea, projectId, roleComponent, roleId = null) {
    const title = roleId ? "Edit Role" : "Add Role";
    const formHTML = `
      <h2 class="text-xl mb-4">${title}</h2>
      <form id="roleForm">
        <input type="text" id="roleName" placeholder="Name" class="w-full p-2 mb-4 border rounded" required>
        <textarea id="roleDescription" placeholder="Description" class="w-full p-2 mb-4 border rounded" rows="3"></textarea>
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">${title}</button>
      </form>
    `;
  
    contentArea.html(formHTML);
  
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
          loadRoles(contentArea, projectId, roleComponent);
        })
        .catch((error) => {
          showNotification(`Error ${roleId ? "updating" : "creating"} role: ` + error.message, "error");
        });
    });
  }