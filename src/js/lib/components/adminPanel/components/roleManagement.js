// components/roleManagement.js

export function createRoleManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  return {
    load: function (contentArea, projectId, roleService, permissionService, options = {}) {
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
                    <td>${role.permissions ? role.permissions.map((p) => p.name).join(", ") : ""}</td>
                    <td>
                      <button class="editRoleBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2" data-id="${role.id}">Edit</button>
                      <button class="managePermissionsBtn px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2" data-id="${
                        role.id
                      }">Manage Permissions</button>
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

          $("#addRoleBtn").click(() => this.showForm(contentArea, projectId, roleService, permissionService));
          $(".editRoleBtn").click((e) => {
            const roleId = $(e.target).data("id");
            this.showForm(contentArea, projectId, roleService, permissionService, roleId);
          });
          $(".managePermissionsBtn").click((e) => {
            const roleId = $(e.target).data("id");
            this.showPermissionForm(contentArea, projectId, roleService, permissionService, roleId);
          });
          $(".deleteRoleBtn").click((e) => {
            const roleId = $(e.target).data("id");
            if (confirm("Are you sure you want to delete this role?")) {
              roleService
                .delete(projectId, roleId)
                .then(() => {
                  notification.show("Role deleted successfully", "success");
                  this.load(contentArea, projectId, roleService, permissionService, options);
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

    showForm: function (contentArea, projectId, roleService, permissionService, roleId = null) {
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
        roleService.getById(projectId, roleId).then((role) => {
          $("#roleName").val(role.name);
          $("#roleDescription").val(role.description);
        });
      }

      $("#roleForm").on("submit", (e) => {
        e.preventDefault();
        const roleData = {
          name: $("#roleName").val(),
          description: $("#roleDescription").val(),
        };

        const action = roleId ? roleService.update(projectId, roleId, roleData) : roleService.create(projectId, roleData);

        action
          .then(() => {
            notification.show(`Role ${roleId ? "updated" : "created"} successfully`, "success");
            this.load(contentArea, projectId, roleService, permissionService);
          })
          .catch((error) => {
            notification.show(`Error ${roleId ? "updating" : "creating"} role: ${error.message}`, "error");
          });
      });
    },

    showPermissionForm: function (contentArea, projectId, roleService, permissionService, roleId) {
      const page = 1,
        itemsPerPage = 10;

      Promise.all([
        roleService.getById(projectId, roleId),
        permissionService.getAll(projectId, { page, itemsPerPage }),
        permissionService.getAllPermissions(projectId),
      ]).then(([role, allPermissions, allNamePermissions]) => {
        const rolePermissions = role.permissions || [];
        const allPermissionsList = allPermissions.data || [];
        const namePermissionsList = allNamePermissions.data || []; //Add New Permission

        let permissionFormHTML = `
          <h2 class="text-xl mb-4">Manage Permissions for ${role.name}</h2>
          <form id="permissionForm">
            <div id="permissionList" class="mb-4">
              <h3 class="text-lg mb-2">Current Permissions:</h3>
              ${this.renderPermissionList(rolePermissions, true)}
            </div>
            <div id="availablePermissionList" class="mb-4">
              <h3 class="text-lg mb-2">Available Permissions:</h3>
              ${this.renderPermissionList(
                allPermissionsList.filter((p) => !rolePermissions.some((rp) => rp.id === p.id)),
                false
              )}
            </div>
            <div class="mb-4">
              <h3 class="text-lg mb-2">Add New Permission:</h3>
              <input type="text" id="newPermissionName" placeholder="New Permission Name" class="w-full p-2 mb-2 border rounded">
              <textarea id="newPermissionDescription" placeholder="New Permission Description" class="w-full p-2 mb-2 border rounded" rows="3"></textarea>
              <button type="button" id="addNewPermissionBtn" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Add New Permission</button>
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Save Changes</button>
          </form>
        `;

        contentArea.html(permissionFormHTML);

        $("#addNewPermissionBtn").click(() => {
          const newPermName = $("#newPermissionName").val();
          const newPermDesc = $("#newPermissionDescription").val();
          if (newPermName) {
            permissionService
              .create(projectId, { name: newPermName, description: newPermDesc, role_ids: [roleId] })
              .then((newPermission) => {
                rolePermissions.push(newPermission);
                this.renderPermissionList(rolePermissions, true);
                $("#newPermissionName").val("");
                $("#newPermissionDescription").val("");
                notification.show("New permission added successfully", "success");
              })
              .catch((error) => {
                notification.show("Error adding new permission: " + error.message, "error");
              });
          }
        });

        $("#permissionForm").on("submit", (e) => {
          e.preventDefault();
          console.log($('input[name="role_permissions"]:checked'));
          const updatedPermissionIds = $('input[name="role_permissions"]:checked')
            .map(function () {
              return this.value;
            })
            .getElements();

          console.log(
            $('input[name="roles"]:checked')
              .map(function () {
                console.log(this.value);
                return this.value;
              })
              .getElements()
          );

          console.log(
            $('input[name="roles"]:checked')
              .map(function () {
                console.log(this.value);
                return this.value;
              })
              .getElements(0)
          );
          roleService
            .assignMultiplePermissions(projectId, roleId, { permission_ids: updatedPermissionIds })
            .then(() => {
              notification.show("Permissions updated successfully", "success");
              this.load(contentArea, projectId, roleService, permissionService);
            })
            .catch((error) => {
              notification.show(`Error updating permissions: ${error.message}`, "error");
            });
        });
      });
    },

    renderPermissionList: function (permissions, isAssigned) {
      const permissionListHTML = permissions;
      return permissions
        .map(
          (perm) => `
        <div class="flex items-center mb-2">
          <input type="checkbox" id="perm_${perm.id}" name="role_permissions" value="${perm.id}" 
                 ${isAssigned ? "checked" : ""} class="mr-2">
          <label for="perm_${perm.id}">${perm.name} - ${perm.description || ""}</label>
        </div>
      `
        )
        .join("");
    },

    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, { detail: data });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    },
  };
}
