// components/postManagement.js

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
          const data = response.data;
          if (data && data.length > 0) {
            const tableHTML = `
              <h2 class="text-xl mb-4">Posts</h2>
              <div class="overflow-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project ID</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Tables ID</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table Name</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table Structure</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    ${data
                      .map(
                        (item) => `
                      <tr class="text-black">
                        <td class="px-6 py-4 whitespace-nowrap">${item.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${item.project_id}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${item.user_tables_id}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${item.user_table.table_name}</td>
                        <td class="px-6 py-4 whitespace-nowrap tooltip-trigger" data-full-text="${encodeURIComponent(JSON.stringify(item.data))}">
                          ${JSON.stringify(item.data).substring(0, 15)}...
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap tooltip-trigger" data-full-text="${encodeURIComponent(JSON.stringify(item.user_table.table_structure))}">
                          ${JSON.stringify(item.user_table.table_structure).substring(0, 15)}...
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <button class="addPostBtn bg-green-500 text-white px-2 py-1 rounded mr-2" data-id="${item.id}">Add</button>
                          <button class="editPostBtn bg-blue-500 text-white px-2 py-1 rounded mr-2" data-id="${item.id}">Edit</button>
                          <button class="deletePostBtn bg-red-500 text-white px-2 py-1 rounded" data-id="${item.id}">Delete</button>
                        </td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            `;

            contentArea.html(tableHTML);

            $(".addPostBtn").click((e) => {
              const rowId = $(e.target).data("id");
              this.showPostForm(contentArea, projectId, postService, rowId, 'add');
            });
            $(".editPostBtn").click((e) => {
              const rowId = $(e.target).data("id");
              this.showPostForm(contentArea, projectId, postService, rowId, 'edit');
            });
            $(".deletePostBtn").click((e) => {
              const rowId = $(e.target).data("id");
              this.deletePost(contentArea, projectId, postService, rowId);
            });

            this.addTooltipFunctionality();
          } else {
            contentArea.html("<p>No data available.</p>");
          }
        })
        .catch((error) => {
          contentArea.html("<p>Error loading data.</p>");
          console.error("Error loading data:", error);
        });
    },

    showPostForm: function (contentArea, projectId, postService, rowId, mode) {
      postService.getById(projectId, rowId).then((row) => {
        const tableStructure = JSON.parse(row.user_table.table_structure);
        const rowData = mode === 'edit' ? JSON.parse(row.data) : {};

        let formHTML = `
          <h2 class="text-xl mb-4">${mode === 'edit' ? 'Edit' : 'Add'} Post for ${row.user_table.table_name}</h2>
          <form id="postForm">
            ${tableStructure.map((field) => `
              <div class="mb-4">
                <label for="${field.name}" class="block text-sm font-medium text-gray-700">${field.name}</label>
                <input type="${field.type}" id="${field.name}" name="${field.name}" 
     <!--TODO-->             value="${mode === 'edit' ? (rowData[0][field.name] || "") : ""}"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
            `).join("")}
            <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              ${mode === 'edit' ? 'Update' : 'Add'} Post
            </button>
          </form>
        `;

        contentArea.html(formHTML);

        $("#postForm").on('submit', (e) => {
          e.preventDefault();
          const formData = {};
          tableStructure.forEach((field) => {
            formData[field.name] = $(`#${field.name}`).val();
          });

          const action = mode === 'edit'
            ? postService.update(projectId, rowId, formData)
            : postService.create(projectId, rowId, formData);

          action
            .then(() => {
              notification.show(`Post ${mode === 'edit' ? "updated" : "created"} successfully`, "success");
              this.load(contentArea, projectId, postService);
            })
            .catch((error) => {
              notification.show(`Error ${mode === 'edit' ? "updating" : "creating"} post: ${error.message}`, "error");
            });
        });
      });
    },

    deletePost: function (contentArea, projectId, postService, rowId) {
      if (confirm("Are you sure you want to delete this post?")) {
        postService
          .delete(projectId, rowId)
          .then(() => {
            notification.show("Post deleted successfully", "success");
            this.load(contentArea, projectId, postService);
          })
          .catch((error) => {
            notification.show(`Error deleting post: ${error.message}`, "error");
          });
      }
    },

    addTooltipFunctionality: function() {
      $(".tooltip-trigger").hover(
        function () {
          const tooltip = $().create('<div class="tooltip"></div>');
          const fullText = decodeURIComponent($(this).data("full-text"));

          $(tooltip).text(fullText);

          const triggerRect = $(this).offset();
          const tooltipRect = $(tooltip).offset();

          const top = triggerRect.top + window.scrollY - tooltipRect.height - 10;
          const left = triggerRect.left + window.scrollX;

          $(tooltip).css({
            position: "absolute",
            top: `${top}px`,
            left: `${left}px`,
            background: "#333",
            color: "#fff",
            padding: "10px",
            borderRadius: "5px",
            maxWidth: "400px",
            maxHeight: "300px",
            overflowY: "auto",
            wordWrap: "break-word",
            zIndex: 1000,
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            fontSize: "14px",
            lineHeight: "1.4",
          });
          $(this).append(tooltip);
        },
        function () {
          $(".tooltip").remove();
        }
      );
    },

    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, { detail: data });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    },
  };
}