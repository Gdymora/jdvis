import $ from "./lib/lib";

$(".active").on("click", sayHello);
$(".active").off("click", sayHello);

$("button").on("click", function () {
  $('div').eq(1).toggleClass("active");
});

$("div").on("click", function () { 
  console.log($(this).index());
  $('div').find(1);
});
console.log($('div').eq(2).find('.more'));
$('button').html('Click');
console.log($('.some').closest('.findme'));
console.log($('.more').eq(0).siblings())
console.log($('.findme').siblings())
function sayHello() {
  console.log('Click');
}