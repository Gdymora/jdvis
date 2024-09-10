import $ from "../core";
import Papa from "papaparse";
import * as XLSX from "xlsx";

/**
 * Плагін fileParser для парсингу та імпорту CSV та Excel файлів.
 * @param {Object} options - Налаштування для fileParser.
 * @param {function} [options.onParse] - Callback-функція, яка викликається після успішного парсингу та імпорту даних.
 * @param {function} [options.onError] - Callback-функція для обробки помилок.
 * @param {boolean} [options.ignoreFormat=false] - Чи ігнорувати формат файлу.
 * @param {Array} options.tableStructure - Структура таблиці для форматування даних.
 * @param {string|number} options.projectId - ID проекту.
 * @param {string|number} options.tableId - ID таблиці.
 * @param {Object} [options.tableDataService] - Сервіс для роботи з даними таблиці.
 * @param {function} [options.updateFunction] - Користувацька функція для оновлення даних.
 * @returns {jQuery} Для підтримки ланцюжка викликів jQuery.
 * @example
 * $("#fileParserContainer").fileParser({
 *   onParse: function(response) {
 *     console.log("Import results:", response);
 *     this.viewTable(contentArea, projectId, tableStructureService, tableId);
 *   },
 *   onError: function(error) {
 *     alert("Error: " + error);
 *   },
 *   tableStructure: [
 *     { name: "Column1", type: "string" },
 *     { name: "Column2", type: "number" }
 *   ],
 *   tableId: "table1",
 *   projectId: "project1",
 *   ignoreFormat: false,
 *   updateFunction: (projectId, data) => {
 *     return tableDataService.createExcel(projectId, data);
 *   },
 *   tableDataService: tableDataService
 * });
 */

$.prototype.fileParser = function (options) {
  const defaults = {
    onParse: () => {},
    onError: () => {},
    ignoreFormat: false,
    tableStructure: [],
    projectId: null,
    tableId: null,
    tableStructureService: null,
    updateFunction: null, // Нова опція для користувацької функції оновлення
  };

  const settings = Object.assign({}, defaults, options);

  return this.each(function () {
    const container = this;
    let parsedData = [];
    let rawData = null;

    // Створення елементів інтерфейсу
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv,.xlsx,.xls";

    const ignoreFormatCheckbox = document.createElement("input");
    ignoreFormatCheckbox.type = "checkbox";
    ignoreFormatCheckbox.id = "ignoreFormat";
    ignoreFormatCheckbox.checked = settings.ignoreFormat;

    const ignoreFormatLabel = document.createElement("label");
    ignoreFormatLabel.htmlFor = "ignoreFormat";
    ignoreFormatLabel.textContent = "Ignore format";

    const sendButton = document.createElement("button");
    sendButton.type = "button";
    sendButton.textContent = "Import Data";
    sendButton.id = "send";
    sendButton.style.display = "none";

    const tableContainer = document.createElement("div");
    tableContainer.id = "tableContainer";

    const form = document.createElement("form");
    form.appendChild(fileInput);
    form.appendChild(ignoreFormatCheckbox);
    form.appendChild(ignoreFormatLabel);
    form.appendChild(tableContainer);
    form.appendChild(sendButton);

    container.appendChild(form);

    // Обробники подій
    $(fileInput).on("change", handleFileUpload);
    $(ignoreFormatCheckbox).on("change", handleIgnoreFormatChange);
    $(sendButton).on("click", handleSubmit);

    /**
     * Обробляє завантаження файлу.
     * @param {Event} e - Об'єкт події.
     */
    function handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) {
        settings.onError("No file selected");
        return;
      }

      // Очищення попередніх даних
      parsedData = [];
      rawData = null;
      tableContainer.innerHTML = "";
      sendButton.style.display = "none";

      const fileType = file.type;
      if (fileType === "text/csv") {
        parseCSV(file);
      } else if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileType === "application/vnd.ms-excel") {
        parseExcel(file);
      } else {
        settings.onError("Please upload a valid CSV or Excel file.");
      }
    }

    /**
     * Парсить CSV файл.
     * @param {File} file - CSV файл для парсингу.
     */
    function parseCSV(file) {
      Papa.parse(file, {
        complete: (result) => {
          rawData = result.data;
          processData();
        },
        error: (error) => {
          settings.onError("Error parsing CSV: " + error.message);
        },
      });
    }

    /**
     * Парсить Excel файл.
     * @param {File} file - Excel файл для парсингу.
     */
    function parseExcel(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        processData();
      };
      reader.onerror = (error) => {
        settings.onError("Error reading Excel file: " + error);
      };
      reader.readAsArrayBuffer(file);
    }

    /**
     * Обробляє дані після парсингу.
     */
    function processData() {
      if (!rawData || rawData.length === 0) {
        settings.onError("No data found in the file");
        return;
      }

      parsedData = formatData(rawData);
      renderTable(parsedData);
    }

    /**
     * Обробляє зміну стану чекбоксу ігнорування формату.
     */
    function handleIgnoreFormatChange() {
      settings.ignoreFormat = ignoreFormatCheckbox.checked;
      if (rawData) {
        processData();
      }
    }

    /**
     * Рендерить таблицю з даними.
     * @param {Array} data - Дані для відображення в таблиці.
     */
    function renderTable(data) {
      tableContainer.innerHTML = "";
      const table = document.createElement("table");
      table.className = "min-w-full divide-y divide-gray-200";

      const thead = document.createElement("thead");
      thead.className = "bg-gray-50";
      const headerRow = document.createElement("tr");

      settings.tableStructure.forEach((column) => {
        const th = document.createElement("th");
        th.className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
        th.textContent = column.name;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      const tbody = document.createElement("tbody");
      tbody.className = "bg-white divide-y divide-gray-200";

      data.forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.className = "text-black";
        settings.tableStructure.forEach((column, colIdx) => {
          const td = document.createElement("td");
          td.className = "px-6 py-4 whitespace-nowrap";
          td.textContent = row[column.name] || "";
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      tableContainer.appendChild(table);
      sendButton.style.display = "block";
    }

    /**
     * Обробляє відправку даних.
     */
    function handleSubmit() {
      const tableData = {
        user_tables_id: settings.tableId,
        data: parsedData,
      };

      if (settings.updateFunction) {
        settings
          .updateFunction(settings.projectId, tableData)
          .then((response) => {
            displayImportResults(response);
            settings.onParse(response);
          })
          .catch((error) => {
            settings.onError("Error importing data: " + error.message);
          });
      } else if (settings.tableDataService && settings.projectId) {
        settings.tableDataService
          .createExcel(settings.projectId, tableData)
          .then((response) => {
            displayImportResults(response);
            settings.onParse(response);
          })
          .catch((error) => {
            settings.onError("Error importing data: " + error.message);
          });
      } else {
        settings.onParse(parsedData);
      }
    }

    /**
     * Відображає результати імпорту.
     * @param {Object} response - Відповідь сервера з результатами імпорту.
     */
    function displayImportResults(response) {
      const resultContainer = document.createElement("div");
      resultContainer.innerHTML = `
        <h3>Import Results</h3>
        <p>Successfully imported: ${response.results.success || 0}</p>
        <p>Failed to import: ${response.results.failed || 0}</p>
        <p>Errors to import: ${response.results.errors || 0}</p>
      `;

      if (response.resultserrors && response.results.errors.length > 0) {
        const errorList = document.createElement("ul");
        response.errors.forEach((error) => {
          const li = document.createElement("li");
          li.textContent = `Row ${error.row}: ${error.error}`;
          errorList.appendChild(li);
        });
        resultContainer.appendChild(errorList);
      }

      tableContainer.appendChild(resultContainer);
    }

    /**
     * Форматує дані відповідно до структури таблиці.
     * @param {Array} data - Вихідні дані.
     * @returns {Array} Відформатовані дані.
     */
    function formatData(data) {
      if (settings.ignoreFormat) {
        if (data[0].length < settings.tableStructure.length) {
          settings.onError("File format is incorrect: too few columns");
          return [];
        }
        return data.slice(1).map((row) => {
          const formattedRow = {};
          settings.tableStructure.forEach((column, index) => {
            formattedRow[column.name] = row[index] || "";
          });
          return formattedRow;
        });
      } else {
        const headers = data[0];
        if (headers.length !== settings.tableStructure.length) {
          settings.onError("File format is incorrect: column count mismatch");
          return [];
        }
        return data.slice(1).map((row) => {
          const formattedRow = {};
          settings.tableStructure.forEach((column, index) => {
            formattedRow[column.name] = row[index] || "";
          });
          return formattedRow;
        });
      }
    }
  });
};
