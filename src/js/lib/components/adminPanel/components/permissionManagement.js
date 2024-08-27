// components/permissionManagement.js
export function createPermissionManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  return {
    load: function (contentArea, projectId, permissionService, options = {}) {
      const { page = 1, itemsPerPage = 10 } = options;

      permissionService
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

          $("#addPermissionBtn").click(() => showPermissionForm(contentArea, projectId, permissionService));
          $(".editPermissionBtn").click(function () {
            const permissionId = $(this).data("id");
            this.showForm(contentArea, projectId, permissionService, permissionId);
          });
          $(".deletePermissionBtn").click(function () {
            const permissionId = $(this).data("id");
            if (confirm("Are you sure you want to delete this permission?")) {
              permissionService
                .delete(projectId, permissionId)
                .then(() => {
                  notification.show("Permission deleted successfully", "success");
                  this.load(contentArea, projectId, permissionService, options);
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
    },

    showForm: function (contentArea, projectId, permissionService, permissionId = null) {
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
        permissionService.getById(projectId, permissionId).then((permission) => {
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

        const action = permissionId
          ? permissionService.update(projectId, permissionId, permissionData)
          : permissionService.create(projectId, permissionData);

        action
          .then(() => {
            notification.show(`Permission ${permissionId ? "updated" : "created"} successfully`, "success");
            this.load(contentArea, projectId, permissionService);
          })
          .catch((error) => {
            notification.show(`Error ${permissionId ? "updating" : "creating"} permission: ` + error.message, "error");
          });
      });
    },
  };
}
