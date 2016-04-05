/* jslint browser : true */
/* jslint node : true */
/* global $ */
var usersOnline = {};
var duels = {
	addDuel: function(propname, o){
		if( typeof propname !== "string" ) {
			return false;
		}
		if( typeof o !== "object" ) {
			return false;
		}
		var p = String();
		p += propname;
		duels[p] = o;
		return duels;
	},
	removeDuel: function(prop){
		delete duels[prop];
		return duels;
	},
	toList: function(f){
		var list = [], x, i = 0, htmlList = '<ul>', aELO, bELO;
		for(x in duels) {
			if(typeof duels[x] === "object" && duels[x].format === f) {
				list.push(duels[x]);
			} else {
				continue;
			}
		}
		list = list.sort(function(a,b){
			aELO = parseInt(a.stats.split("/")[0],10);
			bELO = parseInt(b.stats.split("/")[0],10);
			return bELO - aELO;
		});
		for(i; i < list.length; i++) {
			htmlList += '<li class="duelentry"><span class="user">' + list[i].user + '</span>&emsp;<span class="elo">' + list[i].stats + '</span></li>';
		}
		htmlList += '</ul>';
		return htmlList;
	}
};
var globalState = {
	state: 0,
	pushState: function(val) {
		globalState[globalState.state++] = val;
		return globalState;
	}
};

var application = false;
if (require) {
    application = true;
    var http = require('http');
    var https = require('https');
    var net = require('net');
}

var connection;

function randomHex(length) {
    var text = "";
    var charset = "abcdef0123456789";
    for (var i = 0; i < length; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}

function login(username, password, remember) {
    username = $('#username').val();
    password = $('#password').val();
    remember = '' + $('#remember').val();
    var parameters = {
        url: 'http://duelingnetwork.com/',
        domain: 'duelingnetwork.com',
        logined: 'http://www.duelingnetwork.com:8080/Dueling_Network/logged_in.do',
        login: 'http://duel.duelingnetwork.com:8080/Dueling_Network/login.do',
        port: '1234'
    };
    $.ajax({
        type: "POST",
        url: parameters.logined,
        data: 'dn_id=ffffffffffffffffffffffffffffffff',
        success: function (data) {
            console.log(data);
            var response = data.split(',');
            if (data !== 'Not logged in') {
                connection = DuelingNetwork(username, response[2]);
            } else {
                console.log('forcing login');
                $.ajax({
                    type: "POST",
                    url: parameters.login,
                    data: 'username=' + username + '&password=' + password + '&remember_me=' + remember + '&dn_id=ffffffffffffffffffffffffffffffff',
                    success: function (data) {
                        var response = data.split(',');
                        connection = DuelingNetwork(username, response[2]);
                    },
                    dataType: 'text'
                });
            }
        },
        dataType: 'text'
    });


}

function DuelingNetwork(username, serverSession) {

    var clientSession = randomHex(32);
    var client = new net.Socket();
    var version = 'Connect20';
    var bufferBank = '';
    var heartbeatControl;

    function heartbeat() {
        heartbeatControl = setInterval(function () {
            client.write('Heartbeat\0');
        }, 28000);
    }

    client.connect(1234, 'duelingnetwork.com', function () {

        var datastring = version + ',' + username + ',' + serverSession + ',' + clientSession + '\0';
        var message = new Buffer(datastring, 'utf-8');
        client.write(message);
        heartbeat();
        $('#landing, #chat, #mainscreen').toggle();

    });

    client.on('data', function (data) {
        bufferBank = bufferBank + data;
        var nullcheck = [];
        if (bufferBank.indexOf('\0') !== -1) {
            nullcheck = bufferBank.split('\0');
        }

        if (nullcheck.length > 1) {
            for (var i = 0; nullcheck.length - 1 > i; i++) {
                processDNMessage(version, client, nullcheck[i]);
            }
            bufferBank = nullcheck[nullcheck.length - 1];
        }
    });

    client.on('close', function () {
        console.log('Connection closed');
    });
    return client;
}

function speak() {

}
$('#chat input').bind("enterKey", function (e) {
    var message = $('#chat input').val().replace(/\,/g,'\\,');
    connection.write('Global message,' + message + '\0');
    $('#chat input').val('');
});
$('#chat input').keyup(function (e) {
    if (e.keyCode == 13) {
        $(this).trigger("enterKey");
    }
});
$('.chatminimize, .minimize').on('click', function () {
    $('#chat').toggle();
});
$('#openroom').on('click',function(){
	connection.write("Load duel room\0");
	$('#mainscreen,#duelroom').toggle();
	var update = setInterval(function(){
		$('#au').html(duels.toList('au'));
		$('#tu').html(duels.toList('tu'));
		$('#uu').html(duels.toList('uu'));
	},1000);
});

function processDNMessage(version, client, data) {

    var command = '' + data;
    command = command.replace(/\\,/g, '\\;');
    command = command.split(',');
    switch (command[0]) {
    case 'Online users':
        {
            usersOnline[command[1]] = command[2] || false;
            //console.log('+');
            break;
        }
    case 'Offline users':
        {
            delete usersOnline[command[1]];
            //console.log('-');
            break;
        }
    case 'Global message':
        {
            globalState.pushState(data);
            $("#chat ul").append('<li><span class="username' + command[3] + '">' + command[1] + '</span>: ' + command[2].replace(/\\;/g,',') + '</li>');
            $("#chat ul").animate({
                scrollTop: $('#chat ul')[0].scrollHeight
            }, 1000);
            break;
        }
    case 'Heartbeat':
        {
            break;
        }
    case 'Chat unlock':
        {
            break;
        }
	case 'Add duels':
		{
			duels.addDuel(command[command.length-1],{"format":command[1],"s_or_m":command[2],"user":command[3],"stats":command[4]});
			break;
		}
	case 'Remove duels':
		{
			duels.removeDuel(command[3]);
			break;
		}
    default:
        {
            console.log('DN:: ' + data);
			break;
        }

    }
}
