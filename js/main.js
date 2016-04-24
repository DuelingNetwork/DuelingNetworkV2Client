/*jslint browser:true*/
/*global $, console, WebSocket*/

var previousLocation = '', //purposely a global.
    serverConnection = {}, //socket connection to DN.
    loginData = null,
    heartbeatInterval = null;

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
    console.log("open");
    var request = {
      clientVersion: 1,
      username: loginData.username,
      loginToken: loginData.loginToken,
      sessionId: getSessionId(),
      adminMode: false
    };
    sendRequest(request);
    var heartbeatRequest = {
      name: "heartbeat",
      data: {}
    };
    heartbeatInterval = setInterval(
        function() {
          console.log("sending heartbeat");
          sendRequest(heartbeatRequest);
        },
        30000);
}

function sendRequest(request) {
    serverConnection.send(JSON.stringify(request));
}

function getSessionId() {
    var chars = '0123456789abcdef'.split('');
    var sessionId = '';
    for (var i = 0; i < 32; i++) {
      sessionId += chars[Math.floor(Math.random() * 16)];
    }
    return sessionId;
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
    heartbeatInterval = null;
    socket = null;
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


$('#formLogin').submit(function (event) {
    'use strict';
    var url = "http://www.duelingnetwork.com:8080/Dueling_Network/v2/action/login",
        rememberMe = $('[name=rememberMe]').prop('checked'),
        input = $(this).serialize(); // this refers to $('#formLogin')-> result.

    $.post(url, input, function (data) {
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


$(function main() { //this is `void main()` from C, C++, C# and Java land.
    'use strict';
});
