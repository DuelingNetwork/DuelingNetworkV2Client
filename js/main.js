/*jslint browser:true*/
/*global $, console, WebSocket*/

var httpBase = "http://www.duelingnetwork.com:8080/Dueling_Network/v2/action/", //base to DN's HTTP APIs
    previousLocation = '', //purposely a global.
    serverConnection = {}; //socket connection to DN.

function pagenavto(target) {
    'use strict';
    $('.activescreen').removeClass('activescreen');
    $('section').css('display', 'none');
    $('#' + target).css('display', 'block').addClass('activescreen');
    previousLocation = target;
    return false;
}

function onDNSocketConnect() {
    'use strict';
}

function onDNSocketData(message) {
    'use strict';
    console.log(message);
}

function onDNSocketError() {
    'use strict';
}

function initDNSocket() {
    'use strict';
    serverConnection = new WebSocket("ws://duelingnetwork.com:1236/");
    serverConnection.onopen = onDNSocketConnect;
    serverConnection.onerror = onDNSocketError;
    serverConnection.onmessage = onDNSocketData;
}


$('#formLogin').submit(function (event) {
    'use strict';
    var rememberMe = $('[name=rememberMe]').prop('checked'),
        input = $(this).serialize(); // this refers to $('#formLogin')-> result.

    $.post(httpBase + "login", input, function (data) {
        console.log(data);
        if (data.success) {
            pagenavto('mainscreen');
            if (rememberMe) {

            }
            initDNSocket();
        }
    });

    event.preventDefault();
});

$('#formRegister').submit(function (event) {
    'use strict';
    $.post(httpBase + "register", $(this).serialize(), function (data) {
        console.log(data);
        if (data.success) {
            alert(data.message); // TODO: display this somewhere useful
            $('.backToLogin').click(); // eh... could also be made better
        } else {
            alert(data.error);
        }
    });
    
    event.preventDefault();
});

$('#formForgotPW').submit(function (event) {
    'use strict';
    $.post(httpBase + "forgot_password", $(this).serialize(), function (data) {
        console.log(data);
        if (data.success) {
            alert(data.message); // TODO: display this somewhere useful
            $('.backToLogin').click(); // eh... could also be made better
        } else {
            alert(data.error);
        }
    });
    
    event.preventDefault();
});

$('#registerButton').click(function () {
    $('.displayform.activeform').removeClass('activeform');
    $('#formRegister').addClass('activeform');
});

$('#forgotPWButton').click(function () {
    $('.displayform.activeform').removeClass('activeform');
    $('#formForgotPW').addClass('activeform');
});

$('.backToLogin').click(function () {
    $('.displayform.activeform').removeClass('activeform');
    $('#formLogin').addClass('activeform');
});

$(function main() { //this is `void main()` from C, C++, C# and Java land.
    'use strict';
});