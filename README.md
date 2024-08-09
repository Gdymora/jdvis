ModernDOM Library
ModernDOM is a lightweight and flexible JavaScript library designed to simplify DOM manipulation and provide a set of utility functions for modern web development. It offers a jQuery-like syntax for ease of use while maintaining a small footprint and optimal performance.
Key Features

Lightweight: Minimalistic core with essential DOM manipulation methods.
Chainable Methods: Allows for concise and readable code through method chaining.
Selector Engine: Efficient element selection using CSS-style selectors.
Event Handling: Simplified event binding and management.
Ajax Support: Easy-to-use AJAX functionality for server communication.
Cross-browser Compatibility: Works consistently across modern browsers.
Extensible: Robust plugin architecture for adding custom functionality.

Core Functionality

Element selection and traversal
DOM manipulation (adding, removing, and modifying elements)
Event handling (binding, unbinding, and triggering events)
Ajax requests (GET, POST, etc.)
Basic animations and effects
Utility functions for common tasks

Plugin System
ModernDOM features a powerful plugin system that allows developers to extend its functionality easily. Plugins can add new methods to the ModernDOM prototype, enhancing the library's capabilities without modifying the core code.
Creating Plugins
To create a plugin for ModernDOM, developers can use the following pattern:

```javascript
(function (global) {
  function initPlugin($) {
    if (typeof $ === "undefined") {
      console.error("ModernDOM is not defined");
      return;
    }

    $.prototype.newMethod = function () {
      // Plugin functionality here
    };

    console.log("Plugin loaded successfully");
  }

  function waitForDependencies() {
    return new Promise((resolve) => {
      function check() {
        if (typeof global.$ !== "undefined") {
          resolve();
        } else {
          setTimeout(check, 50);
        }
      }
      check();
    });
  }

  function init() {
    waitForDependencies()
      .then(() => {
        initPlugin(global.$);
      })
      .catch((error) => {
        console.error("Error initializing plugin:", error);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : this);
```

This pattern ensures that the plugin is initialized only when ModernDOM is available, making it safe to use in various loading scenarios.
Examples of Plugins
ModernDOM supports a wide range of plugins, including but not limited to:

Form Validation: Add custom form validation functionality.
Rich Text Editors: Integrate WYSIWYG editors like CKEditor.
Data Visualization: Create charts and graphs using library data.
Infinite Scrolling: Implement endless scrolling for content lists.
Image Galleries: Build responsive image galleries and sliders.
Date Pickers: Add customizable date selection widgets.

Benefits of the Plugin System

Modularity: Developers can add only the functionality they need.
Maintainability: Plugins can be updated independently of the core library.
Customization: Easy to tailor ModernDOM to specific project requirements.

Conclusion
ModernDOM combines the ease of use reminiscent of jQuery with modern JavaScript practices, providing a powerful yet lightweight solution for DOM manipulation and web development. Its plugin system offers unlimited potential for extension, making it a versatile choice for projects of all sizes.

```javascript
// Маніпулювання url
// Припустимо, поточний URL: http://localhost:8013/4/post/123?page=2&category=tech

// Отримати повну інформацію про URL
const urlInfo = $().parsePostUrl();
console.log(urlInfo);

// Перевірити, чи це URL посту
if ($().isPostUrl()) {
  console.log("Це URL посту");
} else {
  console.log("Це не URL посту");
}

// Отримати конкретний компонент
const postNumber = $().getUrlComponent("postNumber");
console.log(`Номер поточного посту: ${postNumber}`);

// Отримати параметри запиту
const queryParams = $().getUrlComponent("queryParams");
console.log(`Параметри запиту:`, queryParams);
```

```html
<!-- Topic Nav -->
<nav class="w-full py-4 border-t border-b bg-gray-100">
  <div class="block sm:hidden">
    <a href="#" id="mobileMenuToggle-2" class="block md:hidden text-base font-bold uppercase text-center flex justify-center items-center">
      Topics <i class="fas ml-2 fa-chevron-down"> </i
    ></a>
  </div>
  <div id="topicMenu-2" class="w-full flex-grow sm:flex sm:items-center sm:w-auto hidden">
    <div class="w-full container mx-auto flex flex-col sm:flex-row items-center justify-center text-sm font-bold uppercase mt-0 px-6 py-2">
      <a href="#" class="hover:bg-gray-400 rounded py-2 px-4 mx-2">Technology</a>
      <a href="#" class="hover:bg-gray-400 rounded py-2 px-4 mx-2">Automotive</a>
      <a href="#" class="hover:bg-gray-400 rounded py-2 px-4 mx-2">Finance</a>
      <a href="#" class="hover:bg-gray-400 rounded py-2 px-4 mx-2">Politics</a>
      <a href="#" class="hover:bg-gray-400 rounded py-2 px-4 mx-2">Culture</a>
      <a href="#" class="hover:bg-gray-400 rounded py-2 px-4 mx-2">Sports</a>
    </div>
  </div>
</nav>
<script>
  $("#mobileMenuToggle").mobileNav();
</script>
```

```html
<!-- caruselBlog -->
<footer id="imdn0p" class="w-full border-t bg-white pb-12">
  <div id="footerCarousel-2" class="relative w-full flex items-center invisible md:visible md:pb-12">
    <button
      type="button"
      id="prev-2"
      class="absolute z-10 left-0 bg-blue-800 hover:bg-blue-700 text-white text-2xl font-bold hover:shadow rounded-full w-16 h-16 ml-12"
    >
      ←
    </button>
    <div class="flex transition-transform duration-300 ease-in-out">
      <img src="https://cdn.pixabay.com/photo/2024/06/21/15/56/nature-8844604_1280.jpg" class="w-1/6 hover:opacity-75" />
      <img src="https://cdn.pixabay.com/photo/2023/09/14/08/30/agriculture-8252527_1280.jpg" class="w-1/6 hover:opacity-75" />
      <img src="https://cdn.pixabay.com/photo/2022/05/19/01/34/bird-7206444_1280.jpg" class="w-1/6 hover:opacity-75" />
    </div>
    <button
      type="button"
      id="next-2"
      class="absolute z-10 right-0 bg-blue-800 hover:bg-blue-700 text-white text-2xl font-bold hover:shadow rounded-full w-16 h-16 mr-12"
    >
      →
    </button>
  </div>
</footer>
;
<script>
  $("#footerCarousel-2").carouselBlog({
    prevButtonSelector: "#prev-2",
    nextButtonSelector: "#next-2",
    slidesContainerSelector: ".flex",
    visibleSlides: 4,
    slideWidth: 25,
  });
</script>
```

```HTML
<!-- post section -->
<section id="postsContainer" class="w-full md:w-2/3 flex flex-col items-center px-3"></section>;
<script>
$("#postsContainer")
  .postGenerator("http://127.0.0.1:8005/api/data-tables/view/2")
  .then(({ data, $el }) => {
    console.log("Fetched data:", data);
    console.log("ModernLib element:", $el);
  });
  </script>
```

```html
<!-- pagination -->

<div id="pagination" class="flex items-center py-8"></div>
;

<script>
  $("#pagination").pagination(5, 1);
</script>
```

```html
<!-- aboutMe -->
<div id="i8bwl" class="w-full bg-white shadow flex flex-col my-4 p-6">
  <p class="text-xl font-semibold pb-5">About Us</p>
  <p id="aboutMe" class="pb-2">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mattis est eu odio sagittis tristique. Vestibulum ut finibus leo. In hac habitasse platea
    dictumst.
  </p>
  <a href="#" class="w-full bg-blue-800 text-white font-bold text-sm uppercase rounded hover:bg-blue-700 flex items-center justify-center px-2 py-3 mt-4">
    Get to know us
  </a>
</div>
;

<script>
  $("#aboutMe").postGenerator("http://127.0.0.1:8005/api/data-tables/view/4", (post) => `<span>${post.biography}</span>`);
</script>
```

```javascript
// fetch
$()
  .get("http://127.0.0.1:8005/api/data-tables/view/3")
  .then((data) => {
    console.log("Received data:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

## objectUtils

```javascript
// Використання extend
const obj1 = { a: 1 };
const obj2 = { b: 2 };
$.extend(obj1, obj2); // { a: 1, b: 2 }

// Глибоке клонування
const originalObj = { a: { b: 1 } };
const clonedObj = $.deepClone(originalObj);

// Перевірка на простий об'єкт
$.isPlainObject({}); // true
$.isPlainObject([]); // false

// Сплющення об'єкта
const nestedObj = { a: { b: { c: 1 } } };
$.flattenObject(nestedObj); // { 'a.b.c': 1 }

// Використання extend
const merged = $.extend(true, {}, { a: 1 }, { b: { c: 2 } });

// Перевірка на простий об'єкт
const isPlain = $.isPlainObject({});

// Глибоке клонування
const clone = $.deepClone({ a: { b: 1 } });

// Сплющення об'єкта
const flat = $.flattenObject({ a: { b: { c: 1 } } });

// Або використовуючи $.extend безпосередньо
$.extend(true, {}, obj1, obj2);
```

## Home Posts

```html
<script>
  /*document.getElementById(this.id) == this*/ let el = this;
  $("#mobileMenuToggle").mobileNav();
  // $("#postsContainer").loadPosts("https://api.example.com/posts");
  $("#pagination").pagination(5, 1);
  // Припустимо, що у нас 5 сторінок, і ми на першій
  $("#footerCarousel").carouselBlog();
  // Використовуємо локальні JSON файли для тестування
  //$("#postsContainer").postGenerator("http://127.0.0.1:8005/api/data-tables/view/2");
  $("#postsContainer")
    .postGenerator("http://127.0.0.1:8005/api/data-tables/view/2")
    .then(({ data, $el }) => {
      console.log("Fetched data:", data);
      console.log("ModernLib element:", $el);
    });
  $("#aboutMe")
    .postGenerator(
      "http://127.0.0.1:8005/api/data-tables/view/4",
      (post) => `<span>${post.biography}
</span>`
    )
    .then(({ data, $el }) => {
      console.log("Fetched data:", data);
      console.log("ModernLib element:", $el);
    });
  $("#instagram-2").postGenerator(
    "http://127.0.0.1:8005/api/data-tables/view/3",
    (post) => `<img src="${post.imageUrl}
" src="${post.alt}
" class="hover:opacity-75"/>`
  );
  $()
    .get("http://127.0.0.1:8005/api/data-tables/view/3")
    .then((data) => {
      console.log("Received data:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
</script>
```

## Post Home

```html
<script>
  // Ініціалізація мобільного меню
  $("#mobileMenuToggle").mobileNav();

  // Ініціалізація пагінації (припускаємо, що у нас 5 сторінок і ми на першій)
  $("#pagination").pagination(5, 1);

  // Ініціалізація каруселі футера
  $("#footerCarousel").carouselBlog();

  // Завантаження постів у контейнер
  $("#postsContainer")
    .postGenerator("http://127.0.0.1:8005/api/data-tables/view/2")
    .then(({ data, $el }) => {
      console.log("Fetched data:", data);
      console.log("ModernLib element:", $el);
    })
    .catch((error) => {
      console.error("Error loading posts:", error);
    });

  // Завантаження даних про мене
  $("#aboutMe")
    .postGenerator("http://127.0.0.1:8005/api/data-tables/view/4", (post) => `<span>${post.biography}</span>`)
    .then(({ data, $el }) => {
      console.log("Fetched data:", data);
      console.log("ModernLib element:", $el);
    })
    .catch((error) => {
      console.error("Error loading about me data:", error);
    });

  // Завантаження зображень Instagram
  $("#instagram-2")
    .postGenerator("http://127.0.0.1:8005/api/data-tables/view/3", (post) => `<img src="${post.imageUrl}" alt="${post.alt}" class="hover:opacity-75"/>`)
    .catch((error) => {
      console.error("Error loading Instagram data:", error);
    });

  // Запит до API та обробка результатів
  $()
    .get("http://127.0.0.1:8005/api/data-tables/view/3")
    .then((data) => {
      console.log("Received data:", data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
</script>
```

## Post one

```javascript
$("#aboutMe-2").postGenerator(
  "http://127.0.0.1:8005/api/data-tables/view/4",
  (post) => `<span>${post.biography}
</span>`
);
$("#instagram").postGenerator(
  "http://127.0.0.1:8005/api/data-tables/view/3",
  (post) => `<img src="${post.imageUrl}
" src="${post.alt}
" class="hover:opacity-75"/>`
);
$("#footerCarousel-2").carouselBlog({
  prevButtonSelector: "#prev-2",
  nextButtonSelector: "#next-2",
  slidesContainerSelector: ".flex",
  visibleSlides: 4,
  slideWidth: 25,
});
let queryParams = $().getUrlComponent("queryParams");
console.log("Параметри запиту:", queryParams);

async function loadPosts() {
  try {
    const queryParams = await $().getUrlComponent("queryParams");
    const url = "http://127.0.0.1:8005/api/data-tables/view/2"; // Замініть на ваш актуальний URL

    // Отримання даних
    const response = await $().get(url);
    const posts = JSON.parse(response.data);

    // Використання параметра з запиту або значення за замовчуванням
    const postId = queryParams.id || 1;
    const postData = posts.find((item) => item.id == postId);

    if (!postData) {
      console.error(`Post with ID ${postId} not found.`);
      $("#postone").html("<p>Post not found.</p>");
      return;
    }

    // Формування HTML контенту
    const post = `
      <article class="flex flex-col shadow my-4">
        <a href="${postData.link}" class="hover:opacity-75">
          <img src="${postData.image}" alt="${postData.title}" />
        </a>
        <div class="bg-white flex flex-col justify-start p-6">
          <a href="#" class="text-blue-700 text-sm font-bold uppercase pb-4">${postData.category}</a>
          <a href="${postData.link}" class="text-3xl font-bold hover:text-gray-700 pb-4">${postData.title}</a>
          <p class="text-sm pb-3">
            By <a href="#" class="font-semibold hover:text-gray-800">${postData.author}</a>, Published on ${postData.date}
          </p>
          <p class="pb-3">${postData.text}</p>
        </div>
      </article>`;

    // Виведення даних
    console.log("post", postData);
    $("#postone").html(post);
  } catch (error) {
    console.error("Error fetching post data:", error);
    $("#postone").html("<p>Error loading post data.</p>");
  }
}

loadPosts();
```
