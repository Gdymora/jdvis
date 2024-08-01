# display
$('.active').hide()
$('.active').show();
$('.active').toggle();

# classes
$('.active').addClass(['push','eee']);
$('.active').removeClass('pusher');
$('.active').toggleClass('eee');

# actions
$('.active').on('click', sayHello);
$('.active').off('click', sayHello);
$('.active').click(sayHello);
function sayHello(){
    console.log('Hello')
}