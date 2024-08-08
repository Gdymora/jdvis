const fs = require("fs");
const path = require("path");

const docsDir = "./docs";

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  console.log(`Processing ${filePath}`);

  // Додаємо скрипт для виконання прикладів, якщо його ще немає
  if (!content.includes("function runExample")) {
    content = content.replace(
      "</body>",
      `
      <script>
      function runExample(button) {
        const codeBlock = button.previousElementSibling.querySelector('code');
        const resultBlock = button.nextElementSibling;
        const code = codeBlock.textContent;
        try {
          // Створюємо тестовий DOM елемент
          const testElement = document.createElement('div');
          testElement.innerHTML = '<div class="accordion"><div class="accordion-head">Test Section</div><div class="accordion-content">Test Content</div></div>';
          document.body.appendChild(testElement);

          // Виконуємо код прикладу
          eval(code);

          // Перевіряємо результат
          const accordionHead = testElement.querySelector('.accordion-head');
          if (accordionHead) {
            accordionHead.click();
            resultBlock.textContent = 'Example executed. Check the console for more details.';
            console.log('Example result:', accordionHead.className, accordionHead.nextElementSibling.className);
          } else {
            resultBlock.textContent = 'Example executed. Check the console for more details.';
          }

          // Видаляємо тестовий елемент
          document.body.removeChild(testElement);
        } catch (error) {
          resultBlock.textContent = 'Error: ' + error.message;
        }
      }
      </script>
    </body>
    `
    );
  }

  // Додаємо підключення CSS та JS файлів, якщо їх ще немає
  if (!content.includes('href="./style.css"')) {
    content = content.replace(
      "</head>",
      `
    <link rel="stylesheet" href="./style.css">
    <script src="./script.js"></script>
  </head>
      `
    );
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

// Обробляємо всі HTML файли в директорії документації
fs.readdirSync(docsDir).forEach((file) => {
  if (path.extname(file) === ".html") {
    processFile(path.join(docsDir, file));
  }
});

// Функція для копіювання файлів
function copyFile(source, target) {
  try {
    fs.copyFileSync(source, target);
    console.log(`Successfully copied ${source} to ${target}`);
  } catch (error) {
    console.error(`Error copying ${source} to ${target}:`, error);
  }
}

// Копіюємо CSS та JS файли
const distDir = "./dist";
const cssFile = path.join(distDir, "style.css");
const jsFile = path.join(distDir, "script.js");

if (fs.existsSync(cssFile)) {
  copyFile(cssFile, path.join(docsDir, "style.css"));
} else {
  console.warn(`Warning: ${cssFile} not found`);
}

if (fs.existsSync(jsFile)) {
  copyFile(jsFile, path.join(docsDir, "script.js"));
} else {
  console.warn(`Warning: ${jsFile} not found`);
}

console.log("Post-processing completed.");