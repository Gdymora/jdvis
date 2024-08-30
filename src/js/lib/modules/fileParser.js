import $ from "../core";
import Papa from "papaparse";
import * as XLSX from "xlsx";

$.prototype.fileParser = function (options) {
  const defaults = {
    onParse: () => {},
    onError: () => {},
    ignoreFormat: false,
    tableStructure: [],
  };

  const settings = Object.assign({}, defaults, options);

  return this.each(function () {
    const container = this;

    // Створення елементів
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv,.xlsx,.xls";

    const ignoreFormatCheckbox = document.createElement("input");
    ignoreFormatCheckbox.type = "checkbox";
    ignoreFormatCheckbox.id = "ignoreFormat";

    const ignoreFormatLabel = document.createElement("label");
    ignoreFormatLabel.htmlFor = "ignoreFormat";
    ignoreFormatLabel.textContent = "Ignore format";

    const sendButton = document.createElement("button");
    sendButton.type = "button";
    sendButton.textContent = "Send";
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

    // Обробник події зміни файлу
    $(fileInput).on("change", handleFileUpload);

    // Прив'язка події до кнопки відправки
    sendButton.addEventListener("click", function () {
      const parsedData = JSON.parse(tableContainer.dataset.parsedData);
      settings.onParse(parsedData);
    });

    function handleFileUpload(e) {
      const file = e.target.files[0];
      const ignoreFormat = ignoreFormatCheckbox.checked;

      if (!file) {
        settings.onError("No file selected");
        return;
      }

      const fileType = file.type;
      if (fileType === "text/csv") {
        parseCSV(file, ignoreFormat);
      } else if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || fileType === "application/vnd.ms-excel") {
        parseExcel(file, ignoreFormat);
      } else {
        settings.onError("Please upload a valid CSV or Excel file.");
      }
    }

    function parseCSV(file, ignoreFormat) {
      Papa.parse(file, {
        header: !ignoreFormat,
        complete: (result) => {
          processData(result.data, ignoreFormat);
        },
        error: (error) => {
          settings.onError("Error parsing CSV: " + error.message);
        },
      });
    }

    function parseExcel(file, ignoreFormat) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: ignoreFormat ? 1 : undefined });
        processData(jsonData, ignoreFormat);
      };
      reader.onerror = (error) => {
        settings.onError("Error reading Excel file: " + error);
      };
      reader.readAsArrayBuffer(file);
    }

    function processData(data) {
      if (data.length === 0) {
        settings.onError("No data found in the file");
        return;
      }

      renderTable(data);
      sendButton.style.display = "block"; // Показуємо кнопку відправки
      tableContainer.dataset.parsedData = JSON.stringify(data);
    }

    function renderTable(data) {
      tableContainer.innerHTML = ""; // Очищення попереднього контенту

      const table = document.createElement("table");
      table.style.width = "100%";
      table.border = "1";

      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");

      // Генеруємо заголовки таблиці
      const headerRow = document.createElement("tr");
      Object.keys(data[0]).forEach((key) => {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // Генеруємо рядки таблиці
      data.forEach((row) => {
        const tr = document.createElement("tr");
        Object.values(row).forEach((value) => {
          const td = document.createElement("td");
          td.textContent = value;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      tableContainer.appendChild(table);
    }
  });
};

// Приклад використання:
// $('#fileParserContainer').fileParser({
//   onParse: function(data) {
//     console.log('Parsed data:', data);
//     // Обробка розібраних даних
//   },
//   onError: function(error) {
//     console.error('Error:', error);
//     // Обробка помилок
//   },
//   tableStructure: [
//     { name: 'Column1', type: 'text' },
//     { name: 'Column2', type: 'number' },
//     // ... інші колонки
//   ],
//   ignoreFormat: false
// });
