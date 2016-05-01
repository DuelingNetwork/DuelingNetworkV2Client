/*jslint browser:true, plusplus : true*/
/*global $, console, WebSocket, alert*/

var httpBase = 'http://www.duelingnetwork.com:8080/Dueling_Network/v2/action/', //request base for DN's HTTP API
    previousLocation = '', //purposely a global.
    serverConnection = {}, //socket connection to DN.

    heartbeatInterval,
    adminColrs = {
        0: '',
        1: 'green',
        2: 'silver',
        3: 'gold',
        4: 'gold'
    },
    userlist = {},
    onlineUsers,
    onlineUserCount = 0,
    dnClientVersion = 1,
    rememberMe,
    menuInited = false;

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
    if (target !== 'landing') {
        $('#camera, .publicchatlist, .privateminimize, .chatminimize').css('display', 'block');
    } else {
        $('#camera, .publicchatlist, .privateminimize, .chatminimize').css('display', 'none');
    }
    if (target === 'deckeditor') {
        return;
    }
    if (target === 'ranking') {
        return;
    }
    if (target === 'profileviewer') {
        return;
    }
    return false;
}

function sendRequest(request) {
    'use strict';
    serverConnection.send(JSON.stringify(request));
}

function onDNSocketConnect(loginData) {
    'use strict';
    console.log("open");
    var request = {
            clientVersion: dnClientVersion,
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

function handleNotification(notification) {
    'use strict';
    console.log('notification');
    switch (notification.name) {
    case ('chat-unlock'):
        break;
    default:
        return;
    }
}

function handleLoginResponse(resp) {
    'use strict';
    var user;
    if (!resp.success) {
        // TODO: Render an error message.
        console.log('login error: ' + resp.error);
        return;
    }
    pagenavto('mainscreen');
    menuInited = true;
    if (resp.onlineUsers) {
        onlineUsers = resp.onlineUsers;
        for (user in resp.onlineUsers) {
            if (resp.onlineUsers.hasOwnProperty(user)) {
                userlist[user] = resp.onlineUsers[user];
            }
        }
        onlineUserCount = Object.keys(userlist).length;
    }
    $('#useronlinecount').text('Users Online: ' + onlineUserCount);
}

function onDNSocketData(message) {
    'use strict';
    var user,
        data;
    try {
        data = JSON.parse(message.data);
    } catch (parse_error) {
        console.log('Could not parse:', message.data);
        return;
    }
    console.log(data);
    if (data.isNotification) {
        handleNotification(data);
        return;
    }
    if (!menuInited) {
        handleLoginResponse(data);
        return;
    }
    if (data.error) {
        alert(data.error);
    }
    // TODO: handle other responses
}



function onDNSocketError() {
    'use strict';
}

function onDNSocketClose() {
    'use strict';
    clearInterval(heartbeatInterval);
    serverConnection = {};
    console.log("close");
    menuInited = false;
}

function initDNSocket(loginData) {
    'use strict';
    serverConnection = new WebSocket("ws://duelingnetwork.com:1236/");
    serverConnection.onopen = function () {
        onDNSocketConnect(loginData);
    };
    serverConnection.onerror = onDNSocketError;
    serverConnection.onmessage = onDNSocketData;
    serverConnection.onclose = onDNSocketClose;
    $('.adminlogin').css('display', 'none');
}

function logout() {
    //'dont use strict';
    $.post(httpBase + "logout", {}, function (data) {
        console.log(data);
        if (data.success) {
            pagenavto('mainscreen');
            if (rememberMe) {
                return;
            }
        }
    });
}

function renderUserList() {

}

function updateMaxChatMessageLength(max) {
    'use strict';
    $('.affectedbymaxChatMessageLength').attr('maxlength', max);
}

$('#formLogin').submit(function (event) {
    'use strict';
    var rememberMe = $('[name=rememberMe]').prop('checked'),
        input = $('#formLogin').serialize(); // this refers to $('#formLogin')-> result.
    $.post(httpBase + "login", input, function (data) {
        console.log(data);
        if (data.success) {
            if (rememberMe) {

            }
            if (data.admin) {
                $('#adminlogin' + data.admin).css('display', 'block');
            } else {
                initDNSocket(data);
            }

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
    $('#chat input').bind("enterKey", function (e) {
        var message = $('#chat input').val().replace(/\,/g, '\\,');
        //connection.write('Global message,' + message + '\0');
        $('#chat input').val('');
    });
    $('#chat input').keyup(function (e) {
        console.log(e.keyCode);
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });
    $('.chatminimize, .minimize').on('click', function () {
        $('#chat').toggle();
    });
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