// components/roleManagement.js

export function createRoleManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  return {
    load: function (contentArea, projectId, roleService, options = {}) {
      const { page = 1, itemsPerPage = 10 } = options;

      roleService
        .getAll(projectId, { page, itemsPerPage })
        .then((response) => {
          const roles = response.data;
          const totalPages = response.last_page;

          let rolesHTML = `
            <h2 class="text-xl mb-4">Roles</h2>
            <button id="addRoleBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add Role</button>
            <table class="w-full">
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Description</th>
                  <th class="text-left">Permissions</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${roles
                  .map(
                    (role) => `
                  <tr>
                    <td>${role.name}</td>
                    <td>${role.description || ""}</td>
                    <td>${role.permissions ? role.permissions.map(p => p.name).join(", ") : ""}</td>
                    <td>
                      <button class="editRoleBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2" data-id="${role.id}">Edit</button>
                      <button class="managePermissionsBtn px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2" data-id="${role.id}">Manage Permissions</button>
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

          $("#addRoleBtn").click(() => this.showForm(contentArea, projectId, roleService));
          $(".editRoleBtn").click((e) => {
            const roleId = $(e.target).data("id");
            this.showForm(contentArea, projectId, roleService, roleId);
          });
          $(".managePermissionsBtn").click((e) => {
            const roleId = $(e.target).data("id");
            this.showPermissionForm(contentArea, projectId, roleService, roleId);
          });
          $(".deleteRoleBtn").click((e) => {
            const roleId = $(e.target).data("id");
            if (confirm("Are you sure you want to delete this role?")) {
              roleService
                .delete(projectId, roleId)
                .then(() => {
                  notification.show("Role deleted successfully", "success");
                  this.load(contentArea, projectId, roleService, options);
                })
                .catch((error) => {
                  notification.show(`Error deleting role: ${error.message}`, "error");
                });
            }
          });
        })
        .catch((error) => {
          contentArea.html("<p>Error loading roles.</p>");
          notification.show(`Error loading roles: ${error.message}`, "error");
        });
    },

    showForm: function (contentArea, projectId, roleService, roleId = null) {
      // ... (залишається без змін)
    },

    showPermissionForm: function (contentArea, projectId, roleService, roleId) {
      roleService.getById(projectId, roleId).then((role) => {
        let permissionFormHTML = `
          <h2 class="text-xl mb-4">Manage Permissions for ${role.name}</h2>
          <form id="permissionForm">
            <div id="permissionList"></div>
            <input type="text" id="newPermissionName" placeholder="New Permission Name" class="w-full p-2 mb-4 border rounded">
            <textarea id="newPermissionDescription" placeholder="New Permission Description" class="w-full p-2 mb-4 border rounded" rows="3"></textarea>
            <button type="button" id="addPermissionBtn" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mb-4">Add New Permission</button>
            <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Save Permissions</button>
          </form>
        `;

        contentArea.html(permissionFormHTML);

        this.renderPermissionList(role.permissions || []);

        $("#addPermissionBtn").click(() => {
          const newPermName = $("#newPermissionName").val();
          const newPermDesc = $("#newPermissionDescription").val();
          if (newPermName) {
            role.permissions = role.permissions || [];
            role.permissions.push({ name: newPermName, description: newPermDesc });
            this.renderPermissionList(role.permissions);
            $("#newPermissionName").val("");
            $("#newPermissionDescription").val("");
          }
        });

        $("#permissionForm").on("submit", (e) => {
          e.preventDefault();
          roleService.update(projectId, roleId, { permissions: role.permissions })
            .then(() => {
              notification.show("Permissions updated successfully", "success");
              this.load(contentArea, projectId, roleService);
            })
            .catch((error) => {
              notification.show(`Error updating permissions: ${error.message}`, "error");
            });
        });
      });
    },

    renderPermissionList: function (permissions) {
      const permissionListHTML = permissions.map((perm, index) => `
        <div class="flex items-center mb-2">
          <input type="text" value="${perm.name}" class="p-2 border rounded mr-2" readonly>
          <button type="button" class="deletePermBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-index="${index}">Delete</button>
        </div>
      `).join("");

      $("#permissionList").html(permissionListHTML);

      $(".deletePermBtn").click((e) => {
        const index = $(e.target).data("index");
        permissions.splice(index, 1);
        this.renderPermissionList(permissions);
      });
    },

    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, { detail: data });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    },
  };
}