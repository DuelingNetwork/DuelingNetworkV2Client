/*global sendRequest*/

function cleardeck() {

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

    });
}

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
            $('.decklist').append('<option name="' + resp.deckLites[i].name + '">' + resp.deckLites[i].name + '<option>');
        }
        $('.decklist option[value="' + resp.defaultDeck.name + '"]').attr("selected", "selected");
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
    }, function (resp) {});
}

function savedeck(name, mainDeck, sideDeck, extraDeck) {
    'use strict';
    sendRequest({
        name: "save-deck",
        data: {
            deckName: name,
            mainDeck: mainDeck,
            sideDeck: sideDeck,
            extraDeck: extraDeck,
            isSaveAs: true // is this always true?s
        }
    }, function (resp) {});
}

function setdefaultdeck(name) {
    'use strict';
    sendRequest({
        name: "set-default-deck",
        data: {
            deckName: name
        }
    }, function (resp) {});
}