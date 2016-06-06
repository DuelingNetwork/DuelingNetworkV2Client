/*jslint plusplus:true*/
/*global sendRequest, $, modalBox*/

var activeDeck = {
        name: '',
        main: {},
        side: {},
        extra: {},
        isEdited: false

    },
    mainDeckCounts = {
        total: 0,
        normal: 0,
        effect: 0,
        ritual: 0,
        pendulum: 0,
        spell: 0,
        trap: 0
    },
    searchResults = {};

function searchCard() {
    'use strict';
    sendRequest({

    }, function (resp) {});
}

function getCardDetails(cardID) {
    'use strict';
    sendRequest({

    }, function (resp) {});
}

function getCardTypes() {
    'use strict';
    sendRequest({

    }, function (resp) {});
}

function cleardeck() {
    'use strict';
    var card;
    for (card in activeDeck.main) {
        delete activeDeck.main[card];
    }
    for (card in activeDeck.side) {
        delete activeDeck.side[card];
    }
    for (card in activeDeck.extra) {
        delete activeDeck.extra[card];
    }
    activeDeck.isEdited = false;
}

function newdeck(name) {
    'use strict';
    sendRequest({
        name: "new-deck",
        data: {
            deckName: name
        }
    }, function (resp) {});
}

function getdeck(name) {
    'use strict';
    sendRequest({
        name: "get-deck",
        data: {
            deckName: name
        }
    }, function (resp) {
        var i;
        if (activeDeck.isEdited) {
            // modal for deck save confirmation
        }

        cleardeck();
        activeDeck.name = resp.deck.name;
        // loop over deck arrays, insert/modify deck ULs
        for (i = 0; resp.deck.mainDeck.length > i; i++) {
            activeDeck.main[resp.deck.mainDeck[i].id] = resp.deck.mainDeck[i];
        }

        for (i = 0; resp.deck.sideDeck.length > i; i++) {
            activeDeck.main[resp.deck.sideDeck[i].id] = resp.deck.sideDeck[i];
        }

        for (i = 0; resp.deck.extraDeck.length > i; i++) {
            activeDeck.main[resp.deck.extraDeck[i].id] = resp.deck.extraDeck[i];
        }
    });
}


// rename this function?
function getdeckdata() {
    'use strict';
    sendRequest({
        name: "get-deck-data",
        data: {}
    }, function (resp) {
        var names = [],
            defaultname,
            i;
        $('.decklist').html('');

        for (i = 0; resp.deckLites.length > i; i++) {
            $('.decklist').append('<option name="' + resp.deckLites[i].name + '">' + resp.deckLites[i].name + '</option>');
        }

        for (i = 1; i <= 60; i++) {
            $('#maindeck').append('<li><div class="card"></div></li>');
            if (i % 4 === 0) {
                $('#sidedeck').append('<li><div class="card-sm"></div></li>');
                $('#extradeck').append('<li><div class="card-sm"></div></li>');
            }
        }

        $('.decklist option[name="' + resp.defaultDeck.name + '"]').attr("selected", "selected");
        getdeck(resp.defaultDeck.name);
    });
}

function deletedeck(name, decktoload) {
    'use strict';
    sendRequest({
        name: "delete-deck",
        data: {
            deckNameForDelete: name,
            deckNameForGet: decktoload
        }
    }, function (resp) {

    });
}

function renamedeck(oldname, newname) {
    'use strict';
    sendRequest({
        name: "rename-deck",
        data: {
            currentDeckName: oldname,
            newDeckName: newname
        }
    }, function (resp) {
        if (resp.success) {
            modalBox(oldname + ' has been renamed to ' + newname + '.');
        }
    });
}

function savedeck(name, mainDeck, sideDeck, extraDeck, saveAs) {
    'use strict';
    sendRequest({
        name: "save-deck",
        data: {
            deckName: name,
            mainDeck: mainDeck,
            sideDeck: sideDeck,
            extraDeck: extraDeck,
            isSaveAs: saveAs
        }
    }, function (resp) {});
}

function setdefaultdeck() {
    'use strict';
    sendRequest({
        name: "set-default-deck",
        data: {
            deckName: $('.decklist').val()
        }
    }, function (resp) {
        var name = $('.decklist').val();
        if (resp.success) {
            modalBox(name + ' set as default deck.');
        }
    });
}

$('.decklist').change(function () {
    'use strict';
    getdeck($('.decklist').val());
});

//$('.card').mouseover(getCardDetails());

function switchformfields() {
    'use strict';
    if ($('#cardCategory').val() === "All") {
        console.log('all case');
        $('.monster-only').prop('disabled', true);
        $('#cardType').prop('disabled', true);
    } else if ($('#cardCategory').val() === "Monster") {
        console.log('monster case');
        $('.monster-only').prop('disabled', false);
        $('#cardType').prop('disabled', false);
    } else {
        console.log('else case');
        $('.monster-only').prop('disabled', true);
        $('#cardType').prop('disabled', false);
    }
}

function resetShareCode(currentCode) {
    'use strict';
    sendRequest({
        name: "reset-share-code",
        data: {
            currentShareCode: currentCode
        }
    }, function (resp) {

    });
}