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

function saveProfile(newAvatar = null, newCardBack = null, newCardBackColor1 = null, newCardBackColor2 = null, newProfile = null, callback) {
    'use strict';
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
