// components/tableManagement.js

export function createTableManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });
  return {
    load: function (contentArea, projectId, tableStructureService, options = {}) {
      const { page = 1, itemsPerPage = 15 } = options;

      tableStructureService
        .getAll(projectId, { page, itemsPerPage })
        .then((response) => {
          const tables = response.data || [];
          let tablesHTML = `
            <h2 class="text-lg font-semibold mb-4">User Tables</h2>
            <button id="addTableBtn" class="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              <i class="fa-regular fa-square-plus fa-xl" style="color: #3e1e9f" data-fallback-text="+"></i>
            </button>
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id number</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <!--  
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                  -->
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
                  <!--  
                    <td class="px-6 py-4 whitespace-nowrap">${table.created_at}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${table.updated_at}</td>
                   -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      ${
                        table.table_data && table.table_data.length > 0 && JSON.parse(table.table_data[0].data).length > 0
                          ? `
                        <button class="viewTableBtn p-2 bg-blue-500 text-white rounded-md mr-2" data-id="${table.id}">
                          <i class="fa-regular fa-eye" data-fallback-text="view"></i>
                        </button>
                        <button class="fillTableBtn px-2 py-3 bg-yellow-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="second">
                          <i class="fa-regular fa-square-plus fa-lg" data-fallback-text="add"></i>
                        </button>
                        <button class="excelImportBtn px-2 py-3 bg-yellow-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="second">
                          <i class="fa-solid fa-file-excel fa-lg" data-fallback-text="exel"></i>
                        </button>
                      `
                          : `
                        <button class="viewTableBtn p-2 bg-gray-500 text-white rounded-md mr-2" data-id="${table.id}" disabled>
                          <i class="fa-regular fa-eye" data-fallback-text="view"></i>
                        </button>
                        <button class="fillTableBtn px-2 py-3 bg-green-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="first">
                          <i class="fa-regular fa-square-plus fa-lg" data-fallback-text="add"></i>
                        </button>
                        <button class="excelImportBtn px-2 py-3 bg-yellow-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="first">
                          <i class="fa-solid fa-file-excel fa-lg" data-fallback-text="exel"></i>
                        </button>
                      `
                      }
                      <button class="cloneTableBtn bg-none rounded-md mx-2" data-id="${table.id}">clone</button>
                      <button class="editTableBtn bg-none rounded-md mx-2" data-id="${table.id}">
                        <i class="fa-solid fa-pencil" style="color: #429424" data-fallback-text="edit"></i>
                      </button>
                      <button class="deleteTableBtn bg-none rounded-md mx-2" data-id="${table.id}">
                        <i class="fa-regular fa-trash-can" style="color: #ea3f06" data-fallback-text="delete"></i>
                      </button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          `;

          contentArea.html(tablesHTML);

          // Add event listeners
          $("#addTableBtn").click(() => this.showForm(contentArea, projectId, tableStructureService));
          $(".viewTableBtn").click((e) => {
            const tableId = $(e.currentTarget).data("id");
            this.viewTable(contentArea, projectId, tableStructureService, tableId);
          });
          $(".fillTableBtn").click((e) => {
            const tableId = $(e.currentTarget).data("id");
            const action = $(e.currentTarget).data("action");
            this.showFillTableForm(contentArea, projectId, tableStructureService, tableId, action);
          });
          $(".excelImportBtn").click((e) => {
            const tableId = $(e.currentTarget).data("id");
            const action = $(e.currentTarget).data("action");
            this.showExcelImportForm(contentArea, projectId, tableStructureService, tableId, action);
          });
          $(".cloneTableBtn").click((e) => {
            const tableId = $(e.currentTarget).data("id");
            this.cloneTable(contentArea, projectId, tableStructureService, tableId);
          });
          $(".editTableBtn").click((e) => {
            const tableId = $(e.currentTarget).data("id");
            this.showTableStructureForm(contentArea, projectId, tableStructureService, tableId);
          });
          $(".deleteTableBtn").click((e) => {
            const tableId = $(e.currentTarget).data("id");
            if (confirm("Are you sure you want to delete this table?")) {
              this.deleteTable(contentArea, projectId, tableStructureService, tableId);
            }
          });
        })
        .catch((error) => {
          contentArea.html("<p>Error loading tables.</p>");
          notification.show("Error loading tables: " + error.message, "error");
        });
    },

    showForm: function (contentArea, projectId, tableStructureService, tableId = null) {
      const title = tableId ? "Edit Table Structure" : "Create New Table Structure";
      const formHTML = `
        <div class="w-full min-w-3xl max-w-3xl p-4 bg-white shadow-md rounded-md">
          <h2 class="text-lg font-semibold mb-4">${title}</h2>
          <form id="tableStructureForm">
            <input type="text" id="tableName" placeholder="Table name" class="w-full min-w-3xl max-w-3xl px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <div id="tableFields"></div>
            <button type="button" id="addFieldBtn" class="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Field</button>
            <button type="submit" class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">${tableId ? "Update" : "Create"} Table</button>
          </form>
        </div>
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
        tableStructureService.getById(projectId, tableId).then((table) => {
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

        const action = tableId ? tableStructureService.update(projectId, tableId, tableData) : tableStructureService.create(projectId, tableData);

        action
          .then(() => {
            notification.show(`Table ${tableId ? "updated" : "created"} successfully`, "success");
            this.load(contentArea, projectId, tableStructureService);
          })
          .catch((error) => {
            notification.show(`Error ${tableId ? "updating" : "creating"} table: ${error.message}`, "error");
          });
      });
    },

    viewTable: function (contentArea, projectId, tableStructureService, tableId) {
      tableStructureService.getById(projectId, tableId).then((tableData) => {
        const tableStructure = JSON.parse(tableData.table_structure);
        const tableDataParsed = tableData.table_data && tableData.table_data[0] ? JSON.parse(tableData.table_data[0].data) : [];

        let tableHTML = `
          <h2 class="text-lg font-semibold m-4">${tableData.table_name} (ID: ${tableData.id})</h2>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                ${tableStructure
                  .map(
                    (column) => `
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ${column.name}
                  </th>
                `
                  )
                  .join("")}
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${tableDataParsed
                .map(
                  (row, rowIndex) => `
                <tr class="text-black">
                  ${tableStructure
                    .map(
                      (column) => `
                    <td class="px-6 py-4 whitespace-nowrap">${row[column.name] || ""}</td>
                  `
                    )
                    .join("")}
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button class="editRowBtn bg-blue-500 text-white px-2 py-1 rounded mr-2" data-row-index="${rowIndex}">Edit</button>
                    <button class="deleteRowBtn bg-red-500 text-white px-2 py-1 rounded" data-row-index="${rowIndex}">Delete</button>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <button id="addRowBtn" class="mt-4 bg-green-500 text-white px-4 py-2 rounded">Add Row</button>
        `;

        contentArea.html(tableHTML);

        // Add event listeners
        $("#addRowBtn").click(() => this.showFillTableForm(contentArea, projectId, tableStructureService, tableId, "add"));
        $(".editRowBtn").click(function () {
          const rowIndex = $(this).data("row-index");
          this.showFillTableForm(contentArea, projectId, tableStructureService, tableId, "edit", rowIndex);
        });
        $(".deleteRowBtn").click(function () {
          const rowIndex = $(this).data("row-index");
          if (confirm("Are you sure you want to delete this row?")) {
            this.deleteTableRow(contentArea, projectId, tableStructureService, tableId, rowIndex);
          }
        });
      });
    },

    showTableStructureForm: function (contentArea, projectId, tableStructureService, tableId) {
      tableStructureService.getById(projectId, tableId).then((table) => {
        let formHTML = `
          <h2>Edit Table Structure</h2>
          <form id="editTableStructureForm">
            <input type="text" id="tableName" value="${table.table_name}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
            <div id="tableFields"></div>
            <button type="button" id="addFieldBtn" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Add Field</button>
            <button type="submit" class="mt-4 bg-green-500 text-white px-4 py-2 rounded">Update Table Structure</button>
          </form>
        `;

        contentArea.html(formHTML);

        let fields = JSON.parse(table.table_structure);

        function renderFields() {
          $("#tableFields").html(
            fields
              .map(
                (field, index) => `
              <div class="field-row mt-2">
                <input type="text" name="fieldName" value="${field.name}" class="px-2 py-1 border rounded mr-2">
                <select name="fieldType" class="px-2 py-1 border rounded mr-2">
                  <option value="text" ${field.type === "text" ? "selected" : ""}>Text</option>
                  <option value="number" ${field.type === "number" ? "selected" : ""}>Number</option>
                  <option value="date" ${field.type === "date" ? "selected" : ""}>Date</option>
                </select>
                <select name="fieldTag" class="px-2 py-1 border rounded mr-2">
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
                <button type="button" class="removeFieldBtn px-2 py-1 bg-red-500 text-white rounded">Remove</button>
              </div>
            `
              )
              .join("")
          );

          $(".removeFieldBtn").click(function () {
            fields.splice($(this).closest(".field-row").index(), 1);
            renderFields();
          });
        }

        renderFields();

        $("#addFieldBtn").click(() => {
          fields.push({ name: "", type: "text", tag: "", filter: null });
          renderFields();
        });

        $("#editTableStructureForm").on("submit", (e) => {
          e.preventDefault();
          const updatedTableData = {
            user_id: table.project.super_user_id,
            project_id: table.project.id,
            table_name: $("#tableName").val(),
            table_structure: fields.map((_, index) => ({
              name: $("input[name='fieldName']").eq(index).val(),
              type: $("select[name='fieldType']").eq(index).val(),
              tag: $("select[name='fieldTag']").eq(index).val(),
              filter: index === 0 ? $("input[name='fieldFilter']").prop("checked") : null,
            })),
          };

          tableStructureService
            .update(projectId, tableId, updatedTableData)
            .then(() => {
              notification.show("Table structure updated successfully", "success");
              this.load(contentArea, projectId, tableStructureService);
            })
            .catch((error) => {
              notification.show(`Error updating table structure: ${error.message}`, "error");
            });
        });
      });
    },

    showFillTableForm: function (contentArea, projectId, tableStructureService, tableId, action, rowIndex = null) {
      tableStructureService.getById(projectId, tableId).then((tableData) => {
        const tableStructure = JSON.parse(tableData.table_structure);
        const tableDataParsed = tableData.table_data && tableData.table_data[0] ? JSON.parse(tableData.table_data[0].data) : [];

        let formHTML = `
          <h2>${action === "add" ? "Add" : "Edit"} Row</h2>
          <form id="fillTableForm">
            ${tableStructure
              .map(
                (field) => `
              <div>
                <label for="${field.name}">${field.name}</label>
                <input type="${field.type}" id="${field.name}" name="${field.name}" 
                  value="${action === "edit" && rowIndex !== null ? tableDataParsed[rowIndex][field.name] || "" : ""}"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
              </div>
            `
              )
              .join("")}
            <button type="submit" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          </form>
        `;

        contentArea.html(formHTML);

        $("#fillTableForm").on("submit", (e) => {
          e.preventDefault();
          const formData = {};
          tableStructure.forEach((field) => {
            formData[field.name] = $(`#${field.name}`).val();
          });

          if (action === "add") {
            tableDataParsed.push(formData);
          } else if (action === "edit" && rowIndex !== null) {
            tableDataParsed[rowIndex] = formData;
          }

          this.updateTableData(contentArea, projectId, tableStructureService, tableId, tableDataParsed);
        });
      });
    },

    showExcelImportForm: function (contentArea, projectId, tableStructureService, tableId) {
      contentArea.html('<div id="fileParserContainer"></div>');

      $("#fileParserContainer").fileParser({
        onParse: function (data) {
          // Here you can handle the parsed data
          console.log("Parsed data:", data);

          // Example: update the table with the parsed data
          tableStructureService
            .update(projectId, tableId, { data: data })
            .then(() => {
              alert("Data imported successfully");
              this.viewTable(contentArea, projectId, tableStructureService, tableId);
            })
            .catch((error) => {
              alert("Error importing data: " + error.message);
            });
        },
        onError: function (error) {
          alert("Error: " + error);
        },
        tableStructure: [
          { name: "imgSrc", type: "text" },
          { name: "Column2", type: "number" },
          // ... інші колонки відповідно до вашої структури таблиці
        ],
        ignoreFormat: false,
      });
    },

    cloneTable: function (contentArea, projectId, tableStructureService, tableId) {
      tableStructureService.getById(projectId, tableId).then((tableData) => {
        const formHTML = `
          <h2 class="text-lg font-semibold mb-4">Clone Table</h2>
          <form id="cloneTableForm">
            <div class="mb-4">
              <label for="newTableName" class="block text-sm font-medium text-gray-700">New Table Name</label>
              <input type="text" id="newTableName" name="newTableName" value="${tableData.table_name} (Clone)" 
                     class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
            </div> 
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Clone Table
            </button>
          </form>
        `;

        contentArea.html(formHTML);

        $("#cloneTableForm").on("submit", (e) => {
          e.preventDefault();
          const newTableName = $("#newTableName").val();

          // Ensure table_structure is an array, not a string
          let tableStructure = tableData.table_structure;
          if (typeof tableStructure === "string") {
            try {
              tableStructure = JSON.parse(tableStructure);
            } catch (error) {
              console.error("Error parsing table_structure:", error);
              notification.show("Error parsing table structure", "error");
              return;
            }
          }

          const newTableData = {
            user_id: tableData.user_id, // Assume this is available from the original table data
            project_id: projectId,
            table_name: newTableName,
            type_data: tableData.type_data || "custom_type",
            table_structure: tableStructure,
          };

          tableStructureService
            .create(projectId, newTableData)
            .then(() => {
              notification.show(`Table cloned successfully. New table name: ${newTableName}`, "success");
              this.load(contentArea, projectId, tableStructureService);
            })
            .catch((error) => {
              notification.show(`Error cloning table: ${error.message}`, "error");
            });
        });
      });
    },

    deleteTable: function (contentArea, projectId, tableStructureService, tableId) {
      if (confirm("Are you sure you want to delete this table? This action cannot be undone.")) {
        tableStructureService.delete(projectId, tableId).then(() => {
          alert("Table deleted successfully");
          this.load(contentArea, projectId, tableStructureService);
        });
      }
    },

    updateTableData: function (contentArea, projectId, tableStructureService, tableId, newData) {
      tableStructureService.update(projectId, tableId, { table_data: JSON.stringify(newData) }).then(() => {
        alert("Table data updated successfully");
        this.viewTable(contentArea, projectId, tableStructureService, tableId);
      });
    },

    deleteTableRow: function (contentArea, projectId, tableStructureService, tableId, rowIndex) {
      tableStructureService.getById(projectId, tableId).then((tableData) => {
        const tableDataParsed = tableData.table_data && tableData.table_data[0] ? JSON.parse(tableData.table_data[0].data) : [];
        tableDataParsed.splice(rowIndex, 1);
        this.updateTableData(contentArea, projectId, tableStructureService, tableId, tableDataParsed);
      });
    },
    // Метод для виклику користувацьких подій
    trigger: function (eventName, data) {
      const event = new CustomEvent(eventName, { detail: data });
      document.querySelector("#adminPanelContainer").dispatchEvent(event);
    },
  };
}
