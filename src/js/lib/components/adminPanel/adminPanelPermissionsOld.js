/**
 * @file adminPanelPermissions.js
 * @description Permission management functions for the admin panel
 * @module components/adminPanelPermissions
 */

/**
 * Loads and displays the list of permissions
 * @param {Object} contentArea - The content area element
 * @param {string} projectId - The ID of the current project
 * @param {Object} permissionComponent - The permission management component
 * @param {Object} options - Additional options (e.g., pagination)
 * @example
 * loadPermissions($('#contentArea'), '123', permissionComponent, { page: 1, itemsPerPage: 10 });
 */
export function loadPermissions(contentArea, projectId, permissionComponent, options = {}) {
  const { page = 1, itemsPerPage = 10 } = options;

  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  permissionComponent
    .getAll(projectId, { page, itemsPerPage })
    .then((response) => {
      const permissions = response.data;
      const totalPages = response.last_page;
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

      $("#addPermissionBtn").click(() => showPermissionForm(contentArea, projectId, permissionComponent));
      $(".editPermissionBtn").click(function () {
        const permissionId = $(this).data("id");
        showPermissionForm(contentArea, projectId, permissionComponent, permissionId);
      });
      $(".deletePermissionBtn").click(function () {
        const permissionId = $(this).data("id");
        if (confirm("Are you sure you want to delete this permission?")) {
          permissionComponent
            .delete(projectId, permissionId)
            .then(() => {
              notification.show("Permission deleted successfully", "success");
              loadPermissions(contentArea, projectId, permissionComponent, options);
            })
            .catch((error) => {
              notification.show("Error deleting permission: " + error.message, "error");
            });
        }
      });
    })
    .catch((error) => {
      contentArea.html("<p>Error loading permissions.</p>");
      notification.show("Error loading permissions: " + error.message, "error");
    });
}

/**
 * Shows the permission form for adding or editing a permission
 * @param {Object} contentArea - The content area element
 * @param {string} projectId - The ID of the current project
 * @param {Object} permissionComponent - The permission management component
 * @param {string} [permissionId] - The ID of the permission to edit (optional)
 * @example
 * showPermissionForm($('#contentArea'), '123', permissionComponent, '456');
 */
export function showPermissionForm(contentArea, projectId, permissionComponent, permissionId = null) {
  const title = permissionId ? "Edit Permission" : "Add Permission";
  const formHTML = `
      <h2 class="text-xl mb-4">${title}</h2>
      <form id="permissionForm">
        <input type="text" id="permissionName" placeholder="Name" class="w-full p-2 mb-4 border rounded" required>
        <textarea id="permissionDescription" placeholder="Description" class="w-full p-2 mb-4 border rounded" rows="3"></textarea>
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">${title}</button>
      </form>
    `;

  contentArea.html(formHTML);

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
        notification.show(`Permission ${permissionId ? "updated" : "created"} successfully`, "success");
        loadPermissions(contentArea, projectId, permissionComponent);
      })
      .catch((error) => {
        notification.show(`Error ${permissionId ? "updating" : "creating"} permission: ` + error.message, "error");
      });
  });
}
