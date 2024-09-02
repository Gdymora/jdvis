// components/permissionManagement.js
export function createPermissionManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  return {
    load: function (contentArea, projectId, permissionService, roleService, options = {}) {
      const { page = 1, itemsPerPage = 10 } = options;

      Promise.all([permissionService.getAll(projectId, { page, itemsPerPage }), roleService.getAll(projectId, { page, itemsPerPage })])
        .then(([permissionsResponse, rolesResponse]) => {
          const permissions = Array.isArray(permissionsResponse.data) ? permissionsResponse.data : [];
          const roles = Array.isArray(rolesResponse.data) ? rolesResponse.data : [];
          const totalPages = permissionsResponse.last_page || 1;

          let permissionsHTML = `
          <h2 class="text-xl mb-4">Permissions</h2>
          <button id="addPermissionBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add Permission</button>
          ${
            permissions.length > 0
              ? `
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Description</th>
                  <th class="text-left">Roles</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${permissions
                  .map(
                    (permission) => `
                  <tr>
                    <td>${permission.name}</td>
                    <td>${permission.description || ""}</td>
                    <td>${permission.roles ? permission.roles.map((r) => r.name).join(", ") : ""}</td>
                    <td>
                      <button class="editPermissionBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2" data-id="${permission.id}">Edit</button>
                      <button class="deletePermissionBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-id="${permission.id}">Delete</button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : "<p>No permissions found.</p>"
          }
        `;
          contentArea.html(permissionsHTML);

          // Render pagination
          $("#paginationArea").pagination(totalPages, page);

          $("#addPermissionBtn").click(() => this.showForm(contentArea, projectId, permissionService, roleService));

          $(".editPermissionBtn").click((e) => {
            const permissionId = $(e.target).data("id");
            this.showForm(contentArea, projectId, permissionService, roleService, permissionId);
          });

          $(".deletePermissionBtn").click((e) => {
            const permissionId = $(e.target).data("id");
            if (confirm("Are you sure you want to delete this permission?")) {
              permissionService
                .delete(projectId, permissionId)
                .then(() => {
                  notification.show("Permission deleted successfully", "success");
                  this.load(contentArea, projectId, permissionService, roleService, options);
                })
                .catch((error) => {
                  notification.show("Error deleting permission: " + error.message, "error");
                });
            }
          });
        })
        .catch((error) => {
          contentArea.html("<p>Error loading permissions.</p>");
          console.error("Error loading data:", error);
          notification.show("Error loading permissions: " + error.message, "error");
        });
    },

    showForm: function (contentArea, projectId, permissionService, roleService, permissionId = null) {
      const title = permissionId ? "Edit Permission" : "Add Permission";
      const page = 1, itemsPerPage = 10;

      roleService
        .getAll(projectId, { page, itemsPerPage })
        .then((rolesResponse) => {
          const roles = Array.isArray(rolesResponse.data) ? rolesResponse.data : [];
          const formHTML = `
        <h2 class="text-xl mb-4">${title}</h2>
        <form id="permissionForm">
          <input type="text" id="permissionName" placeholder="Name" class="w-full p-2 mb-4 border rounded" required>
          <textarea id="permissionDescription" placeholder="Description" class="w-full p-2 mb-4 border rounded" rows="3"></textarea>
          <div class="mb-4">
            <label class="block mb-2">Assign to Roles:</label>
            ${roles
              .map(
                (role) => `
              <div>
                <input type="checkbox" id="role_${role.id}" name="roles" value="${role.id}">
                <label for="role_${role.id}">${role.name}</label>
              </div>
            `
              )
              .join("")}
          </div>
          <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">${title}</button>
        </form>
      `;

          contentArea.html(formHTML);

          if (permissionId) {
            permissionService.getById(projectId, permissionId).then((permission) => {
              $("#permissionName").val(permission.name);
              $("#permissionDescription").val(permission.description);
              if (Array.isArray(permission.roles)) {
                permission.roles.forEach((role) => {
                  $(`#role_${role.id}`).prop("checked", true);
                });
              }
            });
          }

          $("#permissionForm").on("submit", (e) => {
            e.preventDefault();
            const permissionData = {
              name: $("#permissionName").val(),
              description: $("#permissionDescription").val(),
              role_ids: $('input[name="roles"]:checked')
                .map(function () {
                  return this.value;
                })
                .get(),
            };

            const action = permissionId
              ? permissionService.update(projectId, permissionId, permissionData)
              : permissionService.create(projectId, permissionData);

            action
              .then(() => {
                notification.show(`Permission ${permissionId ? "updated" : "created"} successfully`, "success");
                this.load(contentArea, projectId, permissionService, roleService);
              })
              .catch((error) => {
                notification.show(`Error ${permissionId ? "updating" : "creating"} permission: ` + error.message, "error");
              });
          });
        })
        .catch((error) => {
          contentArea.html("<p>Error loading roles.</p>");
          console.error("Error loading roles:", error);
          notification.show("Error loading roles: " + error.message, "error");
        });
    },

    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, { detail: data });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    },
  };
}
