/*jslint */
/*global sendRequest*/
function getOtherProfile(userName, callback) {
    'use strict';
    sendRequest({
        name: "get-profile",
        data: {
            username: userName
        }
    }, callback);
}

function getMyProfile(callback) {
    'use strict';
    sendRequest({
        name: "my-profile"
    }, callback);
}

function saveProfile(newAvatar, newCardBack, newCardBackColor1, newCardBackColor2, newProfile, callback) {
    'use strict';
    newAvatar = newAvatar || null;
    newCardBack = newCardBack || null;
    newCardBackColor1 = newCardBackColor1 || null;
    newCardBackColor2 = newCardBackColor2 || null;
    newProfile = newProfile || null;

    callback = (typeof callback === 'function') ? callback : function () {};

    sendRequest({
        name: "save-profile",
        data: {
            avatar: newAvatar,
            cardBack: newCardBack,
            cardBackColor1: newCardBackColor1,
            cardBackColor2: newCardBackColor2,
            profile: newProfile
        }
    }, callback);

}

function redeemReward(transID, callback) {
    'use strict';
    sendRequest({
        name: "redeem-reward",
        data: {
            transactionID: transID
        }
    }, callback);
}