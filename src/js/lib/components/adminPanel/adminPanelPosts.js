/**
 * @file adminPanelPosts.js
 * @description Post management functions for the admin panel
 * @module components/adminPanelPosts
 */

/**
 * Loads and displays the list of posts
 * @param {Object} contentArea - The content area element
 * @param {string} projectId - The ID of the current project
 * @param {Object} postsComponent - The posts management component
 * @param {Object} options - Additional options (e.g., pagination)
 */
export function loadPosts(contentArea, projectId, postsComponent, options = {}) {
  const { page = 1, itemsPerPage = 15 } = options;

  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  postsComponent
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
        viewPost(contentArea, projectId, postsComponent, postId);
      });
      $(".editPostBtn").click(function () {
        const postId = $(this).data("id");
        showPostForm(contentArea, projectId, postsComponent, postId);
      });
      $(".deletePostBtn").click(function () {
        const postId = $(this).data("id");
        if (confirm("Are you sure you want to delete this post?")) {
          deletePost(contentArea, projectId, postsComponent, postId);
        }
      });
    })
    .catch((error) => {
      contentArea.html("<p>Error loading posts.</p>");
      notification.show("Error loading posts: " + error.message, "error");
    });
}
