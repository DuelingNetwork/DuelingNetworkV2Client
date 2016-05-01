var sound = {};


(function () {
    'use strict';
    sound.play = function (targetID) {

        document.getElementById(targetID).play();
    };
    sound.activateCard = function () {
        sound.play('soundactivateCard');
    };
    sound.attack = function () {
        sound.play('soundattack');
    };
    sound.banishCard = function () {
        sound.play('soundbanishCard');
    };
    sound.cardShuffle = function () {
        sound.play('soundcardShuffle');
    };
    sound.changeLifePoints = function () {
        sound.play('soundchangeLifePoints');
    };
    sound.drawCard = function () {
        sound.play('sounddrawCard');
    };
    sound.endDuelAdminLoss = function () {
        sound.play('soundendDuelAdminLoss');
    };
    sound.endDuelLoss = function () {
        sound.play('soundendDuelLoss');
    };
    sound.endDuelVictory = function () {
        sound.play('soundendDuelVictory');
    };
    sound.endTurn = function () {
        sound.play('soundendTurn');
    };
    sound.flipCoin = function () {
        sound.play('soundflipCoin');
    };
    sound.flipSummon = function () {
        sound.play('soundflipSummon');
    };
    sound.incomingPrivateMessage = function () {
        sound.play('soundincomingPrivateMessage');
    };
    sound.matchVictory = function () {
        sound.play('sound');
    };
    sound.outgoingPrivateMessage = function () {
        sound.play('soundmatchVictory');
    };
    sound.rollDie = function () {
        sound.play('soundrollDie');
    };
    sound.setCard = function () {
        sound.play('soundsetCard');
    };
    sound.specialSummonFromExtra = function () {
        sound.play('soundspecialSummonFromExtra');
    };
    sound.summonCard = function () {
        sound.play('soundsummonCard');
    };
    sound.takeScreenshot = function () {
        sound.play('soundtakeScreenshot');
    };
}());