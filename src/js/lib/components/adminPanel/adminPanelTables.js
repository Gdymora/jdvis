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
 * @example
 * loadTables($('#contentArea'), '123', tableStructureComponent, { page: 1, itemsPerPage: 10 });
 */
export function loadTables(contentArea, projectId, tableStructureComponent, options = {}) {
    const { page = 1, itemsPerPage = 10 } = options;
  
    tableStructureComponent
      .getAll(projectId, { page, itemsPerPage })
      .then((response) => {
        const { tables, totalPages } = response;
        let tablesHTML = `
          <h2 class="text-xl mb-4">Tables</h2>
          <button id="addTableBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add Table</button>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${tables
                .map(
                  (table) => `
                <tr>
                  <td>${table.table_name}</td>
                  <td>
                    <button class="editTableBtn px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" data-id="${table.id}">Edit</button>
                    <button class="deleteTableBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-id="${table.id}">Delete</button>
                    <button class="viewTableDataBtn px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600" data-id="${table.id}">View Data</button>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `;
        contentArea.html(tablesHTML);
  
        // Render pagination
        $("#paginationArea").pagination(totalPages, page);
  
        $("#addTableBtn").click(() => showTableForm(contentArea, projectId, tableStructureComponent));
        $(".editTableBtn").click(function () {
          const tableId = $(this).data("id");
          showTableForm(contentArea, projectId, tableStructureComponent, tableId);
        });
        $(".deleteTableBtn").click(function () {
          const tableId = $(this).data("id");
          if (confirm("Are you sure you want to delete this table?")) {
            tableStructureComponent
              .delete(projectId, tableId)
              .then(() => {
                showNotification("Table deleted successfully", "success");
                loadTables(contentArea, projectId, tableStructureComponent, options);
              })
              .catch((error) => {
                showNotification("Error deleting table: " + error.message, "error");
              });
          }
        });
        $(".viewTableDataBtn").click(function () {
          const tableId = $(this).data("id");
          loadTableData(contentArea, projectId, tableId, 1);
        });
      })
      .catch((error) => {
        contentArea.html("<p>Error loading tables.</p>");
        showNotification("Error loading tables: " + error.message, "error");
      });
  }
  
  /**
   * Shows the table form for adding or editing a table
   * @param {Object} contentArea - The content area element
   * @param {string} projectId - The ID of the current project
   * @param {Object} tableStructureComponent - The table structure management component
   * @param {string} [tableId] - The ID of the table to edit (optional)
   * @example
   * showTableForm($('#contentArea'), '123', tableStructureComponent, '456');
   */
  export function showTableForm(contentArea, projectId, tableStructureComponent, tableId = null) {
    const title = tableId ? "Edit Table" : "Add Table";
    const formHTML = `
      <h2 class="text-xl mb-4">${title}</h2>
      <form id="tableForm">
        <input type="text" id="tableName" placeholder="Table Name" class="w-full p-2 mb-4 border rounded" required>
        <div id="tableFields">
          <!-- Fields will be dynamically added here -->
        </div>
        <button type="button" id="addFieldBtn" class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Field</button>
        <button type="submit" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">${title}</button>
      </form>
    `;
  
    contentArea.html(formHTML);
  
    let fieldCount = 0;
  
    function addField(name = "", type = "text", required = false) {
      const fieldHTML = `
        <div class="field-row mb-2">
          <input type="text" name="field_name[]" placeholder="Field Name" value="${name}" class="p-2 border rounded mr-2" required>
          <select name="field_type[]" class="p-2 border rounded mr-2">
            <option value="text" ${type === "text" ? "selected" : ""}>Text</option>
            <option value="number" ${type === "number" ? "selected" : ""}>Number</option>
            <option value="date" ${type === "date" ? "selected" : ""}>Date</option>
            <option value="boolean" ${type === "boolean" ? "selected" : ""}>Boolean</option>
          </select>
          <label>
            <input type="checkbox" name="field_required[]" ${required ? "checked" : ""}> Required
          </label>
          <button type="button" class="removeFieldBtn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2">Remove</button>
        </div>
      `;
      $("#tableFields").append(fieldHTML);
      fieldCount++;
    }
  
    $("#addFieldBtn").click(() => addField());
  
    $(document).on("click", ".removeFieldBtn", function () {
      $(this).closest(".field-row").remove();
      fieldCount--;
    });
  
    if (tableId) {
      tableStructureComponent.getById(projectId, tableId).then((table) => {
        $("#tableName").val(table.table_name);
        table.table_structure.forEach((field) => {
          addField(field.name, field.type, field.required);
        });
      });
    } else {
      addField(); // Add one empty field by default for new tables
    }
  
    $("#tableForm").submit(function (e) {
      e.preventDefault();
      const tableData = {
        table_name: $("#tableName").val(),
        table_structure: [],
      };
  
      $(".field-row").each(function () {
        tableData.table_structure.push({
          name: $(this).find('input[name="field_name[]"]').val(),
          type: $(this).find('select[name="field_type[]"]').val(),
          required: $(this).find('input[name="field_required[]"]').is(":checked"),
        });
      });
  
      const action = tableId
        ? tableStructureComponent.update(projectId, tableId, tableData)
        : tableStructureComponent.create(projectId, tableData);
  
      action
        .then(() => {
          showNotification(`Table ${tableId ? "updated" : "created"} successfully`, "success");
          loadTables(contentArea, projectId, tableStructureComponent);
        })
        .catch((error) => {
          showNotification(`Error ${tableId ? "updating" : "creating"} table: ` + error.message, "error");
        });
    });
  }
  
  /**
   * Loads and displays the data for a specific table
   * @param {Object} contentArea - The content area element
   * @param {string} projectId - The ID of the current project
   * @param {string} tableId - The ID of the table
   * @param {number} page - The page number to load
   * @example
   * loadTableData($('#contentArea'), '123', '456', 1);
   */
  export function loadTableData(contentArea, projectId, tableId, page) {
    // This function would be implemented to load and display the actual data in the table
    // It would use a separate component for table data, which is not provided in the original context
    // For now, we'll just show a placeholder message
    contentArea.html(`<p>Table data for table ID ${tableId} would be displayed here.</p>`);
    showNotification("Table data loading is not implemented in this example.", "info");
  }