# display

$('.active').hide()
$('.active').show();
$('.active').toggle();

# class

$('.active').addClass(['push','eee']);
$('.active').removeClass('pusher');
$('.active').toggleClass('eee');

# actions

/_замінити html елемента_/
$('button').html('Click');
/отримати елемент за номером та перемкнути клас*/
 $('div').eq(1).toggleClass("active");
/* отримати елемент за індексом*/
$(this).index()
/_ отримати елемент за індексом_/
$('div').eq(2).find('.more')
/* отримати елементи*/
$('.some').closest('.findme')
/_знайти сусідні блоки_/
$('.more').eq(0).siblings()

# handlers

$('.active').on('click', sayHello);
$('.active').off('click', sayHello);
$('.active').click(sayHello);
function sayHello(){
console.log('Hello')
}

# method

$('.carousel').carousel();
$('.accordion-head').accordion();
$('.dropdown-toggle').dropdown();
$('[data-toggle="modal"]').modal();
$('[data-tabpanel] .tab-item').tab();

$('.carousel').carousel();
$('.dropdown-toggle').dropdown();
$('[data-toggle="modal"]').modal();
$('.accordion-head').accordion();
$('[data-tabpanel] .tab-item').tab();
$('.dropdown-toggle').dropdown();

# postGenerator

$('#postsContainer').postGenerator('http://127.0.0.1:8005/api/data-tables/view/2').then(({data, $el}) => {
console.log('Fetched data:', data);
console.log('ModernLib element:', $el);
}
);

## editor

<textarea id="editor"></textarea>
$("#editor").ckeditor({
// Опції CKEditor
});

Ініціалізація CKEditor:

$("#editor").ckeditor({
toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'imageUpload', 'undo', 'redo'],
image: {
toolbar: ['imageTextAlternative', '|', 'imageStyle:full', 'imageStyle:side'],
upload: {
types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
}
},
ckfinder: {
uploadUrl: 'https://example.com/upload'
}
});

Отримання екземпляра редактора:

javascriptCopyconst editor = $("#editor").getCKEditor();

Отримання введеного тексту:

javascriptCopyconst content = $("#editor").ckeditorContent();
console.log('Введений текст:', content);

Встановлення тексту в редактор:

javascriptCopy$("#editor").ckeditorContent('<p>Новий текст</p>');

Знищення редактора:

javascriptCopy$("#editor").ckeditorDestroy();

Прослуховування змін (це потрібно робити після ініціалізації):

javascriptCopy$("#editor").ckeditor({
  // опції...
}).then(() => {
  const editor = $("#editor").getCKEditor();
  if (editor) {
    editor.model.document.on('change:data', () => {
      console.log('Вміст редактора змінено');
    });
  }
});
Ось приклад, як це може виглядати разом:
javascriptCopy$("#editor").ckeditor({
toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'imageUpload', 'undo', 'redo'],
image: {
toolbar: ['imageTextAlternative', '|', 'imageStyle:full', 'imageStyle:side'],
upload: {
types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
}
},
ckfinder: {
uploadUrl: 'https://example.com/upload'
}
}).then(() => {
const editor = $("#editor").getCKEditor();
if (editor) {
editor.model.document.on('change:data', () => {
console.log('Вміст редактора змінено');
console.log('Поточний вміст:', $("#editor").ckeditorContent());
});
}
});

// Кнопка для отримання вмісту
$("#getContent").on('click', function() {
console.log('Поточний вміст:', $("#editor").ckeditorContent());
});

// Кнопка для встановлення вмісту
$("#setContent").on('click', function() {
$("#editor").ckeditorContent('<p>Новий текст</p>');
});

// Кнопка для знищення редактора
$("#destroyEditor").on('click', function() {
$("#editor").ckeditorDestroy();
});
Зверніть увагу, що для роботи з завантаженням зображень вам все одно потрібно буде налаштувати серверну частину, яка буде обробляти завантаження за вказаним URL (uploadUrl).
