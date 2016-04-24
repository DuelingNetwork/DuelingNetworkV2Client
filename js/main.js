/*jslint browser:true*/
/*global $, console, WebSocket, alert*/

var httpBase = 'http://www.duelingnetwork.com:8080/Dueling_Network/v2/action/', //request base for DN's HTTP API
    previousLocation = '', //purposely a global.
    serverConnection = {}, //socket connection to DN.
    loginData,
    heartbeatInterval;

function getSessionId() {
    'use strict';
    var chars = ('0123456789abcdef').split(''),
        sessionId = '',
        i;
    for (i = 0; i < 32; i++) {
        sessionId += chars[Math.floor(Math.random() * 16)];
    }
    return sessionId;
}

function pagenavto(target) {
    'use strict';
    $('.activescreen').removeClass('activescreen');
    $('section').css('display', 'none');
    $('#' + target).css('display', 'block').addClass('activescreen');
    previousLocation = target;
    return false;
}

function sendRequest(request) {
    'use strict';
    serverConnection.send(JSON.stringify(request));
}

function onDNSocketConnect() {
    'use strict';
    console.log("open");
    var request = {
            clientVersion: 1,
            username: loginData.username,
            loginToken: loginData.loginToken,
            sessionId: getSessionId(),
            adminMode: false
        },
        heartbeatRequest = {
            name: "heartbeat",
            data: {}
        };
    sendRequest(request);
    heartbeatInterval = setInterval(function () {
        console.log("sending heartbeat");
        sendRequest(heartbeatRequest);
    }, 30000);
}





function onDNSocketData(message) {
    'use strict';
    console.log(message);
}

function onDNSocketError() {
    'use strict';
}

function onDNSocketClose() {
    'use strict';
    clearInterval(heartbeatInterval);
    serverConnection = {};
    console.log("close");
}

function initDNSocket() {
    'use strict';
    serverConnection = new WebSocket("ws://duelingnetwork.com:1236/");
    serverConnection.onopen = onDNSocketConnect;
    serverConnection.onerror = onDNSocketError;
    serverConnection.onmessage = onDNSocketData;
    serverConnection.onclose = onDNSocketClose;
}

function logout() {
    //'dont use strict';
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

function updateMaxChatMessageLength(max) {
    $('.affectedbymaxChatMessageLength').attr('maxlength', max);
}

$('#formLogin').submit(function (event) {
    'use strict';
    var url = "http://www.duelingnetwork.com:8080/Dueling_Network/v2/action/login",
        rememberMe = $('[name=rememberMe]').prop('checked'),
        input = $('#formLogin').serialize(); // this refers to $('#formLogin')-> result.


    $.post(httpBase + "login", input, function (data) {
        console.log(data);
        if (data.success) {
            pagenavto('mainscreen');
            if (rememberMe) {

            }
            loginData = data;
            initDNSocket();
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
$(function main() { //this is `void main()` from C, C++, C# and Java land.
    'use strict';
    $('#formRegister').submit(function (event) {
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
});