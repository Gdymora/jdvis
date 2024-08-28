// components/tableManagement.js

export function createPostManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  return {
    load: function (contentArea, projectId, postService, options = {}) {
      const { page = 1, itemsPerPage = 15 } = options;

      postService
        .getAll(projectId, { page, itemsPerPage })
        .then((response) => {
          const posts = response.data;
          let postsHTML = `
            <h2 class="text-lg font-semibold mb-4">Posts</h2>
            <button id="addPostBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              <i class="fa-regular fa-square-plus fa-xl" style="color: #3e1e9f"></i>
            </button>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="fa-solid fa-wrench"></i>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                ${posts
                  .map(
                    (post, index) => `
                  <tr class="text-black">
                    <td class="px-6 py-4 whitespace-nowrap">${index + 1}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${post.title}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${post.created_at}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <button class="viewPostBtn p-2 bg-blue-500 text-white rounded-md mr-2" data-id="${post.id}">
                        <i class="fa-regular fa-eye"></i>
                      </button>
                      <button class="editPostBtn bg-none rounded-md mx-2" data-id="${post.id}">
                        <i class="fa-solid fa-pencil" style="color: #429424"></i>
                      </button>
                      <button class="deletePostBtn bg-none rounded-md mx-2" data-id="${post.id}">
                        <i class="fa-regular fa-trash-can" style="color: #ea3f06"></i>
                      </button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          `;

          contentArea.html(postsHTML);

          // Add event listeners
          $("#addPostBtn").click(() => showPostForm(contentArea, projectId, postsComponent));
          $(".viewPostBtn").click(function () {
            const postId = $(this).data("id");
            this.viewPost(contentArea, projectId, postsComponent, postId);
          });
          $(".editPostBtn").click(function () {
            const postId = $(this).data("id");
            this.showForm(contentArea, projectId, postsComponent, postId);
          });
          $(".deletePostBtn").click(function () {
            const postId = $(this).data("id");
            if (confirm("Are you sure you want to delete this post?")) {
              this.deletePost(contentArea, projectId, postsComponent, postId);
            }
          });
        })
        .catch((error) => {
          contentArea.html("<p>Error loading posts.</p>");
          notification.show("Error loading posts: " + error.message, "error");
        });
    },

    showForm: function (contentArea, projectId, roleService, roleId = null) {
      const title = tableId ? "Edit Table Structure" : "Create New Table Structure";
      const formHTML = `
      <h2 class="text-xl mb-4">${title}</h2>
      <form id="tableStructureForm">
        <input type="text" id="tableName" placeholder="Table Name" class="w-full p-2 mb-4 border rounded" required>
        <div id="tableFields"></div>
        <button type="button" id="addFieldBtn" class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Field</button>
        <button type="submit" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">${tableId ? "Update" : "Create"} Table</button>
      </form>
    `;

      contentArea.html(formHTML);

      let fields = [{ name: "", type: "text", tag: "", filter: null }];

      function renderFields() {
        $("#tableFields").html(
          fields
            .map(
              (field, index) => `
          <div class="field-row mb-2">
            <input type="text" name="fieldName" placeholder="Field Name" value="${field.name}" class="p-2 border rounded mr-2" required>
            <select name="fieldType" class="p-2 border rounded mr-2">
              <option value="text" ${field.type === "text" ? "selected" : ""}>Text</option>
              <option value="number" ${field.type === "number" ? "selected" : ""}>Number</option>
              <option value="date" ${field.type === "date" ? "selected" : ""}>Date</option>
            </select>
            <select name="fieldTag" class="p-2 border rounded mr-2">
              <option value="">Select tag</option>
              <option value="img" ${field.tag === "img" ? "selected" : ""}>image</option>
              <option value="p" ${field.tag === "p" ? "selected" : ""}>text</option>
              <option value="div" ${field.tag === "div" ? "selected" : ""}>div</option>
            </select>
            ${
              index === 0
                ? `
              <label>
                <input type="checkbox" name="fieldFilter" ${field.filter ? "checked" : ""}> Filter
              </label>
            `
                : ""
            }
            <button type="button" class="removeFieldBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2">Remove</button>
          </div>
        `
            )
            .join("")
        );

        $(".removeFieldBtn").click(function () {
          const index = $(this).closest(".field-row").index();
          fields.splice(index, 1);
          renderFields();
        });
      }

      renderFields();

      $("#addFieldBtn").click(() => {
        fields.push({ name: "", type: "text", tag: "", filter: null });
        renderFields();
      });

      if (tableId) {
        tableStructureComponent.getById(projectId, tableId).then((table) => {
          $("#tableName").val(table.table_name);
          fields = JSON.parse(table.table_structure);
          renderFields();
        });
      }

      $("#tableStructureForm").on("submit", (e) => {
        e.preventDefault();
        const tableData = {
          table_name: $("#tableName").val(),
          table_structure: fields.map((_, index) => ({
            name: $("input[name='fieldName']").eq(index).val(),
            type: $("select[name='fieldType']").eq(index).val(),
            tag: $("select[name='fieldTag']").eq(index).val(),
            filter: index === 0 ? $("input[name='fieldFilter']").prop("checked") : null,
          })),
        };

        const action = tableId ? tableStructureComponent.update(projectId, tableId, tableData) : tableStructureComponent.create(projectId, tableData);

        action
          .then(() => {
            notification.show(`Table ${tableId ? "updated" : "created"} successfully`, "success");
            this.load(contentArea, projectId, tableStructureComponent);
          })
          .catch((error) => {
            notification.show(`Error ${tableId ? "updating" : "creating"} table: ${error.message}`, "error");
          });
      });
    },
    viewPost: function (contentArea, projectId, postService, postId) {
      // Implement viewPost functionality here
      // This function will be called when viewing a post
    },
    deletePost: function (contentArea, projectId, postService, postId) {
      // Implement deletePost functionality here
      // This function will be called when deleting a post
    },

    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, { detail: data });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    },
  };
}
