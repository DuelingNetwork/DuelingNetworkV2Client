/*global $, console*/

var previousLocation = ''; //purposely a global.

function pagenavto(target) {
    'use strict';
    $('.activescreen').removeClass('activescreen');
    $('section').css('display', 'none');
    $('#' + target).css('display', 'block').addClass('activescreen');
    previousLocation = target;
    return false;
}

$('#formLogin').submit(function (event) {
    'use strict';
    var url = "http://www.duelingnetwork.com:8080/Dueling_Network/v2/action/login",
        input = $(this).serialize(); // this refers to $('#formLogin')-> result.

    $.post(url, input, function (data) {
        console.log(data);
        if (data.success) {
            pagenavto('mainscreen');
        }
    });

    event.preventDefault();
});