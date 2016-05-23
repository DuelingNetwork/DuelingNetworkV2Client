function getOtherProfile(userName) {
    'use strict';
    sendRequest({
        name: "get-profile",
        data: {
            username: userName
        }
    }, function (resp) {

    });
}

function getMyProfile() {
    'use strict';
    sendRequest({
        name: "my-profile"
    }, function (resp) {

    });
}

function saveProfile(newAvatar = null, newCardBack = null, newCardBackColor1 = null, newCardBackColor2 = null, newProfile = null) {
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
    }, function(resp) {

    });

}

function redeemReward(transID) {
    'use strict';
    sendRequest({
        name: "redeem-reward",
        data: {
            transactionID: transID
        }
    }, function(resp) {

    });
}
