import $ from "./lib/lib";

$(".active").on("click", sayHello);
$(".active").off("click", sayHello);
$("button").on("click", function () {
  $(this).toggleClass("active");
  $('#set').setAttr("value", "Now it's a button");
});

function sayHello() {
  console.log("Hello");
}
