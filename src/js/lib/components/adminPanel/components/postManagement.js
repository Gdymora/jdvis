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
                        (item, index) => `
                      <tr class="text-black">
                        <td class="px-6 py-4 whitespace-nowrap">${item.id}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${item.project_id}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${item.user_tables_id}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${item.user_table.table_name}</td>
                        <td class="px-6 py-4 whitespace-nowrap tooltip-trigger" data-full-text="${encodeURIComponent(item.data)}">
                          ${item.data.length > 15 ? item.data.substring(0, 15) + "..." : item.data}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap tooltip-trigger" data-full-text="${encodeURIComponent(item.user_table.table_structure)}">
                          ${
                            item.user_table.table_structure.length > 15
                              ? item.user_table.table_structure.substring(0, 15) + "..."
                              : item.user_table.table_structure
                          }
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <button class="editRowBtn bg-blue-500 text-white px-2 py-1 rounded mr-2" data-row-index="${index}">Edit</button>
                          <button class="deleteRowBtn bg-red-500 text-white px-2 py-1 rounded" data-row-index="${index}">Delete</button>
                        </td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
              <button id="addRowBtn" class="mt-4 bg-green-500 text-white px-4 py-2 rounded">Add Row</button>
            `;

            contentArea.html(tableHTML);

            // Add event listeners
            $(".editRowBtn").click((event) => {
              const rowIndex = $(event.currentTarget).data("row-index");
              this.openModalUpdate(data[rowIndex], rowIndex);
            });

            $(".deleteRowBtn").click((event) => {
              const rowIndex = $(event.currentTarget).data("row-index");
              if (confirm("Are you sure you want to delete this row?")) {
                this.handleDeleteRow(rowIndex);
              }
            });

            $("#addRowBtn").click(() => this.showFillTableForm(contentArea, projectId, postService, data[0].user_tables_id, "first"));

            // Add tooltip functionality
            $(".tooltip-trigger").hover(
              function () {
                const tooltip = $().create('<div class="tooltip"></div>');
                const fullText = decodeURIComponent($(this).data("full-text"));

                console.log(fullText);
                $(tooltip).text(fullText); // Pretty-print the JSON for better readability

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
          } else {
            contentArea.html("<p>No data available.</p>");
          }
        })
        .catch((error) => {
          contentArea.html("<p>Error loading data.</p>");
          console.error("Error loading data:", error);
        });
    },

    showFillTableForm: async function (contentArea, projectId, tableStructureService, tableDataService, tableId, action, rowIndex = null) {
      tableStructureService.getById(projectId, tableId).then((tableData) => {
        const tableStructure = JSON.parse(tableData.table_structure);
        const tableDataParsed = tableData.table_data && tableData.table_data[0] ? JSON.parse(tableData.table_data[0].data) : [];

        let formHTML = `
          <h2>${action === "first" ? "Add" : "Edit"} Row</h2>
          <form id="fillTableForm">
            ${tableStructure
              .map(
                (field) => `
              <div>
                <label for="${field.name}">${field.name}</label>
                <input type="${field.type}" id="${field.name}" name="${field.name}" 
                  value="${action === "second" && rowIndex !== null ? tableDataParsed[rowIndex][field.name] || "" : ""}"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
              </div>
            `
              )
              .join("")}
            <button type="submit" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </form>
        `;

        contentArea.html(formHTML);

        $("#fillTableForm").on("submit", async (e) => {
          e.preventDefault();

          const formData = tableStructure.reduce((acc, field) => {
            acc[field.name] = $(`#${field.name}`).val();
            return acc;
          }, {});

          const updatedTableData =
            action === "first" ? [...tableDataParsed, formData] : tableDataParsed.map((item, index) => (index === rowIndex ? formData : item));

          const requestData = {
            user_tables_id: tableId,
            data: JSON.stringify(updatedTableData),
          };

          try {
            if (action === "first") {
              await this.createTableData(contentArea, projectId, tableStructureService, tableDataService, requestData);
            } else if (action === "second" && rowIndex !== null) {
              await this.updateTableData(contentArea, projectId, tableStructureService, tableDataService, tableId, requestData);
            }
            // Можна додати повідомлення про успіх або інші дії після успішного виконання
          } catch (error) {
            console.error("Error updating table data:", error);
            // Можна додати відображення помилки для користувача
          }
        });
      });
    },

    createTableData: function (contentArea, projectId, tableStructureService, tableDataService, newData) {
      tableDataService.create(projectId, newData).then(() => {
        alert("Table data updated successfully");
        this.viewTable(contentArea, projectId, tableStructureService, tableDataService, newData.user_tables_id);
      });
    },

    updateTableData: function (contentArea, projectId, tableStructureService, tableDataService, tableId, newData) {
      tableDataService.update(projectId, tableId, newData).then(() => {
        alert("Table data updated successfully");
        this.viewTable(contentArea, projectId, tableStructureService, tableDataService, newData.user_tables_id);
      });
    },

    showPostForm: function (contentArea, projectId, postService, postId = null) {
      const title = postId ? "Edit Post" : "Create New Post";
      const formHTML = `
        <h2 class="text-xl mb-4">${title}</h2>
        <form id="postForm">
          <input type="text" id="postTitle" placeholder="Post Title" class="w-full p-2 mb-4 border rounded" required>
          <textarea id="postContent" placeholder="Post Content" class="w-full p-2 mb-4 border rounded" rows="6" required></textarea>
          <button type="submit" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">${postId ? "Update" : "Create"} Post</button>
        </form>
      `;

      contentArea.html(formHTML);

      if (postId) {
        postService.getById(projectId, postId).then((post) => {
          $("#postTitle").val(post.title);
          $("#postContent").val(post.content);
        });
      }

      const self = this;
      $("#postForm").submit(function (e) {
        e.preventDefault();
        const postData = {
          title: $("#postTitle").val(),
          content: $("#postContent").val(),
        };

        const action = postId ? postService.update(projectId, postId, postData) : postService.create(projectId, postData);

        action
          .then(() => {
            notification.show(`Post ${postId ? "updated" : "created"} successfully`, "success");
            self.load(contentArea, projectId, postService);
          })
          .catch((error) => {
            notification.show(`Error ${postId ? "updating" : "creating"} post: ${error.message}`, "error");
          });
      });
    },

    viewPost: function (contentArea, projectId, postService, postId) {
      postService.getById(projectId, postId).then((post) => {
        let postHTML = `
          <h2 class="text-xl mb-4">${post.title}</h2>
          <p><strong>Created at:</strong> ${post.created_at}</p>
          <p><strong>Updated at:</strong> ${post.updated_at}</p>
          <div class="mt-4">
            ${post.content}
          </div>
          <div class="mt-4">
            <button id="editPostBtn" class="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit</button>
            <button id="deletePostBtn" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </div>
        `;

        contentArea.html(postHTML);

        const self = this;
        $("#editPostBtn").click(() => self.showPostForm(contentArea, projectId, postService, postId));
        $("#deletePostBtn").click(() => self.deletePost(contentArea, projectId, postService, postId));
      });
    },

    deletePost: function (contentArea, projectId, postService, postId) {
      if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
        postService
          .delete(projectId, postId)
          .then(() => {
            notification.show("Post deleted successfully", "success");
            this.load(contentArea, projectId, postService);
          })
          .catch((error) => {
            notification.show(`Error deleting post: ${error.message}`, "error");
          });
      }
    },

    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, { detail: data });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    },
  };
}
