// components/roleManagement.js

export function createRoleManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  return {
    load: function (contentArea, projectId, roleService, options = {}) {
      const { page = 1, itemsPerPage = 10 } = options;

      const notification = $().notification({
        position: "top-right",
        duration: 3000,
      });

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
                    <td>
                      <button class="editRoleBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2" data-id="${role.id}">Edit</button>
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
          $(".editRoleBtn").click(function () {
            const roleId = $(this).data("id");
            this.showForm(contentArea, projectId, roleService, roleId);
          });
          $(".deleteRoleBtn").click(function () {
            const roleId = $(this).data("id");
            if (confirm("Are you sure you want to delete this role?")) {
              roleService
                .delete(projectId, roleId)
                .then(() => {
                  // Обробка успішного завантаження
                  notification.show("Roles loaded successfully", "success");
                  this.load(contentArea, projectId, roleService, options);
                })
                .catch((error) => {
                  // Обробка помилки
                  notification.show(`Error loading roles: ${error.message}`, "error");
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

      $("#roleForm").submit(function (e) {
        e.preventDefault();
        const roleData = {
          name: $("#roleName").val(),
          description: $("#roleDescription").val(),
        };

        const action = roleId ? roleService.update(projectId, roleId, roleData) : roleService.create(projectId, roleData);

        action
          .then(() => {
            notification.show(`Role ${roleId ? "updated" : "created"} successfully`, "success");
            this.load(contentArea, projectId, roleService);
          })
          .catch((error) => {
            notification.show(`Error loading roles: ${error.message}`, "error");
          });
      });
    },
  };
}
