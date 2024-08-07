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
/* отримати елемент за індексом*/
$('div').eq(2).find('.more')
/* отримати елементи*/
$('.some').closest('.findme')
/*знайти сусідні блоки*/
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