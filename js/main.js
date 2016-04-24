/*jslint browser:true*/
/*global $, console, WebSocket*/

var previousLocation = '', //purposely a global.
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
function logout(){
    var url = "http://www.duelingnetwork.com:8080/Dueling_Network/v2/action/login",
        rememberMe = $('[name=rememberMe]').prop('checked'),
        input = $(this).serialize(); // this refers to $('#formLogin')-> result.

    $.post(url, input, function (data) {
        console.log(data);
        if (data.success) {
            pagenavto('mainscreen');
            if (rememberMe) {

            }
            initDNSocket();
        }
    });

}

$('#formLogin').submit(function (event) {
    'use strict';
    var url = "http://www.duelingnetwork.com:8080/Dueling_Network/v2/action/login",
        rememberMe = $('[name=rememberMe]').prop('checked'),
        input = $('#formLogin').serialize(); // this refers to $('#formLogin')-> result.

    $.post(url, input, function (data) {
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


$(function main() { //this is `void main()` from C, C++, C# and Java land.
    'use strict';
});