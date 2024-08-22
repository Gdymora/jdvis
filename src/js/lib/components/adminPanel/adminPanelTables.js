/**
 * @file adminPanelTables.js
 * @description Table management functions for the admin panel
 * @module components/adminPanelTables
 */

/**
 * Loads and displays the list of tables
 * @param {Object} contentArea - The content area element
 * @param {string} projectId - The ID of the current project
 * @param {Object} tableStructureComponent - The table structure management component
 * @param {Object} options - Additional options (e.g., pagination)
 */
export function loadTables(contentArea, projectId, tableStructureComponent, options = {}) {
  const { page = 1, itemsPerPage = 15 } = options;

  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  tableStructureComponent
    .getAll(projectId, { page, itemsPerPage })
    .then((response) => {
      const tables = response.data || [];
      let tablesHTML = `
        <h2 class="text-lg font-semibold mb-4">User Tables</h2>
        <button id="addTableBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          <i class="fa-regular fa-square-plus fa-xl" style="color: #3e1e9f"></i>
        </button>
        ${tables.length > 0 ? `
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id number</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Data</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <i class="fa-solid fa-wrench"></i>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${tables
                .map(
                  (table, index) => `
                <tr class="text-black">
                  <td class="px-6 py-4 whitespace-nowrap">${index + 1}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${table.id}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${table.table_name}</td>
                  <td class="px-6 py-4 whitespace-nowrap">data</td>
                  <td class="px-6 py-4 whitespace-nowrap">${table.created_at}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${table.updated_at}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    ${
                      table.table_data && table.table_data.length > 0 && JSON.parse(table.table_data[0].data).length > 0
                        ? `
                      <button class="viewTableBtn p-2 bg-blue-500 text-white rounded-md mr-2" data-id="${table.id}">
                        <i class="fa-regular fa-eye"></i>
                      </button>
                      <button class="fillTableBtn px-2 py-3 bg-yellow-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="second">
                        <i class="fa-regular fa-square-plus fa-lg"></i>
                      </button>
                      <button class="excelImportBtn px-2 py-3 bg-yellow-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="second">
                        <i class="fa-solid fa-file-excel fa-lg"></i>
                      </button>
                    `
                        : `
                      <button class="viewTableBtn p-2 bg-gray-500 text-white rounded-md mr-2" data-id="${table.id}" disabled>
                        <i class="fa-regular fa-eye"></i>
                      </button>
                      <button class="fillTableBtn px-2 py-3 bg-green-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="first">
                        <i class="fa-regular fa-square-plus fa-lg"></i>
                      </button>
                      <button class="excelImportBtn px-2 py-3 bg-yellow-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="first">
                        <i class="fa-solid fa-file-excel fa-lg"></i>
                      </button>
                    `
                    }
                    <button class="cloneTableBtn bg-none rounded-md mx-2" data-id="${table.id}">clone</button>
                    <button class="editTableBtn bg-none rounded-md mx-2" data-id="${table.id}">
                      <i class="fa-solid fa-pencil" style="color: #429424"></i>
                    </button>
                    <button class="deleteTableBtn bg-none rounded-md mx-2" data-id="${table.id}">
                      <i class="fa-regular fa-trash-can" style="color: #ea3f06"></i>
                    </button>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        ` : '<p class="text-center">No tables found. Click the "+" button to create a new table.</p>'}
      `;

      contentArea.html(tablesHTML);

      // Add event listeners
      $("#addTableBtn").click(() => showTableStructureForm(contentArea, projectId, tableStructureComponent));
      $(".viewTableBtn").click(function () {
        const tableId = $(this).data("id");
        viewTable(contentArea, projectId, tableStructureComponent, tableId);
      });
      $(".fillTableBtn").click(function () {
        const tableId = $(this).data("id");
        const action = $(this).data("action");
        showFillTableForm(contentArea, projectId, tableStructureComponent, tableId, action);
      });
      $(".excelImportBtn").click(function () {
        const tableId = $(this).data("id");
        const action = $(this).data("action");
        showExcelImportForm(contentArea, projectId, tableStructureComponent, tableId, action);
      });
      $(".cloneTableBtn").click(function () {
        const tableId = $(this).data("id");
        cloneTable(contentArea, projectId, tableStructureComponent, tableId);
      });
      $(".editTableBtn").click(function () {
        const tableId = $(this).data("id");
        showTableStructureForm(contentArea, projectId, tableStructureComponent, tableId);
      });
      $(".deleteTableBtn").click(function () {
        const tableId = $(this).data("id");
        if (confirm("Are you sure you want to delete this table?")) {
          deleteTable(contentArea, projectId, tableStructureComponent, tableId);
        }
      });
    })
    .catch((error) => {
      contentArea.html("<p>Error loading tables.</p>");
      notification.show("Error loading tables: " + error.message, "error");
    });
}

function showTableStructureForm(contentArea, projectId, tableStructureComponent, tableId = null) {
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
      fields.map((field, index) => `
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
          ${index === 0 ? `
            <label>
              <input type="checkbox" name="fieldFilter" ${field.filter ? "checked" : ""}> Filter
            </label>
          ` : ''}
          <button type="button" class="removeFieldBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2">Remove</button>
        </div>
      `).join('')
    );

    $(".removeFieldBtn").click(function() {
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

  $("#tableStructureForm").submit(function(e) {
    e.preventDefault();
    const tableData = {
      table_name: $("#tableName").val(),
      table_structure: fields.map((_, index) => ({
        name: $("input[name='fieldName']").eq(index).val(),
        type: $("select[name='fieldType']").eq(index).val(),
        tag: $("select[name='fieldTag']").eq(index).val(),
        filter: index === 0 ? $("input[name='fieldFilter']").prop("checked") : null
      }))
    };

    const action = tableId
      ? tableStructureComponent.update(projectId, tableId, tableData)
      : tableStructureComponent.create(projectId, tableData);

    action.then(() => {
      notification.show(`Table ${tableId ? "updated" : "created"} successfully`, "success");
      loadTables(contentArea, projectId, tableStructureComponent);
    }).catch((error) => {
      notification.show(`Error ${tableId ? "updating" : "creating"} table: ${error.message}`, "error");
    });
  });
}