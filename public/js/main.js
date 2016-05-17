'use strict';

var socket;

$(document).ready(init);

function init() {
    socket = io();

    var playerHand = [];

    socket.on('card', function(card) {
        if (playerHand.length < 5) {
            playerHand.push(card);
        }
        
        playHand(playerHand);
    });
}

function playHand(playerHand) {
    $('#c1').text(playerHand[0]);
    $('#c2').text(playerHand[1]);
    $('#c3').text(playerHand[2]);
    $('#c4').text(playerHand[3]);
    $('#c5').text(playerHand[4]);

    var hand = Hand.solve(playerHand);
    // console.log(hand.name); // Two Pair
    //console.log(hand.descr); // Two Pair, A's & Q's
    var descr = hand.descr;
    $('#send').on('click', function () {
        sendHand(playerHand);
    });

    console.log('player Hand', playerHand);

    socket.on('winner', function (winner) {
        console.log(winner);
        if (winner[0].descr === descr) {
            console.log('You win')
        }
        else {
            console.log('You Lose')
        }
    });
}

function sendHand(hand){
    socket.emit('sendHand', hand)
}