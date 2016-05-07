/*global sendRequest*/

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
    }, function (resp) {});
}

function getdeckdata(name) {
    'use strict';
    sendRequest({
        name: "get-deck-data",
        data: {}
    }, function (resp) {});
}

function deletedeck(name, decktoload) {
    'use strict';
    sendRequest({
        name: "delete-deck",
        data: {
            deckNameForDelete: name,
            deckNameForGet: decktoload
        }
    }, function (resp) {});
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

function getDuels(format, isRated) {
    'use strict';
    sendRequest({},
        function (resp) {});
}