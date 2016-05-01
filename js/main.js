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


// Use the browser's built-in functionality to quickly and safely escape the
// string
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

// UNSAFE with unsafe strings; only use on previously-escaped ones!
function unescapeHtml(escapedStr) {
    var div = document.createElement('div');
    div.innerHTML = escapedStr;
    var child = div.childNodes[0];
    return child ? child.nodeValue : '';
};

function secure() {
    return ()
}

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
        $('#camera, .onlinelistminimize, .privateminimize, .chatminimize').css('display', 'block');
    } else {
        $('#camera, .onlinelistminimize, .privateminimize, .chatminimize').css('display', 'none');
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
        //console.log("sending heartbeat");
        sendRequest(heartbeatRequest);
    }, 30000);
}

function handleNotification(notification) {
    'use strict';
    console.log('notification');
    switch (notification.name) {
    case ('chat-unlock'):
        break;
    case ('global-message'):
        $("#chat ul").append('<li><span class="' + adminColrs[notification.currentAdminRole] + '">' + notification.username + '</span>: ' + escapeHtml(notification.message) + '</li>');
        $("#chat ul").animate({
            scrollTop: $('#chat ul')[0].scrollHeight
        }, 1000);
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
    renderUserList();

}

function onDNSocketData(message) {
    'use strict';
    var user,
        data;
    if (message.data === '{"success":true}') {
        //remove noisy heartbeat
        return;
    }
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
    'use strict';
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
    var i,
        user;
    $("#onlineusers ul").html('');
    for (i = 0; onlineUsers.length > i; i++) {
        user = onlineUsers[i];
        $("#onlineusers ul").append('<li><span class="' + adminColrs[user.currentAdminRole] + '">' + user.username + '</span></li>');
    }
    $('#useronlinecount').text('Users Online: ' + onlineUsers.length);

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

            localStorage.rememberMe = rememberMe;

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
        var message = escapeHtml($('#chat input').val());
        message = {
            name: "global-message",
            data: {
                message: message
            }
        };
        sendRequest(message);
        $('#chat input').val('');
    });
    $('#chat input').keyup(function (e) {
        if (e.keyCode === 13) {
            $(this).trigger("enterKey");
        }
    });
    $('.chatminimize, #chat .minimize').on('click', function () {
        $('#chat').toggle();
    });
    $('.onlinelistminimize, #onlineusers .minimize').on('click', function () {
        $('#onlineusers').toggle();
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