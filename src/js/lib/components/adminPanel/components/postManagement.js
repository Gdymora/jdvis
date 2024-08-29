// components/postManagement.js

export function createPostManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  return {
    load: function (contentArea, projectId, postService, options = {}) {
      const { page = 1, itemsPerPage = 15 } = options;
      let table_structure = [];
      let dataTable = [];
      let showButtonSave = false;
    
      postService.getAll(projectId, { page, itemsPerPage })
        .then((response) => {
          const data = response.data;
          if (data && Object.keys(data).length > 0) {
            table_structure = JSON.parse(data.table_structure);
            dataTable = data.table_data && data.table_data[0] ? JSON.parse(data.table_data[0].data) : [];
            
            const tableHTML = `
              <div class="overflow-auto">
                <div class="flex justify-center">
                  <h2 class="text-lg font-semibold m-4">${data.user_table?.table_name} ${data.user_table?.id}</h2>
                  ${showButtonSave ? `
                    <button id="saveTableBtn" class="justify-right bg-none rounded-md mx-2">
                      <i class="fa-regular fa-floppy-disk fa-beat fa-lg" style="color: #96f3d7;"></i>
                    </button>
                    <button id="resetTableBtn" class="justify-right bg-none rounded-md mx-2">Reset</button>
                  ` : ''}
                </div>
    
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      ${table_structure.map(column => `
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ${column.name}
                        </th>
                      `).join('')}
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <i class="fa-solid fa-wrench"></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    ${dataTable.map((row, rowIndex) => `
                      <tr class="text-black">
                        ${table_structure.map(column => `
                          <td class="px-6 py-4 whitespace-nowrap">
                            ${row[column.name]}
                          </td>
                        `).join('')}
                        <td class="px-6 py-4 whitespace-nowrap">
                          <button ${showButtonSave ? 'disabled' : ''} class="editRowBtn bg-none rounded-md mx-2" data-row-index="${rowIndex}">
                            <i class="fa-solid fa-pencil" style="color: ${showButtonSave ? '#ccc' : '#429424'};"></i>
                          </button>
                          <button ${showButtonSave ? 'disabled' : ''} class="deleteRowBtn bg-none rounded-md mx-2" data-row-index="${rowIndex}">
                            <i class="fa-regular fa-trash-can" style="color: ${showButtonSave ? '#ccc' : '#ea3f06'};"></i>
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `;
    
            contentArea.html(tableHTML);
    
            // Add event listeners
            $('.editRowBtn').click((e) => {
              const rowIndex = $(e.currentTarget).data('row-index');
              this.openModalUpdate(dataTable[rowIndex], rowIndex);
            });
    
            $('.deleteRowBtn').click((e) => {
              const rowIndex = $(e.currentTarget).data('row-index');
              this.handleDeleteRow(rowIndex);
            });
    
            $('#saveTableBtn').click(() => this.handleUpdateTable(projectId, postService, data.id));
            $('#resetTableBtn').click(() => this.reset(data));
          } else {
            contentArea.html("<p>No data available.</p>");
          }
        })
        .catch((error) => {
          contentArea.html("<p>Error loading posts.</p>");
          notification.show("Error loading posts: " + error.message, "error");
        });
    
      this.openModalUpdate = (row, rowIndex) => {
        // Implement modal opening logic here
        console.log('Open modal for updating row', rowIndex);
      };
    
      this.handleDeleteRow = (rowIndex) => {
        dataTable.splice(rowIndex, 1);
        showButtonSave = true;
        this.load(contentArea, projectId, postService, options);
      };
    
      this.handleUpdateTable = (projectId, postService, tableId) => {
        const updateData = { user_tables_id: tableId, data: dataTable };
        postService.update(projectId, tableId, updateData)
          .then(() => {
            notification.show("Table updated successfully", "success");
            showButtonSave = false;
            this.load(contentArea, projectId, postService, options);
          })
          .catch((error) => {
            notification.show("Error updating table: " + error.message, "error");
          });
      };
    
      this.reset = (originalData) => {
        dataTable = originalData.table_data && originalData.table_data[0] ? JSON.parse(originalData.table_data[0].data) : [];
        showButtonSave = false;
        this.load(contentArea, projectId, postService, options);
      };
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
      $("#postForm").submit(function(e) {
        e.preventDefault();
        const postData = {
          title: $("#postTitle").val(),
          content: $("#postContent").val(),
        };

        const action = postId ? 
          postService.update(projectId, postId, postData) : 
          postService.create(projectId, postData);

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
        $('#editPostBtn').click(() => self.showPostForm(contentArea, projectId, postService, postId));
        $('#deletePostBtn').click(() => self.deletePost(contentArea, projectId, postService, postId));
      });
    },

    deletePost: function (contentArea, projectId, postService, postId) {
      if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        postService.delete(projectId, postId)
          .then(() => {
            notification.show('Post deleted successfully', 'success');
            this.load(contentArea, projectId, postService);
          })
          .catch((error) => {
            notification.show(`Error deleting post: ${error.message}`, 'error');
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