/*jslint browser:true, plusplus : true*/
/*global $, console, WebSocket, alert*/

var httpBase = 'http://www.duelingnetwork.com:8080/Dueling_Network/v2/action/', //request base for DN's HTTP API

    adminColrs = {
        0: '',
        1: 'green',
        2: 'silver',
        3: 'gold',
        4: 'gold'
    },
    serverConnection = null, //socket connection to DN.
    previousLocation = '', //purposely a global.
    heartbeatInterval,
    requestCallbacks = [],
    onlineUsers,
    friends = [],
    onlineFriends = [],
    onlineUserCount = 0,
    dnClientVersion = 1,
    lastLoginData,
    rememberMe,
    userIsAdmin = false,
    isAdminLoggedIn = false,
    isShowingModal = false;

function initDefaults() {
    'use strict';
    serverConnection = null;
    previousLocation = '';
    requestCallbacks = [];
    friends = [];
    onlineFriends = [];
    onlineUserCount = 0;
    dnClientVersion = 1;
    userIsAdmin = false;
    isAdminLoggedIn = false;
    isShowingModal = false;
}

// Use the browser's built-in functionality to quickly and safely escape the
// string
function escapeHtml(str) {
    'use strict';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// UNSAFE with unsafe strings; only use on previously-escaped ones!
function unescapeHtml(escapedStr) {
    'use strict';
    var div = document.createElement('div'),
        child;
    div.innerHTML = escapedStr;
    child = div.childNodes[0];
    return child ? child.nodeValue : '';
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


function sendRequest(request, callback) {
    'use strict';
    // somewhere in our code, a request is happening before the socket has been initialized.
    // stop that from messing up
    // TODO: rewrite that call, please
    if (serverConnection !== null) {
        serverConnection.send(JSON.stringify(request));
        requestCallbacks.push(callback);
    } else {
        console.log("Stop making requests if the socket is dead or hasn't been initialized yet.");
    }
}

function onDNSocketConnect(loginData) {
    'use strict';
    console.log("open");
    var request = {
            clientVersion: dnClientVersion,
            username: loginData.username,
            loginToken: loginData.loginToken,
            sessionId: getSessionId(),
            adminMode: isAdminLoggedIn
        },
        heartbeatRequest = {
            name: "heartbeat",
            data: {}
        };
    sendRequest(request, handleLoginResponse);
    heartbeatInterval = setInterval(function () {
        sendRequest(heartbeatRequest, null);
    }, 30000);
}

function renderUserList() {
    'use strict';
    var i,
        n,
        user,
        friend;
    $("#onlineusers ul").html('');
    onlineUsers = onlineUsers.sort(function (a, b) {
        if (a.currentAdminRole > 0 || b.currentAdminRole > 0) {
            if (a.currentAdminRole === b.currentAdminRole) {
                return a.username > b.username;
            }
            return b.currentAdminRole - a.currentAdminRole;
        }
        return a.username > b.username;
    });
    onlineFriends = onlineFriends.sort(function (a, b) {
        return a.username > b.username;
    });
    for (n = 0; onlineFriends.length > n; n++) {
        $("#onlineusers ul").append('<li><span class="friend">' + escapeHtml(onlineFriends[n].username) + '</span></li>');
    }
    for (i = 0; onlineUsers.length > i; i++) {
        user = onlineUsers[i];
        $("#onlineusers ul").append('<li><span class="' + adminColrs[user.currentAdminRole] + '">' + escapeHtml(user.username) + '</span></li>');
    }
    $('#useronlinecount').text('Users Online: ' + onlineUsers.length);

}

function handleNotification(notification) {
    'use strict';
    switch (notification.name) {
    case ('chat-unlock'):
        break;
    case ('global-message'):
        $("#chat ul").append('<li><span class="' + adminColrs[notification.currentAdminRole] + '">' + notification.username + ':</span> ' + escapeHtml(notification.message) + '</li>');
        $("#chat ul").animate({
            scrollTop: $('#chat ul')[0].scrollHeight
        }, 1000);
        break;
    case ('add-user'):
        onlineUsers.push({
            username: notification.username,
            currentAdminRole: notification.currentAdminRole
        });
        renderUserList();
        break;
    case ('remove-user'):
        onlineUsers = onlineUsers.filter(function (currentUser) {
            if (currentUser.username === notification.username) {
                return false;
            }
            return true;
        });
        renderUserList();
        break;
    default:
        return;
    }
}

function modalBox(message) {
    'use strict';
    if (isShowingModal) { return; }

    $('<div class="modalContainer"><div class="modalBox"><div class="modalMessage">' + message + '</div><div class="modalOKButton">OK</div></div></div>').appendTo(document.body);
    $('.modalOKButton').focus();
    isShowingModal = true;
    $('.modalOKButton').click(function () {
        $(this).parent().parent().remove();
        isShowingModal = false;
    });
}


function handleLoginResponse(resp) {
    'use strict';
    var user;
    if (!resp.success) {
        console.log('login error: ' + resp.error);
        modalBox(resp.error);
        return;
    }
    pagenavto('mainscreen');
    if (resp.admin) {
        userIsAdmin = resp.admin > 0;
    }
    if (resp.currentAdminRole) {
        isAdminLoggedIn = resp.currentAdminRole > 0;
    }
    if (resp.onlineUsers) {
        onlineUsers = resp.onlineUsers;
        onlineUserCount = onlineUsers.length;
        if (resp.friends) {
            onlineUsers.forEach(function (currentUser) {
                if (friends.indexOf(currentUser.username) > -1 && currentUser.currentAdminRole === 0) {
                    onlineFriends.push(currentUser);
                }
            });
        }
    }
    if (userIsAdmin) {
        $('#adminswitchcontainer').css('display', 'block');
        if (isAdminLoggedIn) {
            $('#openadminpanel').css('display', 'block');
            // TODO: fix up the display buttons when logged in as admin
        }
    }
    renderUserList();
}

function onDNSocketData(message) {
    'use strict';
    var data;
    try {
        data = JSON.parse(message.data);
    } catch (parse_error) {
        modalBox("Malformed server response");
        console.log('Could not parse:', message.data);
        return;
    }
    console.log(data); // used for debug,... dont remove.
    if (data.isNotification) {
        handleNotification(data);
        return;
    }
    var requestCallback = requestCallbacks.shift();
    if (requestCallback) {
        requestCallback(data);
    }
}

function onDNSocketError() {
    'use strict';
    modalBox("DN Socket error. Please consider refreshing the page.");
}

function onDNSocketClose() {
    'use strict';
    clearInterval(heartbeatInterval);
    console.log("close");
    initDefaults();
    $('#chat').hide();
    $('#onlineusers').hide();
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


function updateMaxChatMessageLength(max) {
    'use strict';
    $('.affectedbymaxChatMessageLength').attr('maxlength', max);
}

$(function main() { //this is `void main()` from C, C++, C# and Java land.
    'use strict';
    $('#formLogin').submit(function (event) {

        var rememberMe = $('[name=rememberMe]').prop('checked'),
            input = $('#formLogin').serialize(); // this refers to $('#formLogin')-> result.
        $.post(httpBase + "login", input, function (data) {
            console.log(data);
            if (data.success) {

                localStorage.rememberMe = rememberMe;
                lastLoginData = data;
                /*if (data.admin) {
                    $('#adminlogin' + data.admin).css('display', 'block');
                } else {
                    initDNSocket(data);
                }*/
                // TODO: discuss admin login; for now just init the socket anyway
                initDNSocket(data);

            } else {
                modalBox(data.error);
            }
        });
        event.preventDefault();
    });

    $('#formForgotPW').submit(function (event) {
        $.post(httpBase + "forgot_password", $(this).serialize(), function (data) {
            console.log(data);
            if (data.success) {
                modalBox(data.message);
                $('.backToLogin').click(); // eh... could also be made better
            } else {
                modalBox(data.error);
            }
        });
        event.preventDefault();
    });

    $('#chat input').bind("enterKey", function (e) {
        var message = escapeHtml($('#chat input').val());
        message = {
            name: "global-message",
            data: {
                message: message
            }
        };
        sendRequest(message, function (resp) {
            // TODO: check success status
        });
        $('#chat input').val('');
    });
    $('#chat input').keyup(function (e) {
        if (e.keyCode === 13) {
            $(this).trigger("enterKey");
        }
    });
    $('.chatminimize, #chat .minimize').on('click', function () {
        $('#chat').toggle();
        $('#chat > input').focus();
    });
    $('.onlinelistminimize, #onlineusers .minimize').on('click', function () {
        $('#onlineusers').toggle();
    });
    $('#formRegister').submit(function (event) {
        $.post(httpBase + "register", $(this).serialize(), function (data) {
            console.log(data);
            if (data.success) {
                modalBox(data.message);
                $('.backToLogin').click(); // eh... could also be made better
            } else {
                modalBox(data.error);
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

    $('#adminswitch').click(function () {
        var previousAdminLoggedIn = isAdminLoggedIn;
        if (serverConnection !== null) {
            serverConnection.onclose = function () {};
            serverConnection.close();
            clearInterval(heartbeatInterval);
            initDefaults();
            isAdminLoggedIn = !previousAdminLoggedIn;
            initDNSocket(lastLoginData);
        }
    });
    $('[draggable="true"]').draggable({
        containment: "parent"
    });
    $('#openmyprofile').click(function () {
        getMyProfile(function (profileData) {
            // TODO: set up a UI for this tab
            // if UI and functions in comment are implemented, uncomment below code
            /*
            $('#profileAvatar').attr('src', profileData.avatar);
            if (profileData.hasReward === true) {
                $('#avatarBorder').css('border', 'gold 2px solid'); // make this look pretty, please
            }
            if (userIsAdmin && !profileData.startsWith("Insufficient")) {
                enableCustomRewards();
            }
            makeProfileAvatarSelection(profileData.avatarGallery, profileData.totalWins);
            makeProfileCBSelection(profileData.cardBackGallery, profileData.totalExperience);
            */
        });
    });
});
