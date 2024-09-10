// components/tableManagement.js

export function createTableManagement() {
  const notification = $().notification({
    position: "top-right",
    duration: 3000,
  });

  function sanitizeHTML(str) {
    return str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        }[tag] || tag)
    );
  }

  function sanitizeHTML(str) {
    const temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  }
  const fieldOptions = {
    type: [
      { value: "text", label: "Text" },
      { value: "number", label: "Number" },
      { value: "date", label: "Date" },
      { value: "markdown", label: "Markdown" }, // Додано новий тип
    ],
    tag: [
      { value: "", label: "Select tag" },
      { value: "img", label: "Image" },
      { value: "p", label: "Text" },
      { value: "div", label: "Div" },
    ],
  };

  // Функція для генерації опцій select
  function generateSelectOptions(options, selectedValue) {
    return options.map((option) => `<option value="${option.value}" ${option.value === selectedValue ? "selected" : ""}>${option.label}</option>`).join("");
  }

  // Функція для генерації рядка поля
  function generateFieldRow(field, index) {
    return `
    <div class="field-row mt-2">
      <input type="text" name="fieldName" value="${field.name}" class="px-2 py-1 border rounded mr-2">
      <select name="fieldType" class="px-2 py-1 border rounded mr-2">
        ${generateSelectOptions(fieldOptions.type, field.type)}
      </select>
      <select name="fieldTag" class="px-2 py-1 border rounded mr-2">
        ${generateSelectOptions(fieldOptions.tag, field.tag)}
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
  `;
  }

  return {
    load: function (contentArea, projectId, tableStructureService, tableDataService, options = {}) {
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
                    <td class="px-6 py-4 whitespace-nowrap">${sanitizeHTML(table.id)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${sanitizeHTML(table.table_name)}</td>
                  <!--  
                    <td class="px-6 py-4 whitespace-nowrap">${sanitizeHTML(table.created_at)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${sanitizeHTML(table.updated_at)}</td>
                   -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      ${
                        table.table_data && table.table_data.length > 0 && JSON.parse(table.table_data[0].data).length > 0
                          ? `
                        <button class="viewTableBtn p-2 bg-blue-500 text-white rounded-md mr-2" data-id="${table.id}">
                          <i class="fa-regular fa-eye" data-fallback-text="view"></i>
                        </button>
                        <button class="fillTableBtn px-2 py-3 bg-yellow-500 text-white rounded-md mr-2" data-id="${table.id}" data-action="first">
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
            this.viewTable(contentArea, projectId, tableStructureService, tableDataService, tableId);
          });

          $(".fillTableBtn").click((e) => {
            const tableId = $(e.currentTarget).data("id");
            const action = $(e.currentTarget).data("action");
            this.showFillTableForm(contentArea, projectId, tableStructureService, tableDataService, tableId);
          });

          $(".excelImportBtn").click((e) => {
            const tableId = Number($(e.currentTarget).data("id"));
            const action = $(e.currentTarget).data("action");

            if (!tableId || !action) {
              console.error("Missing table ID or action");
              return;
            }

            const table = tables.find((table) => table.id === tableId);
            if (!table) {
              console.error(`Table with id ${tableId} not found`);
              return;
            }

            let tableStructure = table.table_structure;
            if (!tableStructure) {
              console.error(`Table structure for table ${tableId} is missing`);
              return;
            }

            // Перевірка та обробка table_structure
            if (typeof tableStructure === "string") {
              try {
                // Перевіряємо, чи це валідний JSON-рядок
                tableStructure = JSON.parse(tableStructure);
              } catch (e) {
                console.error(`Invalid JSON string in table_structure for table ${tableId}`);
                return;
              }
            } else {
              console.error(`Unexpected type of table_structure for table ${tableId}`);
              return;
            }

            this.showExcelImportForm(contentArea, projectId, tableStructureService, tableDataService, tableStructure, tableId);
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

      function getFieldValues() {
        return fields.map((field, index) => ({
          name: $("input[name='fieldName']").eq(index).val() || field.name,
          type: $("select[name='fieldType']").eq(index).val() || field.type,
          tag: $("select[name='fieldTag']").eq(index).val() || field.tag,
          filter: index === 0 ? $("input[name='fieldFilter']").prop("checked") : field.filter,
        }));
      }
      function renderFields() {
        $("#tableFields").html(fields.map(generateFieldRow).join(""));

        $(".removeFieldBtn").click(function () {
          const index = $(this).closest(".field-row").index();
          fields.splice(index, 1);
          renderFields();
        });
      }

      renderFields();

      $("#addFieldBtn").click(() => {
        fields = getFieldValues();
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
          project_id: projectId,
          table_name: $("#tableName").val(),
          table_structure: getFieldValues(),
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

    viewTable: function (contentArea, projectId, tableStructureService, tableDataService, tableId) {
      tableStructureService.getById(projectId, tableId).then((tableData) => {
        const tableStructure = JSON.parse(tableData.table_structure);
        const tableDataParsed = tableData.table_data && tableData.table_data.length > 0 ? tableData.table_data : [];

        // Функція для розпарсювання JSON-рядка
        const parseJSON = (jsonString) => {
          try {
            return JSON.parse(jsonString);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            return [];
          }
        };

        // Функція для рендерингу рядка таблиці
        const renderTableRow = (rowData, rowId) => {
          const parsedData = parseJSON(rowData.data);

          return parsedData
            .map(
              (item) => `
            <tr class="text-black">
              ${tableStructure
                .map(
                  (column) => `
                  <td class="px-6 py-4 whitespace-nowrap">${item[column.name] || ""}</td>
                `
                )
                .join("")}
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="editRowBtn bg-blue-500 text-white px-2 py-1 rounded mr-2" data-row-index="${rowId}">Edit</button>
                <button class="deleteRowBtn bg-red-500 text-white px-2 py-1 rounded" data-row-index="${rowId}">Delete</button>
              </td>
            </tr>
          `
            )
            .join("");
        };

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
              ${tableDataParsed.map((row, index) => renderTableRow(row, row.id)).join("")}
            </tbody>
          </table>
          <button id="addRowBtn" class="mt-4 bg-green-500 text-white px-4 py-2 rounded">Add Row</button>
        `;

        contentArea.html(tableHTML);

        // Add event listeners
        $("#addRowBtn").click(() => this.showFillTableForm(contentArea, projectId, tableStructureService, tableDataService, tableId, "first"));
        $(".editRowBtn").click((event) => {
          const rowId = $(event.currentTarget).data("row-index");
          this.showFillTableForm(contentArea, projectId, tableStructureService, tableDataService, tableId, "second", rowId);
        });
        $(".deleteRowBtn").click((event) => {
          const rowId = $(event.currentTarget).data("row-index");
          this.deleteTableData(contentArea, projectId, tableStructureService, tableDataService, tableId, rowId);
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
          $("#tableFields").html(fields.map((field, index) => generateFieldRow(field, index)).join(""));

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
            user_id: table.user_id,
            project_id: table.project_id,
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

    showFillTableForm: async function (contentArea, projectId, tableStructureService, tableDataService, tableId, action, rowIndex = null) {
      tableStructureService.getById(projectId, tableId).then((tableData) => {
        const tableStructure = JSON.parse(tableData.table_structure);

        let tableDataParsed = [];

        if (tableData.table_data && tableData.table_data.length > 0) {
          if (rowIndex) {
            const targetId = parseInt(rowIndex, 10);
            console.log("Searching for record with id:", targetId);
            const targetRecord = tableData.table_data.find((record) => record.id === targetId);

            if (targetRecord) {
              tableDataParsed = JSON.parse(targetRecord.data);
            } else {
              console.warn(`Record with id ${rowIndex} not found`);
            }
          } else {
            // Якщо rowIndex не передано, парсимо всі записи
            tableDataParsed = tableData.table_data.flatMap((record) => JSON.parse(record.data));
          }
        }

        let formHTML = `
        <h2>${action === "first" ? "Add" : "Edit"} Row</h2>
        <form id="fillTableForm">
        ${tableStructure
          .map((field) => {
            let inputField = "";
            const fieldValue = action === "second" && tableDataParsed[0] ? tableDataParsed[0][field.name] || "" : "";
            switch (field.type) {
              case "text":
                inputField = `<textarea id="${field.name}" name="${field.name}" class="editor mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">${fieldValue}</textarea>`;
                break;
              case "markdown":
                inputField = `<textarea id="${field.name}" name="${field.name}" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" rows="5">${fieldValue}</textarea>`;
                break;
              case "number":
                inputField = `<input type="number" id="${field.name}" name="${field.name}" value="${fieldValue}" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">`;
                break;
              default:
                inputField = `<input type="text" id="${field.name}" name="${field.name}" value="${fieldValue}" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">`;
            }
            return `
              <div class="mb-4">
                <label for="${field.name}" class="block text-sm font-medium text-gray-700">${field.name}</label>
                ${inputField}
              </div>
            `;
          })
          .join("")}
        <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          ${action === "second" ? "Update" : "Add"} Post
        </button>
      </form>
      `;
        contentArea.html(formHTML);

        $(".editor").each(function () {
          $(this).ckeditor({});
        });

        $("#fillTableForm").on("submit", async (e) => {
          e.preventDefault();

          const formData = tableStructure.reduce((acc, field) => {
            acc[field.name] = $(`#${field.name}`).val();
            return acc;
          }, {});

          /*  const updatedTableData =
            action === "first" ? [...tableDataParsed, formData] : tableDataParsed.map((item, index) => (index === rowIndex ? formData : item));
 */
          const requestData = {
            user_tables_id: tableId,
            data: JSON.stringify([formData]),
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

    showExcelImportForm: function (contentArea, projectId, tableStructureService, tableDataService, tableStructure, tableId) {
      contentArea.html('<div id="fileParserContainer"></div>');

      $("#fileParserContainer").fileParser({
        onParse: (response)=> {
          console.log("Import results:", response);
          this.viewTable(contentArea, projectId, tableStructureService, tableDataService, tableId);
        },
        onError: function (error) {
          alert("Error: " + error);
        },
        tableStructure: tableStructure,
        tableId: tableId,
        projectId: projectId,
        ignoreFormat: false,
        updateFunction: (projectId, tableData) => {
          return tableDataService.createExcel(projectId, tableData);
        },
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
    deleteTableData: function (contentArea, projectId, tableStructureService, tableDataService, tablesId, dataId) {
      if (confirm("Are you sure you want to delete this post?")) {
        tableDataService
          .delete(projectId, dataId)
          .then(() => {
            notification.show("Post deleted successfully", "success");
            this.viewTable(contentArea, projectId, tableStructureService, tableDataService, tablesId);

            //  this.viewTable(contentArea, projectId, tableStructureService, tableDataService, newData.user_tables_id);
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
